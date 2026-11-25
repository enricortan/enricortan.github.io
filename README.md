# enricortan.com

Enrico R. Tan's portfolio, "The Seam". A static [Astro 7](https://docs.astro.build) site: MDX content in folders, no database, no server, no tokens. GitHub Actions builds it and deploys it to GitHub Pages at **enricortan.com**.

This page is the editing guide. Agents working in the repo also read [CLAUDE.md](CLAUDE.md).

## Run it

Needs Node 24 (22.23.4 or newer works).

```sh
npm ci              # install exactly what package-lock.json says
npm run dev         # http://localhost:4321, live reload; protected pages show in plain text with a DEV badge
npm run build       # production build into dist/ (see "Protected entries" for the password)
npm run preview     # serve dist/ at http://localhost:4321
npm run check       # types + content schemas, the same check CI runs
npm run verify      # after a build: proves no protected text leaked into dist/ or the sealed bundle
npm run guard       # file names, nothing private tracked, sealed bundle up to date, no TODO(Enrico) values
npm run seal        # encrypt src/content-private/ into sealed/ (see "Protected entries")
npm run unseal      # restore src/content-private/ from sealed/ (needs CONTENT_KEY in .env)
```

## Where things live

| What | Where |
|---|---|
| Case studies | `src/content/work/<slug>/index.mdx` + its images and video in the same folder |
| Protected (FLNT) entries | `src/content-private/<work\|lab\|notes>/<slug>/` (not in git; sealed into `sealed/content-private.sealed`) |
| Lab items | `src/content/lab/<slug>/index.mdx` (gets its own page only when the MDX has a body) |
| Notes | `src/content/notes/<slug>/index.mdx` |
| You: name, bio, email, experience, skills | `src/data/profile.yaml` |
| Site copy: nav, home sections, SEO, 404, redirects | `src/data/site.yaml` |
| Field rules (what's required) | `src/content.config.ts` |
| Live prototypes (kept as built files) | `public/eauction/`, `public/auction/` |
| Look and motion (Kai) | `src/styles/`, `src/components/seam/`, `src/scripts/` |

The folder name is the URL: `src/content/work/cimb-pay/` becomes `enricortan.com/work/cimb-pay/`. Use lowercase letters, numbers and hyphens. No spaces.

## Add a project in 5 steps

1. **Copy a folder.** Duplicate an existing case study, e.g. `src/content/work/cimb-pay/`, and rename it to the new slug.
2. **Fill in the frontmatter** at the top of `index.mdx`. Required: `title`, `summary` (≤ 160 characters), `hook`, `client`, `role`, `year`, `status`, `type`, `cover`, `coverAlt`, `confidentiality`. Optional: `team`, `period`, `tools`, `coverVideo`, `coverVideoDescription`, `poster`, `featured`, `order`, `disclaimer`, `metrics` (each with a `source`), `links`. (Confidential? Put the folder in `src/content-private/` with `protected: true`; see below.)
3. **Drop in the media** next to `index.mdx`: `cover.jpg` (or .png/.webp), screenshots, loops. Images are resized and converted to AVIF/WebP at build time, so commit one good source per image (≤ 3000 px wide).
4. **Write the body** in Markdown. These components work without an import: `Figure`, `Video`, `SpecScrub`, `DecisionTrail`, `MarginNote`, `SpecSheet`. Media needs an import:
   ```mdx
   import board from './01-feature-board.jpg'
   import loop from './loop.h264.mp4'
   import poster from './loop.poster.webp'

   <Figure src={board} alt="What the image shows, for someone who can't see it." caption="Optional caption." />
   <Video h264={loop} poster={poster} description="What the loop shows, in words." />
   ```
   The spec sheet (Role, Client, Team, Year, Status, Tools) is drawn from the frontmatter, so don't add one to the body.
5. **Preview and publish.** `npm run dev`, check the page, then commit and push to `main`. It's live in about 2–3 minutes.

Not ready yet? Set `draft: true` (or `confidentiality: pending`). It still shows in `npm run dev`, with a DRAFT badge, and never builds for the live site. `visibility: unlisted` builds the page but keeps it out of lists, the sitemap and search engines.

**The build stops (on purpose) when:** a `cover` or `coverAlt` is missing, a field has the wrong type, a video path doesn't exist, a `protected: true` entry sits in `src/content/` (or an unprotected one in `src/content-private/`), protected text would leak, or (in CI) a value in `profile.yaml`/`site.yaml` is still `TODO(Enrico)` (comments are fine; to hide a fact, delete the line: `location`, `availability`, `cv`, social links and experience dates are optional). The error names the file and the field.

## Protected entries (all FLNT work)

Protected entries are encrypted twice:
- **On the live site,** the page body is encrypted. Its title stays listed with a lock; visitors unlock it with one shared password, and it stays unlocked for that browser tab.
- **In the repo (which is public),** the source is never committed in the clear. It lives in `src/content-private/` (ignored by git), and only an encrypted copy, `sealed/content-private.sealed`, is committed.

| | Public entry | Protected entry |
|---|---|---|
| Folder | `src/content/<work\|lab\|notes>/<slug>/` | `src/content-private/<work\|lab\|notes>/<slug>/` |
| Frontmatter | no `protected` | `protected: true` (required there, and forbidden in `src/content/`) |
| In git | as is | only inside `sealed/content-private.sealed` |

**Two secrets, both only in `.env` (ignored by git), your password manager, and GitHub → Settings → Secrets and variables → Actions:**
- `PROTECTED_PASSWORD`: what visitors type to unlock pages. A long passphrase (4+ random words), used nowhere else.
- `CONTENT_KEY`: the key that seals `src/content-private/`. Create it once with `npm run keygen`. It is written to `.env` and never printed; copy it from `.env` into your password manager and the GitHub secret `CONTENT_KEY`. **Lose it and the sealed FLNT source is gone for good** (your local `src/content-private/` is the only other copy).

**Editing an FLNT entry:**
1. Edit files in `src/content-private/…` and preview with `npm run dev` (a coral "DEV: protected" badge shows; the page is plain text locally).
2. Run `npm run seal`. Git can't see `src/content-private/`, so on its own an FLNT-only change looks like "nothing to commit".
3. Commit and push as usual. The pre-commit hook re-seals if anything changed since step 2, stages `sealed/`, and blocks the commit if a private file or a `protected: true` entry in `src/content/` is about to be committed.

To add a new protected entry, create its folder under `src/content-private/`, not `src/content/`.

**On a new machine:** clone, `npm ci` (this also turns on the git hook), put both secrets in `.env` (see `.env.example`), then `npm run unseal`. Unseal never overwrites a local file you changed after the bundle was written; it stops and lists them (`npm run unseal -- --force` discards them).

**What CI does:** it unseals with the `CONTENT_KEY` secret, checks that the unsealed tree matches the bundle, then builds with `PROTECTED_PASSWORD`. If either secret is missing, the deploy **fails**; it never ships the site silently without the FLNT pages, or with them locked.

**Limits:**
- Images and videos inside a protected page are *unlisted* on the live site (hashed URLs that no public page links to), not encrypted.
- Every sealed version stays in git history. If `CONTENT_KEY` ever leaks, all past versions are readable: rotate the key (`npm run seal -- --rekey` after changing it in `.env` and the secret), and treat the old content as exposed.
- To change the page password, update the secret and re-run the deploy (Actions → Build and deploy → Run workflow).

Details: [src/lib/protect/README.md](src/lib/protect/README.md).

## Media rules

- **Stills:** commit one PNG/JPG/WebP per image, ≤ 3000 px wide. No device mockups, no baked shadows, client data redacted.
- **Loops:** ≤ 2 MB each (hero ≤ 3 MB), hard cap 25 MB per file (GitHub Pages). Masters (`.mov`, `.blend`, `.psd`) never go in git; `.gitignore` blocks them.
- **Long films** go on YouTube or Vimeo behind a click-to-load poster, not in the repo.
- **Encode** a recording with Kai's presets (needs ffmpeg with libsvtav1 and libx264):
  ```sh
  bash scripts/encode-video.sh ~/Captures/master.mov src/content/work/<slug>/hero 0.5 5.5
  # -> hero.av1.mp4 (AV1 10-bit), hero.h264.mp4 (fallback), hero.poster.webp; prints sizes vs budget
  ```
  For a cover loop, set `coverVideo: ./hero.h264.mp4` (the `.av1.mp4` sibling is found automatically), `poster: ./hero.poster.webp` and `coverVideoDescription`.

## Deploy

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. `npm ci`, then `npm run unseal` (with the `CONTENT_KEY` secret);
2. `npm run guard`: file names, nothing private tracked, unsealed tree matches the bundle, no `TODO(Enrico)` values;
3. `astro check`, `npm run build` (with the `PROTECTED_PASSWORD` secret), `npm run verify`;
4. link check (lychee, offline);
5. deploy to GitHub Pages.

Pull requests run steps 1–4 and attach the built site as an artifact (download it, unzip into `dist/`, `npm run preview`). Pull requests from forks get no secrets, so they stop at step 1.

**One-time GitHub settings** (repo `enricortan/enricortan.github.io`):

1. Settings → Pages → Build and deployment → **Source: GitHub Actions**.
2. Settings → Pages → Custom domain **enricortan.com**, **Enforce HTTPS** on. (DNS doesn't change.)
3. Settings → Environments → `github-pages` → deployment branches: **main** only.
4. Your account's Settings → Pages → **verify enricortan.com** (stops domain takeover).
5. Settings → Branches → protect `main`: require the "Build and deploy / build" check.
6. Add the `PROTECTED_PASSWORD` and `CONTENT_KEY` secrets (see "Protected entries"). Revoke the old `MY_SYNC_TOKEN` / `DEPLOY_KEY` tokens and delete the `VITE_SUPABASE_*` secrets.

## Rollback

- **Bad commit:** revert it (`git revert <sha>`, push). The previous version is live again in about 2 minutes.
- **Back to the old site** (kept for 30 days on branch `legacy-live`): Settings → Pages → Source: **Deploy from a branch** → `legacy-live` / root. To return, set the source back to **GitHub Actions** and re-run the latest deploy.

## Old URLs

`/thoughts` and `/thoughts/*` go to `/notes/`. `/admin*`, `/login`, `/dashboard` and `/settings` go to `/`. `/contact` goes to `/#contact`. `/eauction/` and `/auction/` still serve the prototype. Add more in `site.yaml` under `redirects` (exact paths become redirect pages; `*` rules are handled by the 404 page).
