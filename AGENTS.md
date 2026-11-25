# AGENTS.md

Read [CLAUDE.md](CLAUDE.md) first: lanes, brand and security rules for this repo. The editing guide is [README.md](README.md).

## Development

`npm run dev` serves http://localhost:4321. To run it in the background, use Astro's background mode (`astro dev --background`, then `astro dev stop` / `astro dev status` / `astro dev logs`). If another agent already runs a dev server, use it rather than starting a second one.

Before handing off: `npm run check`, then `npm run build` (or `npx astro build --outDir <tmp>` when others may be building), then `npm run verify`.

Protected (FLNT) entries live in `src/content-private/` (gitignored). After changing anything there, run `npm run seal` so `sealed/content-private.sealed` is current. Never print `.env` or either secret in it.

## Documentation

Astro docs: https://docs.astro.build (this repo is on Astro 7: Zod 4 from `astro/zod`, content collections with loaders in `src/content.config.ts`).

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Images](https://docs.astro.build/en/guides/images/)
- [View transitions](https://docs.astro.build/en/guides/view-transitions/) (this site uses CSS cross-document transitions only, no `<ClientRouter />`)
