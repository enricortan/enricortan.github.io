/**
 * Build-time encryption for password-protected entries (Theo). Model: src/lib/protect/README.md.
 *
 * protect()       astro:config:setup  decides the mode (dev | encrypt | locked) and injects it as
 *                                     __PROTECT_MODE__ (never the password).
 *                 astro:build:done    for every built page, seals the HTML between the
 *                                     data-protect-begin/-end sentinels:
 *                                       encrypt -> AES-256-GCM, key = PBKDF2-SHA256(600k, salt16), iv12
 *                                       locked  -> a "locked — unavailable" notice, no ciphertext
 *                                     records noindex pages for the sitemap filter, prunes media
 *                                     nothing references.
 * protectAudit()  astro:build:done    (runs after @astrojs/sitemap) fails the build if anything
 *                                     protected survives in plaintext anywhere in dist/.
 */
import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { createHash, webcrypto } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { parse as parseYaml } from 'yaml';

export const PBKDF2_ITERATIONS = 600_000;
const ENV_VAR = 'PROTECTED_PASSWORD';
const MIN_FRAGMENT = 40;
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.mjs', '.css', '.svg', '.webmanifest', '.map']);
const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.mp4', '.webm', '.mov', '.pdf']);

type Mode = 'dev' | 'encrypt' | 'locked';

// ---- state shared between protect(), the sitemap filter and protectAudit() (one build per process) ----
const state = {
  root: process.cwd(),
  mode: 'locked' as Mode,
  password: undefined as string | undefined,
  noindex: new Set<string>(),
  protectedRoutes: new Set<string>(),
  fragments: new Map<string, string>(), // normalised text -> route it came from
  assets: new Map<string, string>(), // media basename -> route
};

/** Sitemap filter: true for any page that carries robots noindex (protected, unlisted, 404 …). */
export function isNoindexUrl(page: string): boolean {
  return state.noindex.has(normaliseRoute(new URL(page, 'https://x.invalid').pathname));
}

// ---------------------------------------------------------------- helpers

function readPassword(root: string): string | undefined {
  const fromEnv = process.env[ENV_VAR];
  if (fromEnv) return fromEnv;
  const dotenv = path.join(root, '.env');
  if (!existsSync(dotenv)) return undefined;
  try {
    return parseEnv(readFileSync(dotenv, 'utf-8'))[ENV_VAR] || undefined;
  } catch {
    return undefined;
  }
}

