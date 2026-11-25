#!/usr/bin/env node
/**
 * Post-build leak check, independent of the build integration (defence in depth). CI runs it after
 * `npm run build`.
 *
 * For every entry with `protected: true`:
 *  - its page exists, carries robots noindex, is sealed (encrypted payload, or the "unavailable"
 *    notice when built without PROTECTED_PASSWORD), and its og:image is not an entry image;
 *  - it is absent from the sitemap and RSS;
 *  - prose sentences from its MDX source and its summary/hook/proof appear in no file in dist/;
 *  - with PROTECTED_PASSWORD set (env or .env): the payload DECRYPTS with it (a round trip of the
 *    crypto, done with Node's WebCrypto like the browser), and no sentence or media file from the
 *    decrypted body appears anywhere else. Media byte-identical to a public entry's file (a shared
 *    placeholder) is reported, not failed.
 *
 * Usage:  npm run verify
 *         npm run verify -- --phrase "a distinctive sentence"   (also search for this phrase)
 *         npm run verify -- --dist path/to/out                     (another build output folder)
 */
import { createHash, webcrypto } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const DIST = path.resolve(argValue('--dist') ?? path.join(ROOT, 'dist'));
const extraPhrases = args.flatMap((a, i) => (a === '--phrase' && args[i + 1] ? [args[i + 1]] : []));
const MIN = 40;
const ITERATIONS = 600_000;
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.mjs', '.css', '.svg', '.webmanifest']);
const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.mp4', '.webm']);
const PAYLOAD = /<script type="application\/json" data-protected-payload>([\s\S]*?)<\/script>/g;

if (!existsSync(DIST)) {
  console.error(`verify: ${DIST} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

function password() {
  if (process.env.PROTECTED_PASSWORD) return process.env.PROTECTED_PASSWORD;
  const f = path.join(ROOT, '.env');
  if (!existsSync(f)) return undefined;
  try {
    return parseEnv(readFileSync(f, 'utf8')).PROTECTED_PASSWORD || undefined;
  } catch {
    return undefined;
  }
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m),
  );
const norm = (s) =>
  decode(s)
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/…/g, '...')
    .replace(/---?/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
const markupText = (html) => html.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, '\n').replace(/<[^>]+>/g, '\n');
const sentencesOf = (text) => {
  const out = new Set();
  for (const block of text.split(/\n+/)) for (const s of norm(block).split(/(?<=[.!?])\s+/)) if (s.length >= MIN) out.add(s);
  return out;
};

/** Prose sentences from an MDX body: imports, JSX and markdown syntax removed. */
function proseSentences(body) {
  const paragraphs = body
    .replace(/^\s*(import|export)\s.*$/gm, '')
    .replace(/<[A-Z][\s\S]*?(\/>|<\/[A-Z][A-Za-z]*>)/g, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .split('\n')
        .filter((l) => !/^\s*\|/.test(l) && !/^\s*```/.test(l))
        .map((l) => l.replace(/^\s*(#{1,6}|[-*+]|\d+\.|>)\s+/, ''))
        .join(' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/(\*\*|__|\*|`)/g, ''),
    );
  return sentencesOf(paragraphs.join('\n'));
}

function scanEntries() {
  const entries = [];
  for (const [tree, collection] of ['content', 'content-private'].flatMap((t) => ['work', 'lab', 'notes'].map((c) => [t, c]))) {
    const base = path.join(ROOT, 'src', tree, collection);
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base, { withFileTypes: true })) {
      if (!dir.isDirectory() || dir.name.startsWith('_')) continue;
      const file = path.join(base, dir.name, 'index.mdx');
      if (!existsSync(file)) continue;
      const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(readFileSync(file, 'utf8'));
      if (!m) continue;
      const data = parseYaml(m[1]) ?? {};
      const unpublished = data.draft === true || data.visibility === 'draft' || data.confidentiality === 'pending';
      const hasBody = m[2].replace(/^\s*(import|export)\s.*$/gm, '').trim().length > 0;
      const role = Array.isArray(data.role) ? data.role.join(', ') : (data.role ?? '');
      entries.push({
        tree,
        collection,
        slug: dir.name,
        dir: path.join(base, dir.name),
        file: path.relative(ROOT, file).replaceAll('\\', '/'),
        isProtected: data.protected === true,
        hasPage: !unpublished && (collection !== 'lab' || hasBody),
        phrases: new Set([...proseSentences(m[2]), ...['summary', 'hook', 'proof'].map((k) => data[k]).filter((v) => typeof v === 'string' && v.length >= 24).map(norm)]),
        publicText: new Set([data.title, role].filter(Boolean).map(norm)),
      });
    }
  }
  return entries;
}

function walk(dir, filter) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, filter));
    else if (filter(e.name)) out.push(full);
  }
  return out;
}

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
function publicHashes(entries) {
  const dirs = [...entries.filter((e) => !e.isProtected).map((e) => e.dir), path.join(ROOT, 'src', 'data'), path.join(ROOT, 'src', 'assets')].filter(existsSync);
  return new Set(dirs.flatMap((d) => walk(d, (n) => MEDIA_EXT.has(path.extname(n).toLowerCase()))).map(sha));
}
/** `cover.fn5fihRC_ZHi9vF.jpg` from entry dir -> is the source `cover.*` byte-identical to public media? */
function sharedWithPublic(asset, dir, hashes) {
  const stem = asset.split('.').slice(0, -2).join('.');
  return readdirSync(dir).some((n) => path.parse(n).name === stem && MEDIA_EXT.has(path.extname(n).toLowerCase()) && hashes.has(sha(path.join(dir, n))));
}

