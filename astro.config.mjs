// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { protect, protectAudit, isNoindexUrl } from './src/integrations/protect.ts';
import { readRedirects } from './src/lib/urls.ts';

// Redirects come from src/data/site.yaml (Nora) plus the defaults in src/lib/urls.ts.
const { exact: redirects } = readRedirects(fileURLToPath(new URL('.', import.meta.url)));

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Absolute origin: canonical URLs, Open Graph, RSS and the sitemap are built from it.
  site: 'https://enricortan.com',

  // Every page is a folder with index.html, so GitHub Pages serves clean URLs
  // (and redirects /work -> /work/ by itself). Links in the code always end in "/".
  trailingSlash: 'always',
  build: { format: 'directory' },

  integrations: [
    mdx(),
    // Order matters: protect() encrypts and records noindex pages BEFORE sitemap() runs,
    // and protectAudit() re-checks the finished dist (sitemap included) AFTER it.
    protect(),
    sitemap({ filter: (page) => !isNoindexUrl(page) }),
    protectAudit(),
  ],

  // Exact old paths become static redirect pages (meta refresh). Wildcards (/thoughts/*, /admin*)
  // can't be pre-rendered: src/pages/404.astro forwards those.
  redirects,

  // No prefetch, no client router: MPA + CSS cross-document view transitions (see SeamHead).
  devToolbar: { enabled: false },
});