const normaliseRoute = (p: string) => {
  let r = decodeURI(p).replace(/index\.html$/, '');
  if (!r.startsWith('/')) r = '/' + r;
  if (!r.endsWith('/') && !path.posix.extname(r)) r += '/';
  return r;
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const routeOf = (dist: string, file: string) =>
  normaliseRoute('/' + path.relative(dist, file).replaceAll('\\', '/'));

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** Comparable plain text: tags dropped, entities decoded, quotes/dashes/whitespace normalised. */
function normaliseText(s: string): string {
  return decodeEntities(s)
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*type="application\/json"[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<(script|style|template|svg)\b[\s\S]*?<\/\1>/gi, '\n')
    .replace(/<[^>]+>/g, '\n');
}

/** Sentences (and long alt texts) from protected HTML that must never appear in public files. */
function fragmentsOf(html: string): string[] {
  const out = new Set<string>();
  const blocks = htmlToText(html).split(/\n+/);
  for (const alt of html.matchAll(/\balt="([^"]+)"/g)) blocks.push(alt[1]);
  for (const block of blocks) {
    for (const sentence of normaliseText(block).split(/(?<=[.!?])\s+/)) {
      if (sentence.length >= MIN_FRAGMENT) out.add(sentence);
    }
  }
  return [...out];
}

/** Media files (by basename) referenced from protected HTML. */
function assetsOf(html: string): string[] {
  const out = new Set<string>();
  for (const m of html.matchAll(/\/_astro\/([^"'\s),?#]+)/g)) {
    if (MEDIA_EXT.has(path.extname(m[1]).toLowerCase())) out.add(m[1]);
  }
  return [...out];
}

/** Markup without <script> bodies: bundled code mentions the marker names as strings. */
const markupOnly = (html: string) => html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
const SENTINEL_TAG = /<i\b[^>]*\bdata-protect-(begin|end)\b/;
const DEV_MARKER_TAG = /<[a-z][^>]*\sdata-(protected-dev|dev-badge)\b/i;

const BEGIN = /<i\b[^>]*\bdata-protect-begin(?:="([^"]*)")?[^>]*>\s*<\/i>/g;
const END = /<i\b[^>]*\bdata-protect-end(?:="([^"]*)")?[^>]*>\s*<\/i>/g;
/** External scripts (Astro-bundled component behaviour) are code, not content: they stay public. */
const EXTERNAL_SCRIPT = /<script\b(?=[^>]*\bsrc=")[^>]*>\s*<\/script>/gi;

type Sealer = (inner: string, slug: string) => Promise<string>;

/** Replaces every begin…end span in `html` with `seal(inner)`. Throws on malformed sentinels. */
async function sealPage(html: string, route: string, seal: Sealer): Promise<{ html: string; spans: string[] }> {
  const spans: string[] = [];
  let out = '';
  let cursor = 0;
  BEGIN.lastIndex = 0;
  for (let begin = BEGIN.exec(html); begin; begin = BEGIN.exec(html)) {
    const slug = begin[1] ?? '';
    END.lastIndex = begin.index + begin[0].length;
    const end = END.exec(html);
    if (!end) throw new Error(`[protect] ${route}: data-protect-begin="${slug}" has no matching end sentinel`);
    const inner = html.slice(begin.index + begin[0].length, end.index);
    if (/\bdata-protect-begin\b/.test(inner)) throw new Error(`[protect] ${route}: nested protected sections are not supported`);
    if ((end[1] ?? '') !== slug) throw new Error(`[protect] ${route}: sentinel slugs differ ("${slug}" vs "${end[1]}")`);
    spans.push(inner);
    out += html.slice(cursor, begin.index) + (await seal(inner, slug));
    cursor = end.index + end[0].length;
    BEGIN.lastIndex = cursor;
  }
  if (END.test(html.slice(cursor))) throw new Error(`[protect] ${route}: stray data-protect-end sentinel`);
  END.lastIndex = 0;
  return { html: out + html.slice(cursor), spans };
}

const b64 = (bytes: ArrayBuffer | Uint8Array) => Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString('base64');

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
  const { subtle } = webcrypto;
  const material = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

type SourceEntry = {
  route: string;
  dir: string;
  file: string;
  isProtected: boolean;
  published: boolean;
  /** Protected entries: frontmatter text that must stay inside the ciphertext. */
  secrets: string[];
  /** Protected entries: text that is public by design (title, role) even though the spec sheet repeats it. */
  publicText: Set<string>;
};

/** Reads every entry's frontmatter straight from src/content and src/content-private (independent of the content layer). */
function scanEntries(root: string): SourceEntry[] {
  const out: SourceEntry[] = [];
  for (const [tree, collection] of (['content', 'content-private'] as const).flatMap((t) =>
    (['work', 'lab', 'notes'] as const).map((c) => [t, c] as const),
  )) {
    const base = path.join(root, 'src', tree, collection);
    if (!existsSync(base)) continue;
    const stack = [base];
    while (stack.length) {
      const dir = stack.pop() as string;
      for (const entry of readdirSyncSafe(dir)) {
        if (entry.isDirectory() && !entry.name.startsWith('_')) stack.push(path.join(dir, entry.name));
        if (!entry.isFile() || entry.name !== 'index.mdx') continue;
        const file = path.join(dir, entry.name);
        const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(readFileSync(file, 'utf-8'));
        if (!fm) continue;
        let data: Record<string, unknown>;
        try {
          data = (parseYaml(fm[1]) ?? {}) as Record<string, unknown>;
        } catch {
          continue; // the content layer reports YAML errors itself
        }
        const unpublished = data.draft === true || data.visibility === 'draft' || data.confidentiality === 'pending';
        const body = fm[2].replace(/^\s*(import|export)\s.*$/gm, '').trim();
        const role = Array.isArray(data.role) ? data.role.join(', ') : typeof data.role === 'string' ? data.role : '';
        out.push({
          route: `/${collection}/${path.basename(dir)}/`,
          dir,
          file: path.relative(root, file),
          isProtected: data.protected === true,
          // lab cards without a body get no page
          published: !unpublished && (collection !== 'lab' || body.length > 0),
          secrets: ['summary', 'hook', 'proof']
            .map((k) => data[k])
            .filter((v): v is string => typeof v === 'string')
            .map(normaliseText)
            .filter((v) => v.length >= 24),
          publicText: new Set([data.title, role].filter((v): v is string => typeof v === 'string' && v.length > 0).map(normaliseText)),
        });
      }
    }
  }
  return out;
}

const IMAGE_SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.mp4', '.webm']);
const sha256 = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');

/** sha256 of every media file a public entry (or shared data/brand folder) owns. */
function publicMediaHashes(root: string, entries: SourceEntry[]): Set<string> {
  const hashes = new Set<string>();
  const dirs = [
    ...entries.filter((e) => !e.isProtected).map((e) => e.dir),
    path.join(root, 'src', 'data'),
    path.join(root, 'src', 'assets'),
  ];
  const stack = dirs.filter((d) => existsSync(d));
  while (stack.length) {
    const dir = stack.pop() as string;
    for (const e of readdirSyncSafe(dir)) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (IMAGE_SOURCE_EXT.has(path.extname(e.name).toLowerCase())) hashes.add(sha256(full));
    }
  }
  return hashes;
}

/**
 * `cover.fn5fihRC_ZHi9vF.jpg` -> `cover`. True when the protected entry's source file with that name
 * is byte-identical to a public entry's media (e.g. a shared plain placeholder): the bundler emits
 * one file for both, and nothing secret is exposed by it.
 */
function isSharedWithPublic(asset: string, entryDir: string | undefined, publicHashes: Set<string>): boolean {
  if (!entryDir) return false;
  const stem = asset.split('.').slice(0, -2).join('.');
  if (!stem) return false;
  for (const e of readdirSyncSafe(entryDir)) {
    if (!e.isFile() || !IMAGE_SOURCE_EXT.has(path.extname(e.name).toLowerCase())) continue;
    if (path.parse(e.name).name === stem && publicHashes.has(sha256(path.join(entryDir, e.name)))) return true;
  }
  return false;
}

function readdirSyncSafe(dir: string) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function fail(logger: AstroIntegrationLogger, problems: string[]): never {
  for (const p of problems) logger.error(p);
  throw new Error(`[protect] ${problems.length} problem(s) with protected content — build stopped. See the errors above.`);
}

// ---------------------------------------------------------------- integrations

export function protect(): AstroIntegration {
  return {
    name: 'enricortan:protect',
    hooks: {
      'astro:config:setup': ({ command, config, updateConfig, logger }) => {
        state.root = fileURLToPath(config.root);
        state.password = command === 'build' ? readPassword(state.root) : undefined;
        state.mode = command === 'dev' ? 'dev' : state.password ? 'encrypt' : 'locked';
        updateConfig({ vite: { define: { __PROTECT_MODE__: JSON.stringify(state.mode) } } });
        if (command !== 'build') return;
        if (state.mode === 'locked' && process.env.CI && scanEntries(state.root).some((e) => e.isProtected && e.published)) {
          // Never deploy the FLNT pages silently locked from CI: the secret must be configured.
          throw new Error(`[protect] CI build has protected entries but no ${ENV_VAR} secret. Add it in Settings → Secrets → Actions.`);
        }
        if (state.mode === 'locked') {
          logger.warn(`${ENV_VAR} is not set: protected pages will build as "locked — unavailable" (no ciphertext, no plaintext).`);
        } else if ((state.password ?? '').length < 12) {
          logger.warn(`${ENV_VAR} is shorter than 12 characters; use a long passphrase.`);
        }
      },

      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const files = await walk(dist);
        const htmlFiles = files.filter((f) => f.endsWith('.html'));
        const entries = scanEntries(state.root);
        const byRoute = new Map(entries.map((e) => [e.route, e]));
        const publicHashes = publicMediaHashes(state.root, entries);
        const problems: string[] = [];
        const shared: string[] = [];

        state.noindex.clear();
        state.protectedRoutes.clear();
        state.fragments.clear();
        state.assets.clear();

        let seal: Sealer;
        if (state.mode === 'encrypt') {
          const salt = webcrypto.getRandomValues(new Uint8Array(16)); // one salt per build: one unlock per tab
          const key = await deriveKey(state.password as string, salt);
          seal = async (inner) => {
            const hoisted = inner.match(EXTERNAL_SCRIPT) ?? [];
            const content = inner.replace(EXTERNAL_SCRIPT, '');
            const iv = webcrypto.getRandomValues(new Uint8Array(12));
            const ct = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(content));
            const payload = JSON.stringify({ v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) });
            return `${hoisted.join('')}<script type="application/json" data-protected-payload>${payload}</script>`;
          };
        } else {
          seal = async () =>
            '<p class="protected-notice" data-protected-notice>This page is password-protected and locked — unavailable in this build.</p>';
        }

        const protectedPlain: string[] = [];
        for (const file of htmlFiles) {
          const route = routeOf(dist, file);
          let html = await readFile(file, 'utf-8');
          const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(html);
          if (noindex) state.noindex.add(route);

          const hasContainer = /<[a-z][^>]*\sdata-protected-content\b/i.test(markupOnly(html));
          const hasSentinel = SENTINEL_TAG.test(html);
          if (!hasContainer && !hasSentinel) continue;

          state.protectedRoutes.add(route);
          if (!noindex) problems.push(`${route}: protected page is missing <meta name="robots" content="noindex">`);
          if (DEV_MARKER_TAG.test(markupOnly(html))) problems.push(`${route}: dev-mode plaintext in a production build`);

          const sealed = await sealPage(html, route, seal);
          const source = byRoute.get(route);
          for (const inner of sealed.spans) {
            protectedPlain.push(inner);
            for (const f of fragmentsOf(inner)) {
              if (!source?.publicText.has(f)) state.fragments.set(f, route);
            }
            for (const a of assetsOf(inner)) {
              if (isSharedWithPublic(a, source?.dir, publicHashes)) shared.push(a);
              else state.assets.set(a, route);
            }
          }
          html = sealed.html;
          if (state.mode === 'encrypt' && !/data-protected-payload/.test(html) && !/data-protected-unavailable/.test(html)) {
            problems.push(`${route}: protected container has no encrypted payload`);
          }
          await writeFile(file, html);
        }

        for (const e of entries.filter((x) => x.isProtected)) {
          if (e.published && !state.protectedRoutes.has(e.route)) {
            problems.push(`${e.route}: ${e.file} is protected but its page has no protected container (or was not built)`);
          }
          for (const s of e.secrets) state.fragments.set(s, e.route);
        }
        if (problems.length) fail(logger, problems);
        if (shared.length) {
          logger.info(`${new Set(shared).size} protected media file(s) are byte-identical to public media (shared placeholder), not secret.`);
        }

        // Prune media that no page, stylesheet, script or protected body references
        // (e.g. videos of entries that were not built). Matching is by file name.
        const corpus = (await Promise.all(
          files.filter((f) => TEXT_EXT.has(path.extname(f).toLowerCase()) && existsSync(f)).map((f) => readFile(f, 'utf-8')),
        )).concat(protectedPlain).join('\n');
        const pruned: string[] = [];
        for (const file of files) {
          const rel = path.relative(dist, file).replaceAll('\\', '/');
          if (!rel.startsWith('_astro/') || !MEDIA_EXT.has(path.extname(file).toLowerCase())) continue;
          const name = path.basename(file);
          if (corpus.includes(name)) continue;
          await unlink(file);
          pruned.push(rel);
        }
        if (pruned.length) logger.info(`pruned ${pruned.length} unreferenced media file(s): ${pruned.join(', ')}`);

        const count = state.protectedRoutes.size;
        if (state.mode === 'encrypt') logger.info(`sealed ${count} protected page(s) with AES-256-GCM (PBKDF2-SHA256, ${PBKDF2_ITERATIONS} iterations).`);
        else if (count) logger.warn(`${count} protected page(s) built LOCKED (no ${ENV_VAR}).`);
      },
    },
  };
}

