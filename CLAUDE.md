# CLAUDE.md: rules for agents working on enricortan.com

Enrico R. Tan's portfolio ("The Seam"). Static Astro 7, MDX content collections, plain CSS, no client framework. Deployed by GitHub Actions to GitHub Pages. Enrico owns every decision; agents propose, he approves. The editing guide for humans is [README.md](README.md).

## Standing roles and lanes

Three roles (definitions in `.claude/agents/`). Edit only your lane. When several agents work at once, never overwrite a file in someone else's lane: report what you need instead.

| Role | Owns |
|---|---|
| **Nora**, content | `src/content/**`, `src/content-private/**` (protected entries, gitignored), `src/data/**` (profile.yaml, site.yaml) |
| **Kai**, brand & motion | `src/styles/**`, `src/components/seam/**`, `src/scripts/**`, `src/assets/brand/**`, `public/fonts/**`, `public/favicon*` |
| **Theo**, build & ship | `package.json` + lockfile (the only one who runs `npm install`), `astro.config.mjs`, `tsconfig.json`, `src/content.config.ts`, `src/pages/**`, `src/layouts/**`, `src/lib/**`, `src/integrations/**`, `public/eauction/**`, `public/auction/**`, `public/CNAME`, `.github/**`, `.githooks/**`, `scripts/**`, `sealed/**` (written only by `npm run seal`), README/CLAUDE/AGENTS.md, `.env.example`, `.gitignore`, `.gitattributes` |

Contracts between lanes:
- **Fields:** `src/content.config.ts` (Theo builds the mechanism, Nora decides the fields).
- **Components:** props listed in each `src/components/seam/*.astro`. Layouts and MDX use them.
- **Class API:** the header of `src/styles/global.css`.
- **Lock gate:** `src/lib/protect/README.md` (`data-lock-*` attributes, `protected:unlocked` event).

## Brand

Kai's spec is the source of truth: `../study/02-brand-motion.md` during the build, then the header of `src/styles/global.css` and `src/styles/tokens.css`. In short: navy ground, mint draws lines and rarely fills, coral redline is a signal only (< 1% of the screen), square corners, no glows, Archivo + IBM Plex Mono (shipped as "ER Mono", OFL reserved-name rule), 12-column grid, ruled lists not card grids, no device mockups. Native scrolling, no scroll hijacking; reduced motion means less motion, never hidden content. No Tailwind, Lenis, GSAP or React unless Enrico approves a real need.

## Security rules (non-negotiable)

1. **Never commit or print secrets.** No passwords, tokens or keys in any file, commit message, log, tool output or test fixture. `PROTECTED_PASSWORD` (page password) and `CONTENT_KEY` (seals the FLNT source) live only in `.env` (gitignored), Enrico's password manager and the GitHub Actions secrets. Never `cat .env`, echo either value, or pass them on a command line that gets logged. `npm run keygen` writes CONTENT_KEY without printing it.
2. **No personal access tokens.** CI uses `GITHUB_TOKEN` / OIDC only. Pin third-party actions to full commit SHAs. Keep job permissions minimal.
3. **Never reference protected media publicly.** A protected entry's images, video, summary, hook, proof and body must not appear on any public page, list, OG image, sitemap or RSS. Lists show title + lock only. The build audit (`src/integrations/protect.ts`) and `npm run verify` fail on any leak. Never weaken, skip or bypass those checks; fix the leak instead.
4. **The repo is public; confidential source is committed only sealed.** Protected entries live in `src/content-private/` (gitignored) and reach git only as `sealed/content-private.sealed` (AES-256-GCM with CONTENT_KEY). Never `git add -f` anything in `src/content-private/`, never move a protected entry into `src/content/`, never commit unsealed copies, exports or screenshots of it anywhere else (docs, tests, `study/`). The pre-commit hook and `npm run guard` block these; never bypass them (`--no-verify`) and never edit `sealed/` by hand. After editing a protected entry, run `npm run seal` before committing.
5. **FLNT work:** fixture data only; no client or tenant names; no colleague names without consent; unreleased features held back. All FLNT work is `protected: true` and lives in `src/content-private/` for now.
6. **No fabricated content.** No invented metrics, testimonials, clients or dates. Unknown facts stay as `TODO(Enrico)` (or the line is left out: `location`, `availability`, `cv`, social links and experience dates are optional); CI refuses to deploy while any `TODO(Enrico)` value remains in `src/data/`.
7. File names: no trailing spaces, no `< > : " | ? * \`. CI checks this.

## Working here

- `npm run dev` (http://localhost:4321) to preview; `npm run check` and `npm run build` before you hand off. Build into your own folder (`npx astro build --outDir <tmp>`) if another agent may be building at the same time.
- Internal links end in `/` (`trailingSlash: 'always'`). Use `href()` from `src/lib/urls.ts` for links that come from content.
- Media: images next to the entry's `index.mdx`, imported in MDX; loops encoded with `scripts/encode-video.sh` (≤ 2 MB, hero ≤ 3 MB, 25 MB hard cap).
- Don't commit or push unless the orchestrator or Enrico asks. Never force-push `main`.
