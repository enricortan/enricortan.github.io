#!/usr/bin/env node
/**
 * Restore src/content-private/ from the committed sealed/content-private.sealed.
 *
 *   npm run unseal              write files that are missing or older than the sealed bundle
 *   npm run unseal -- --force   overwrite local files even when they are newer (discards local edits)
 *
 * Safety: a local file that differs from the bundle AND was modified after the bundle file was
 * written/checked out is treated as an unsaved local edit. Then nothing is written (all or
 * nothing) unless --force. Local files that aren't in the bundle are kept and listed.
 * In CI (CI=true) a bundle without the CONTENT_KEY secret is an error, never a silent skip.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { isCI, listFiles, mtimeMs, open, PRIVATE_DIR, readContentKey, SEALED_FILE, SEALED_REL, SealError, unbundle } from './lib/sealed.mjs';

const force = process.argv.includes('--force');

function main() {
  if (!existsSync(SEALED_FILE)) {
    console.log(`unseal: no ${SEALED_REL}; nothing to unseal.`);
    return 0;
  }
  const key = readContentKey();
  if (!key) {
    throw new SealError(
      isCI()
        ? `${SEALED_REL} exists but the CONTENT_KEY secret is not set. Add it in Settings → Secrets and variables → Actions. Refusing to build without the protected entries.`
        : 'CONTENT_KEY is not set. Copy it from your password manager into .env (CONTENT_KEY=...), then run `npm run unseal` again.',
    );
  }

  const files = unbundle(open(key, readFileSync(SEALED_FILE)));
  const sealedAt = mtimeMs(SEALED_FILE);
  const plan = [];
  const conflicts = [];
  let unchanged = 0;
  for (const f of files) {
    const target = path.resolve(PRIVATE_DIR, ...f.path.split('/'));
    if (!target.startsWith(PRIVATE_DIR + path.sep)) throw new SealError(`unsafe path in bundle: ${f.path}`);
    if (existsSync(target)) {
      const current = readFileSync(target);
      if (current.equals(f.data)) {
        unchanged++;
        continue;
      }
      if (mtimeMs(target) > sealedAt && !force) {
        conflicts.push(f.path);
        continue;
      }
    }
    plan.push({ target, data: f.data });
  }

  if (conflicts.length) {
    console.error('unseal: these local files are newer than the sealed bundle and differ from it (unsaved edits?):');
    for (const c of conflicts) console.error(`  src/content-private/${c}`);
    console.error('Nothing was written. Seal them (`npm run seal`) or commit first, or run `npm run unseal -- --force` to discard them.');
    return 1;
  }

  for (const p of plan) {
    mkdirSync(path.dirname(p.target), { recursive: true });
    writeFileSync(p.target, p.data);
  }
  const inBundle = new Set(files.map((f) => f.path));
  const extra = listFiles(PRIVATE_DIR).filter((rel) => !inBundle.has(rel));
  if (extra.length) {
    console.log(`unseal: kept ${extra.length} local file(s) that are not in the bundle yet (they get sealed on your next commit):`);
    for (const e of extra) console.log(`  src/content-private/${e}`);
  }
  console.log(`unseal: ${files.length} files in bundle; wrote ${plan.length}, ${unchanged} already up to date.`);
  return 0;
}

try {
  process.exit(main());
} catch (error) {
  console.error(`unseal: ${error instanceof SealError ? error.message : `failed: ${error.message}`}`);
  process.exit(1);
}