export function protectAudit(): AstroIntegration {
  return {
    name: 'enricortan:protect-audit',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const files = (await walk(dist)).filter((f) => TEXT_EXT.has(path.extname(f).toLowerCase()));
        const problems: string[] = [];
        const protectedUrls = [...state.protectedRoutes].map((r) => new URL(r, 'https://enricortan.com').href);

        for (const file of files) {
          const rel = '/' + path.relative(dist, file).replaceAll('\\', '/');
          const raw = await readFile(file, 'utf-8');
          // Strip the ciphertext before searching so base64 can never produce a false match.
          const searchable = raw.replace(/<script type="application\/json" data-protected-payload>[\s\S]*?<\/script>/g, '');
          const ext = path.extname(file).toLowerCase();
          const text = ext === '.html' || ext === '.xml' || ext === '.svg' ? normaliseText(htmlToText(searchable)) : normaliseText(searchable);

          if (ext === '.html' && SENTINEL_TAG.test(markupOnly(searchable))) problems.push(`${rel}: plaintext sentinel survived`);
          if (ext === '.html' && DEV_MARKER_TAG.test(markupOnly(searchable))) problems.push(`${rel}: dev-mode marker in production output`);
          if (ext === '.html' && state.protectedRoutes.has(normaliseRoute(rel))) {
            const og = /<meta property="og:image" content="([^"]*)"/.exec(searchable)?.[1] ?? '';
            if (og.includes('/_astro/')) problems.push(`${rel}: protected page uses an entry image as og:image (${og})`);
          }
          for (const [fragment, route] of state.fragments) {
            if (text.includes(fragment)) problems.push(`${rel}: contains protected text from ${route}: "${fragment.slice(0, 80)}…"`);
          }
          for (const [asset, route] of state.assets) {
            if (searchable.includes(asset)) problems.push(`${rel}: references ${asset}, which only ${route} (protected) may use`);
          }
          if (ext === '.xml' || ext === '.txt' || ext === '.json') {
            for (const url of protectedUrls) {
              if (searchable.includes(`>${url}<`) || searchable.includes(`"${url}"`)) problems.push(`${rel}: lists protected page ${url}`);
            }
          }
        }
        if (problems.length) fail(logger, problems);
        logger.info(`audit passed: ${files.length} files, ${state.fragments.size} protected fragments, ${state.assets.size} protected media checked.`);
      },
    },
  };
}
