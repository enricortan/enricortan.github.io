# Password-protected pages

Owner: Theo. Files: `src/integrations/protect.ts` (build), `src/lib/protect/unlock.ts` (browser),
`src/lib/protect/mode.ts`, `src/layouts/partials/Protected.astro`, `scripts/verify-protected.mjs`;
source sealing: `scripts/lib/sealed.mjs`, `scripts/{seal,unseal,keygen,guard}.mjs`, `.githooks/pre-commit`.

Two independent layers, two independent secrets:

| Layer | Protects | Secret | Where |
|---|---|---|---|
| **Source sealing** | the MDX + media in the public **repo** | `CONTENT_KEY` (32 random bytes) | `src/content-private/` (gitignored) ⇄ `sealed/content-private.sealed` (committed) |
| **Page encryption** | the body of the page on the **live site** | `PROTECTED_PASSWORD` (what visitors type) | built HTML |

## Source sealing (the repo)

A protected entry must live in `src/content-private/<work|lab|notes>/<slug>/` with `protected: true`.
The content loader fails the build for a `protected: true` entry under `src/content/`, or an entry
without it under `src/content-private/`. Ids must be unique across both trees.

- **Seal** (`npm run seal`; the pre-commit hook runs `seal --if-changed`): all files under
  `src/content-private/` in sorted path order, raw bytes → a deterministic bundle → gzip →
  **AES-256-GCM** (random 12-byte IV) with a key derived by HKDF-SHA256 from `CONTENT_KEY`. The header
  holds **HMAC-SHA256** of the plaintext bundle under a separate HKDF subkey: `--if-changed` compares
  it to skip re-sealing an unchanged tree (no new random blob per commit), and `npm run guard` uses it to
  detect a stale or tampered tree. It reveals only "same or different". Magic + HMAC are GCM additional
  data. Format details: `scripts/lib/sealed.mjs`.
- **Seal refuses** to overwrite a bundle the current key can't open (wrong key in `.env`), unless you pass
  `--rekey` on purpose. It also refuses to seal an empty tree over an existing bundle, unless you pass `--allow-empty`.
- **Unseal** (`npm run unseal`) authenticates, then writes files that are missing or older than the bundle
  file. A local file that differs and is newer is treated as an unsaved edit: nothing is written unless `--force`.
- **Hook** (`.githooks/pre-commit`, enabled by `npm install` via `core.hooksPath`): blocks staged files in
  `src/content-private/`, staged `protected: true` entries under `src/content/`, and bad file names. Then it
  seals if needed and stages `sealed/`. Git decides "nothing to commit" before hooks run, so after an
  FLNT-only edit run `npm run seal` yourself, then commit.
- **CI:** unseal with the `CONTENT_KEY` secret → `npm run guard` (tree HMAC must equal the header; no
  tracked private files) → build. A missing `CONTENT_KEY` or `PROTECTED_PASSWORD` fails the run.
- **Limits:** every sealed version stays in git history. If `CONTENT_KEY` leaks, all versions are
  readable; rotating the key protects only future commits. Bundle size and change times are visible.

## What a protected page shows

Set `protected: true` in an entry's frontmatter (work, lab or notes) and keep the folder in `src/content-private/`. On the built site:

- **Public:** the entry's number, title, year/status in lists, and the page's `<title>`. Lists show
  a lock marker and **no** cover, summary, hook or proof. The page has `robots: noindex`, a generic
  brand Open Graph image and a generic description, and it is left out of the sitemap and RSS.
- **Encrypted:** everything the layout renders inside `<Protected>`: claim, spec sheet (client, team,
  tools), cover render or video, the whole MDX body, outcome metrics, links.

## How the encryption works

1. `astro build` renders the page normally. `Protected.astro` wraps the body between two sentinels
   (`<i hidden data-protect-begin="slug">` … `<i hidden data-protect-end="slug">`).
