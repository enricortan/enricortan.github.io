#!/usr/bin/env node
/**
 * Create CONTENT_KEY (32 random bytes, base64) in .env, only if it isn't set yet.
 * The key is never printed. Keep a copy in your password manager and in the GitHub secret
 * CONTENT_KEY: without it, sealed/content-private.sealed can't be opened by anyone, including you.
 */
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { ROOT } from './lib/sealed.mjs';

const dotenv = path.join(ROOT, '.env');
const current = existsSync(dotenv) ? readFileSync(dotenv, 'utf8') : '';

if ((process.env.CONTENT_KEY ?? '').trim() || (parseEnv(current).CONTENT_KEY ?? '').trim()) {
  console.log('CONTENT_KEY is already set (.env or environment); nothing changed.');
  process.exit(0);
}

const line = `CONTENT_KEY=${randomBytes(32).toString('base64')}`;
const comment = '# Key for sealed/content-private.sealed (npm run seal / unseal). Not the page password. Keep a copy in your password manager.';
let next;
if (/^CONTENT_KEY=\s*$/m.test(current)) {
  next = current.replace(/^CONTENT_KEY=\s*$/m, line);
} else {
  next = `${current}${current && !current.endsWith('\n') ? '\n' : ''}${current ? '\n' : ''}${comment}\n${line}\n`;
}
writeFileSync(dotenv, next, { mode: 0o600 });
console.log('CONTENT_KEY written to .env — copy it into your password manager and the GitHub secret CONTENT_KEY');
