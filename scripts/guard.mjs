#!/usr/bin/env node
/**
 * Repo guards (Theo). `npm run guard` runs them all; CI runs it after `npm run unseal`.
 * `node scripts/guard.mjs --pre-commit` (the git hook) checks only what is about to be committed.
 *
 *  1. File names: no trailing space/dot, no < > : " | ? * \ or control characters, no reserved
 *     Windows names (the legacy repo had such paths and couldn't be checked out on Windows).
 *  2. src/content-private/ (unencrypted FLNT source) is never tracked or staged.
 *  3. No `protected: true` entry under src/content/ (it would be public in the repo).
 *  4. Sealed bundle: in CI it needs CONTENT_KEY and an unsealed tree; anywhere, the unsealed tree
 *     must match the bundle's HMAC (else it is stale or tampered: run `npm run seal`).
 *  5. No VALUE in src/data/profile.yaml or site.yaml contains "TODO(Enrico)" (comments are fine).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { bundle, isCI, listFiles, macOf, PRIVATE_DIR, readContentKey, readHeader, ROOT, sameMac, SEALED_FILE, SEALED_REL, SealError } from './lib/sealed.mjs';

const preCommit = process.argv.includes('--pre-commit');
const problems = [];
const notes = [];

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null; // not a git checkout (yet)
  }
}
const isGitRepo = git(['rev-parse', '--is-inside-work-tree'])?.trim() === 'true';
const zsplit = (s) => (s ?? '').split('\0').filter(Boolean);

// ---- 1. file names
const INVALID = /[<>:"|?*\\\u0000-\u001f]/;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const SKIP = new Set(['node_modules', 'dist', '.astro', '.git']);
function walkNames() {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (SKIP.has(e.name)) continue;
      const rel = dir ? `${dir}/${e.name}` : e.name;
      if (e.isDirectory()) walk(rel);
      else out.push(rel);
    }
  };
  walk('');
  return out;
}
const names = preCommit
  ? zsplit(git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']))
  : isGitRepo
    ? zsplit(git(['ls-files', '-z', '--cached', '--others', '--exclude-standard']))
    : walkNames();
for (const file of names) {
  for (const segment of file.split('/')) {
    const why = /[ .]$/.test(segment)
      ? 'ends with a space or dot'
      : /^ /.test(segment)
        ? 'starts with a space'
        : INVALID.test(segment)
          ? 'contains a character Windows cannot store'
          : RESERVED.test(segment)
            ? 'is a reserved Windows device name'
            : '';
    if (why) {
      problems.push(`${JSON.stringify(file)}: "${segment}" ${why}`);
      break;
    }
  }
}

// ---- 2. the private tree is never in git
if (isGitRepo) {
  const tracked = zsplit(git(['ls-files', '-z', '--', 'src/content-private']));
  const staged = zsplit(git(['diff', '--cached', '--name-only', '-z', '--', 'src/content-private']));
  for (const f of new Set([...tracked, ...staged])) problems.push(`${f}: src/content-private/ is the UNENCRYPTED FLNT source and must never be committed (git rm --cached it).`);
} else {
  notes.push('not a git checkout: tracked-file checks skipped');
}

// ---- 3. no protected entry in the public tree
const frontmatter = (text) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return {};
  try {
    return parseYaml(m[1]) ?? {};
  } catch {
    return {};
  }
};
const publicMdx = preCommit
  ? names.filter((f) => /^src\/content\/.+\/index\.mdx$/.test(f)).map((f) => ({ f, text: git(['show', `:${f}`]) ?? '' }))
  : ['work', 'lab', 'notes'].flatMap((c) => {
      const base = path.join(ROOT, 'src', 'content', c);
      if (!existsSync(base)) return [];
      return readdirSync(base, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(path.join(base, d.name, 'index.mdx')))
        .map((d) => ({ f: `src/content/${c}/${d.name}/index.mdx`, text: readFileSync(path.join(base, d.name, 'index.mdx'), 'utf8') }));
    });
for (const { f, text } of publicMdx) {
  if (frontmatter(text).protected === true) problems.push(`${f}: \`protected: true\` entries belong in src/content-private/ (sealed), not the public tree.`);
}

if (!preCommit) {
  // ---- 4. sealed bundle consistency
  const hasSealed = existsSync(SEALED_FILE);
  const files = listFiles(PRIVATE_DIR);
  let key;
  try {
    key = readContentKey();
  } catch (e) {
    problems.push(e instanceof SealError ? e.message : String(e));
  }
  if (isCI() && hasSealed && !key) problems.push(`${SEALED_REL} exists but CONTENT_KEY is missing in CI. Refusing to deploy without the protected entries.`);
  if (isCI() && hasSealed && key && files.length === 0) problems.push(`${SEALED_REL} exists but src/content-private/ is empty: did \`npm run unseal\` run?`);
  if (files.length && !hasSealed) problems.push(`src/content-private/ has ${files.length} files but ${SEALED_REL} doesn't exist: run \`npm run seal\`.`);
  if (files.length && hasSealed && key) {
    const same = sameMac(readHeader(readFileSync(SEALED_FILE)).mac, macOf(key, bundle(PRIVATE_DIR).buffer));
    if (!same) {
      problems.push(
        isCI()
          ? `src/content-private/ does not match ${SEALED_REL} (tampered or stale unseal).`
          : `src/content-private/ has changes that aren't sealed yet: run \`npm run seal\` (the pre-commit hook does this on commit).`,
      );
    }
  }
  if (files.length && !key && !isCI()) notes.push('CONTENT_KEY not set: sealed-bundle freshness not checked');

  // ---- 5. no TODO(Enrico) values left in the site data
  const todoPaths = (value, at) => {
    if (typeof value === 'string') return value.includes('TODO(Enrico)') ? [at] : [];
    if (Array.isArray(value)) return value.flatMap((v, i) => todoPaths(v, `${at}[${i}]`));
    if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => todoPaths(v, at ? `${at}.${k}` : k));
    return [];
  };
  for (const name of ['profile.yaml', 'site.yaml']) {
    const file = path.join(ROOT, 'src', 'data', name);
    if (!existsSync(file)) continue;
    let data;
    try {
      data = parseYaml(readFileSync(file, 'utf8'));
    } catch (e) {
      problems.push(`src/data/${name}: not valid YAML (${e.message})`);
      continue;
    }
    for (const at of todoPaths(data, '')) problems.push(`src/data/${name}: \`${at}\` is still TODO(Enrico). Fill it in or delete the line.`);
  }
}

for (const n of notes) console.log(`guard: note: ${n}`);
if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  console.error(`\nguard: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`guard: ok${preCommit ? ' (pre-commit)' : ''}.`);