async function decryptPayload(json, pass, keys) {
  const p = JSON.parse(json);
  if (p.v !== 1) throw new Error(`unknown payload version ${p.v}`);
  const b = (s) => Uint8Array.from(Buffer.from(s, 'base64'));
  let key = keys.get(p.salt);
  if (!key) {
    const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
    key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b(p.salt), iterations: ITERATIONS }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    keys.set(p.salt, key);
  }
  if (b(p.salt).length !== 16 || b(p.iv).length !== 12) throw new Error('salt must be 16 bytes and iv 12 bytes');
  return new TextDecoder().decode(await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: b(p.iv) }, key, b(p.ct)));
}

// ------------------------------------------------------------------ run

const entries = scanEntries();
const protectedEntries = entries.filter((e) => e.isProtected);
const hashes = publicHashes(entries);
const pass = password();
const keys = new Map();
const files = walk(DIST, (n) => TEXT_EXT.has(path.extname(n).toLowerCase())).map((f) => {
  const full = readFileSync(f, 'utf8');
  const raw = full.replace(PAYLOAD, '');
  const isMarkup = /\.(html|xml|svg)$/i.test(f);
  return { rel: path.relative(DIST, f).replaceAll('\\', '/'), full, raw, text: norm(isMarkup ? markupText(raw).replace(/\n/g, ' ') : raw) };
});

const problems = [];
const notes = [];
let phrasesChecked = 0;
let decrypted = 0;
const allSecretPhrases = new Set();