2. In `astro:build:done`, `protect()` takes the HTML between the sentinels and encrypts it:
   - key = **PBKDF2-SHA256, 600,000 iterations**, random 16-byte salt (one salt per build), from
     `PROTECTED_PASSWORD`;
   - **AES-256-GCM**, random 12-byte IV per page (Node `crypto.webcrypto`, the same API the
     browser uses);
   - the HTML is replaced by `<script type="application/json" data-protected-payload>{"v":1,"salt","iv","ct"}</script>`
     (base64). `v: 1` fixes the parameters above.
   - External `<script src>` tags inside the body (bundled component behaviour, no content) are
     moved out of the ciphertext so they load with the page.
3. `protectAudit()` runs after the sitemap is written and **fails the build** if any sentinel, any
   sentence of protected text (≥ 40 characters, alt text included), a protected summary/hook/proof,
   or any media file used only by a protected page shows up anywhere else in `dist/`.
4. CI then runs `npm run verify`, an independent check that reads the MDX sources directly.

**No password, no content.** If `PROTECTED_PASSWORD` is not set, protected pages build with a
"locked — unavailable" notice: no ciphertext and no plaintext. The build logs a warning.

**Dev.** `astro dev` shows the plaintext with a coral "DEV: protected" badge, so pages can be
written and previewed. Dev output is never deployed; the audit fails if a dev marker reaches `dist/`.

## Unlocking in the browser

`unlock.ts` derives the key with WebCrypto, decrypts, injects the HTML, re-runs inline scripts,
and dispatches **`protected:unlocked`** on `document` (`detail: { slug, container }`).
Kai's components initialise on `DOMContentLoaded` **and** on that event.

The derived AES key (not the password) is kept in `sessionStorage` under `er-protect:v1:<salt>`,
so one unlock opens every protected page **of that build** until the tab closes. A wrong password
fails GCM authentication and shows the error state; there is no lockout (the cost is the 600k-round
key derivation, about 0.3–1 s per try).

## Attribute contract (LockGate ↔ unlock.ts)

Kai's `LockGate.astro` (`{ slug }`) supplies markup and styling only; `unlock.ts` drives it.

| Element | Attribute | Notes |
|---|---|---|
| gate root | `data-lock-gate`, `data-lock-slug="{slug}"` | The script sets `data-lock-state` = `idle` · `unlocking` · `error` · `unlocked` · `unavailable`, and `hidden` once unlocked. |
| `<form>` | `data-lock-form` | Submit is intercepted. Gets `aria-busy` while unlocking; `hidden` when unavailable. |
| `<input type="password">` | `data-lock-input` | Gets `aria-invalid="true"` on error; focused + selected after an error. |
| submit button | `data-lock-submit` (optional) | Disabled while unlocking (all form controls are). |
| error text | `data-lock-error` | Script writes the message and toggles `hidden`. Empty otherwise. |
| status text | `data-lock-status` (`aria-live="polite"`) | "Unlocking…" / "Unlocked." |
| unavailable text | `data-lock-unavailable` (optional) | Shown (un-hidden) when the page has no payload. |

The layout owns: `[data-protected-content][data-protected-slug]` (the container; gets
`data-protected-state` = `locked` · `unlocked` · `unavailable` · `dev`), and on `<html>`
`data-protected="unlocked"` after a successful unlock.

## Limits (read this before marking something protected)

- **Media are unlisted, not encrypted.** Images and videos used inside a protected body are
  ordinary files in `/_astro/` with hashed names. They are referenced only from the ciphertext,
  never from a public page, the sitemap, RSS or an OG image (the audit enforces this), but anyone
  who has the exact URL can fetch them. Don't put anything in a protected entry's media that would
  be harmful if one image leaked: use fixture data, blur client names.
- **One shared password** for all protected pages. Anyone who has it can share it. Rotate it by
  changing the `PROTECTED_PASSWORD` secret and re-running the deploy; old keys in open tabs stop working.
- **Offline guessing.** The ciphertext is public, so a weak password can be brute-forced offline.
  Use a long passphrase (4+ random words). 600k PBKDF2 rounds slow guessing; they don't stop it.
- **Titles are public.** Keep anything confidential out of `title`.
- **The source is protected only by sealing.** Page encryption protects the *deployed site*; the
  repo (public) carries the source only as `sealed/content-private.sealed` (see "Source sealing"
  above). Anything confidential copied outside `src/content-private/` is NOT covered.
