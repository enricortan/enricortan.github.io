/**
 * URL helpers shared by astro.config.mjs, layouts and pages (Theo).
 *
 * The site uses `trailingSlash: 'always'`, so internal links must end in "/" (GitHub Pages would
 * redirect `/work` -> `/work/`, but `astro dev` 404s and the link checker counts it as an error).
 * Content can write `/work` and `href` normalises it.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/** `/work` -> `/work/`, `/notes/x#y` -> `/notes/x/#y`. External, mailto, files and hashes untouched. */
export function href(url: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const match = /^([^?#]*)([?#].*)?$/.exec(url);
  const [, pathname = '/', rest = ''] = match ?? [];
  if (pathname.endsWith('/') || path.posix.extname(pathname)) return url;
  return `${pathname}/${rest}`;
}

export type Redirects = {
  /** Exact old path -> new URL; pre-rendered as static redirect pages. */
  exact: Record<string, string>;
  /** `prefix*` rules; GitHub Pages serves 404.html for these, and its inline script forwards them. */
  wildcard: { prefix: string; to: string }[];
};

/** The defaults (study/01-content-audit.md §5); src/data/site.yaml `redirects` adds to them. */
const DEFAULTS: { from: string; to: string }[] = [
  { from: '/thoughts', to: '/notes/' },
  { from: '/thoughts/*', to: '/notes/' },
  { from: '/admin', to: '/' },
  { from: '/admin/*', to: '/' },
  { from: '/login', to: '/' },
  { from: '/dashboard', to: '/' },
  { from: '/settings', to: '/' },
  { from: '/contact', to: '/#contact' },
];

/**
 * Reads redirects from site.yaml at config time. A wildcard target like `/notes/*` goes to the
 * section index (`/notes/`): the old slugs were not migrated, so a same-slug redirect would 404.
 */
export function readRedirects(root: string): Redirects {
  let fromYaml: { from: string; to: string }[] = [];
  const file = path.join(root, 'src', 'data', 'site.yaml');
  if (existsSync(file)) {
    try {
      const data = parseYaml(readFileSync(file, 'utf-8')) as { redirects?: { from?: unknown; to?: unknown }[] };
      fromYaml = (data?.redirects ?? []).filter(
        (r): r is { from: string; to: string } => typeof r?.from === 'string' && typeof r?.to === 'string',
      );
    } catch {
      /* the content layer reports YAML errors with a proper message */
    }
  }
  const exact: Record<string, string> = {};
  const wildcard: Redirects['wildcard'] = [];
  for (const { from, to } of [...DEFAULTS, ...fromYaml]) {
    const target = href(to.replace(/\*$/, ''));
    if (from.includes('*')) {
      const prefix = from.slice(0, from.indexOf('*'));
      if (!wildcard.some((w) => w.prefix === prefix)) wildcard.push({ prefix, to: target });
      // `/admin*` also needs the bare `/admin` page.
      const bare = prefix.replace(/\/$/, '');
      if (bare && !(bare in exact)) exact[bare] = target;
    } else {
      exact[from.replace(/\/$/, '') || '/'] = target;
    }
  }
  delete exact['/'];
  return { exact, wildcard };
}