for (const e of protectedEntries) {
  const route = `/${e.collection}/${e.slug}/`;
  const page = files.find((f) => f.rel === `${e.collection}/${e.slug}/index.html`);
  const secretPhrases = new Set(e.phrases);
  const secretMedia = new Set();

  if (e.hasPage && !page) problems.push(`${route}: protected page was not built`);
  if (!e.hasPage && page) problems.push(`${route}: page exists but the entry is unpublished`);
  if (page) {
    const payloads = [...page.full.matchAll(PAYLOAD)].map((m) => m[1]);
    if (!payloads.length && !/data-protected-unavailable/.test(page.full)) problems.push(`${route}: page is not sealed (no payload, no unavailable notice)`);
    if (!/<meta name="robots" content="noindex"/.test(page.raw)) problems.push(`${route}: missing robots noindex`);
    const og = /<meta property="og:image" content="([^"]*)"/.exec(page.raw)?.[1] ?? '';
    if (og.includes('/_astro/')) problems.push(`${route}: og:image is an entry image (${og})`);
    if (/\/_astro\/[^"'\s)]+\.(png|jpe?g|webp|avif|gif|mp4|webm)/i.test(page.raw.replace(/<head>[\s\S]*?<\/head>/, ''))) {
      // Any media left in the public part of a protected page must be shared/public media.
      for (const m of page.raw.matchAll(/\/_astro\/([^"'\s),?#]+)/g)) {
        if (MEDIA_EXT.has(path.extname(m[1]).toLowerCase()) && !sharedWithPublic(m[1], e.dir, hashes)) problems.push(`${route}: public part references ${m[1]}`);
      }
    }
    if (payloads.length && pass) {
      for (const json of payloads) {
        try {
          const html = await decryptPayload(json, pass, keys);
          decrypted++;
          for (const s of sentencesOf(markupText(html))) if (!e.publicText.has(s)) secretPhrases.add(s);
          for (const m of html.matchAll(/\/_astro\/([^"'\s),?#]+)/g)) {
            if (!MEDIA_EXT.has(path.extname(m[1]).toLowerCase())) continue;
            if (sharedWithPublic(m[1], e.dir, hashes)) notes.push(`${route}: uses media byte-identical to public media (shared placeholder), not secret`);
            else secretMedia.add(m[1]);
          }
        } catch (err) {
          problems.push(`${route}: payload does not decrypt with PROTECTED_PASSWORD (${err.message})`);
        }
      }
    }
  }

  for (const phrase of secretPhrases) {
    allSecretPhrases.add(phrase);
    phrasesChecked++;
    for (const f of files) if (f.text.includes(phrase)) problems.push(`${f.rel}: leaks ${e.file}: "${phrase.slice(0, 90)}"`);
  }
  for (const asset of secretMedia) {
    for (const f of files) if (f.raw.includes(asset)) problems.push(`${f.rel}: references ${asset}, which only ${route} (protected) uses`);
  }
  for (const f of files.filter((x) => /(^|\/)(sitemap[^/]*\.xml|rss\.xml)$/.test(x.rel))) {
    if (f.raw.includes(`https://enricortan.com${route}`)) problems.push(`${f.rel}: lists protected page ${route}`);
  }
}

// The committed, sealed FLNT source must not contain any of it in the clear either.
const sealedFile = path.join(ROOT, 'sealed', 'content-private.sealed');
if (existsSync(sealedFile)) {
  const bytes = readFileSync(sealedFile);
  const asText = [bytes.toString('utf8'), bytes.toString('latin1')];
  let hits = 0;
  for (const phrase of [...allSecretPhrases, ...extraPhrases.map(norm)]) {
    if (asText.some((t) => t.includes(phrase))) {
      hits++;
      problems.push(`sealed/content-private.sealed: contains plaintext "${phrase.slice(0, 60)}"`);
    }
  }
  notes.push(`sealed/content-private.sealed: ${allSecretPhrases.size} phrases searched, ${hits} found in plaintext`);
}

for (const phrase of extraPhrases.map(norm)) {
  phrasesChecked++;
  for (const f of files) if (f.text.includes(phrase)) problems.push(`${f.rel}: contains --phrase "${phrase}"`);
}
for (const f of files.filter((x) => x.rel.endsWith('.html'))) {
  // Bundled code mentions these attribute names as strings, so look at markup only.
  const markup = f.raw.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  if (/<i\b[^>]*\bdata-protect-(begin|end)\b/.test(markup)) problems.push(`${f.rel}: unsealed protected sentinel`);
  if (/<[a-z][^>]*\sdata-(protected-dev|dev-badge)\b/i.test(markup)) problems.push(`${f.rel}: dev-only marker in production output`);
}

for (const n of new Set(notes)) console.log(`note: ${n}`);
if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  console.error(`\nverify: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(
  `verify: ok. ${protectedEntries.length} protected entries, ${decrypted} payload(s) decrypted${pass ? '' : ' (no PROTECTED_PASSWORD: decrypt round-trip skipped)'}, ` +
    `${phrasesChecked} phrases checked against ${files.length} files.`,
);
