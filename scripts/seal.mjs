#!/usr/bin/env node
/**
 * Seal src/content-private/ (the protected FLNT source, gitignored) into the committed
 * sealed/content-private.sealed. See scripts/lib/sealed.mjs for the format.
 *
 *   npm run seal                       always writes a fresh bundle
 *   node scripts/seal.mjs --if-changed skip when the tree's HMAC equals the bundle's (pre-commit hook)
 *   npm run seal -- --allow-empty      seal an empty tree over an existing bundle (deletes all FLNT entries)
 *   npm run seal -- --rekey            replace a bundle that the current CONTENT_KEY can't open (key rotation)
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { bundle, isCI, listFiles, macOf, open, PRIVATE_DIR, readContentKey, readHeader, sameMac, seal, SEALED_FILE, SEALED_REL, SealError, writeAtomic } from './lib/sealed.mjs';

const args = new Set(process.argv.slice(2));
const ifChanged = args.has('--if-changed');

function main() {
  const files = listFiles(PRIVATE_DIR);
  const hasSealed = existsSync(SEALED_FILE);

  if (files.length === 0) {
    if (ifChanged) {
      console.log('seal: no src/content-private/ here (not unsealed on this machine); nothing to seal.');
      return 0;
    }
    if (hasSealed && !args.has('--allow-empty')) {
      throw new SealError(`src/content-private/ is empty but ${SEALED_REL} exists. Refusing to wipe it. Run \`npm run unseal\` first, or pass --allow-empty if you really mean to delete every protected entry.`);
    }
    if (!hasSealed) {
      console.log('seal: nothing to seal.');
      return 0;
    }
  }

  const key = readContentKey();
  if (!key) {
    throw new SealError('CONTENT_KEY is not set (.env or environment). New setup: `npm run keygen`. New machine: copy CONTENT_KEY from your password manager into .env.');
  }

  const { buffer, files: sealedFiles } = bundle(PRIVATE_DIR);
  if (hasSealed) {
    const existing = readFileSync(SEALED_FILE);
    if (ifChanged && sameMac(readHeader(existing).mac, macOf(key, buffer))) {
      console.log(`seal: unchanged (${sealedFiles.length} files); ${SEALED_REL} left as is.`);
      return 0;
    }
    if (!args.has('--rekey')) {
      try {
        open(key, existing); // proves this key is the repo's key before we overwrite anything
      } catch {
        throw new SealError(`${SEALED_REL} does not open with your CONTENT_KEY, so it was not overwritten. Check the key in .env. If you rotated the key on purpose: \`npm run seal -- --rekey\`.`);
      }
    }
  }

  const out = seal(key, buffer);
  if (out.length > 90 * 1024 * 1024) throw new SealError(`sealed bundle would be ${(out.length / 1048576).toFixed(1)} MB; GitHub rejects files over 100 MB. Move large media out (long video goes to YouTube/Vimeo).`);
  writeAtomic(SEALED_FILE, out);
  const size = statSync(SEALED_FILE).size;
  if (size > 25 * 1024 * 1024) console.warn(`seal: warning, ${SEALED_REL} is ${(size / 1048576).toFixed(1)} MB. Each change adds a full copy to git history.`);
  console.log(`seal: sealed ${sealedFiles.length} files (${(size / 1024).toFixed(0)} KB) into ${SEALED_REL}.`);
  if (isCI()) console.log('seal: note: running in CI.');
  return 0;
}

try {
  process.exit(main());
} catch (error) {
  console.error(`seal: ${error instanceof SealError ? error.message : `failed: ${error.message}`}`);
  process.exit(1);
}
