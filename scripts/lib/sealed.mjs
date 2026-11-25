/**
 * Sealed FLNT source (Theo). The protected entries live in src/content-private/ (gitignored); the
 * repo only carries sealed/content-private.sealed, which this module reads and writes.
 *
 * Bundle (plaintext, deterministic): "ERBNDL01", then for every file in sorted POSIX-path order:
 *   u32 BE path length | UTF-8 path | u64 BE size | raw bytes
 * Sealed file:  "ERSEAL01" (8) | HMAC (32) | IV (12) | AES-256-GCM(gzip(bundle)) | GCM tag (16)
 *   - keys: HKDF-SHA256 from CONTENT_KEY (32 random bytes, base64) into separate encryption and
 *     HMAC subkeys; CONTENT_KEY is NOT the page password (PROTECTED_PASSWORD).
 *   - HMAC = HMAC-SHA256(macKey, bundle): lets `seal --if-changed` skip re-sealing an unchanged tree
 *     (no new random-IV blob per commit) and lets the guard spot a stale/tampered tree. Keyed, so it
 *     reveals only "same or different", never content.
 *   - AAD = magic + HMAC, so the header can't be swapped onto another ciphertext.
 * Nothing here ever prints a key.
 */
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { gunzipSync, gzipSync } from 'node:zlib';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PRIVATE_DIR = path.join(ROOT, 'src', 'content-private');
export const SEALED_FILE = path.join(ROOT, 'sealed', 'content-private.sealed');
export const SEALED_REL = 'sealed/content-private.sealed';

const MAGIC = Buffer.from('ERSEAL01', 'ascii');
const BUNDLE_MAGIC = Buffer.from('ERBNDL01', 'ascii');
const MAC_LEN = 32;
const IV_LEN = 12;
const TAG_LEN = 16;
const HEADER_LEN = MAGIC.length + MAC_LEN + IV_LEN;

/** OS junk and video/design masters never get sealed (masters don't belong in git, sealed or not). */
const IGNORE_NAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
const IGNORE_EXT = new Set(['.mov', '.mkv', '.prores', '.psd', '.blend', '.blend1']);

export class SealError extends Error {}

/** CONTENT_KEY from the environment, else from .env. Returns undefined when absent. */
export function readContentKey() {
  let raw = process.env.CONTENT_KEY;
  const dotenv = path.join(ROOT, '.env');
  if (!raw && existsSync(dotenv)) raw = parseEnv(readFileSync(dotenv, 'utf8')).CONTENT_KEY;
  if (!raw || !raw.trim()) return undefined;
  const key = Buffer.from(raw.trim(), 'base64');
  if (key.length !== 32) throw new SealError('CONTENT_KEY is not 32 bytes of base64. Restore it from your password manager (or `npm run keygen` for a brand-new setup).');
  return key;
}

function subkeys(key) {
  const derive = (label) => Buffer.from(hkdfSync('sha256', key, Buffer.alloc(0), `enricortan/sealed/v1/${label}`, 32));
  return { enc: derive('aes-256-gcm'), mac: derive('hmac-sha256') };
}

/** Sorted POSIX relative paths of every file to seal. */
export function listFiles(dir = PRIVATE_DIR) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (abs, rel) => {
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      if (IGNORE_NAMES.has(e.name)) continue;
      const childAbs = path.join(abs, e.name);
      const childRel = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(childAbs, childRel);
      else if (e.isFile() && !IGNORE_EXT.has(path.extname(e.name).toLowerCase())) out.push(childRel);
    }
  };
  walk(dir, '');
  return out.sort();
}

export function bundle(dir = PRIVATE_DIR) {
  const files = listFiles(dir);
  const parts = [BUNDLE_MAGIC];
  for (const rel of files) {
    const name = Buffer.from(rel, 'utf8');
    const data = readFileSync(path.join(dir, rel));
    const nameLen = Buffer.alloc(4);
    nameLen.writeUInt32BE(name.length);
    const size = Buffer.alloc(8);
    size.writeBigUInt64BE(BigInt(data.length));
    parts.push(nameLen, name, size, data);
  }
  return { buffer: Buffer.concat(parts), files };
}

export function unbundle(buf) {
  if (!buf.subarray(0, BUNDLE_MAGIC.length).equals(BUNDLE_MAGIC)) throw new SealError('bundle: bad magic');
  const files = [];
  let o = BUNDLE_MAGIC.length;
  while (o < buf.length) {
    const nameLen = buf.readUInt32BE(o);
    o += 4;
    const rel = buf.subarray(o, o + nameLen).toString('utf8');
    o += nameLen;
    const size = Number(buf.readBigUInt64BE(o));
    o += 8;
    if (o + size > buf.length) throw new SealError('bundle: truncated');
    const segments = rel.split('/');
    if (!rel || rel.startsWith('/') || rel.includes('\\') || rel.includes('\0') || segments.some((s) => s === '' || s === '.' || s === '..')) {
      throw new SealError(`bundle: unsafe path ${JSON.stringify(rel)}`);
    }
    files.push({ path: rel, data: buf.subarray(o, o + size) });
    o += size;
  }
  return files;
}

export const macOf = (key, bundleBuf) => createHmac('sha256', subkeys(key).mac).update(bundleBuf).digest();

export function seal(key, bundleBuf) {
  const { enc } = subkeys(key);
  const mac = macOf(key, bundleBuf);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv('aes-256-gcm', enc, iv);
  cipher.setAAD(Buffer.concat([MAGIC, mac]));
  const ct = Buffer.concat([cipher.update(gzipSync(bundleBuf, { level: 9 })), cipher.final()]);
  return Buffer.concat([MAGIC, mac, iv, ct, cipher.getAuthTag()]);
}

/** The stored HMAC, without decrypting. */
export function readHeader(sealedBuf) {
  if (sealedBuf.length < HEADER_LEN + TAG_LEN || !sealedBuf.subarray(0, MAGIC.length).equals(MAGIC)) {
    throw new SealError(`${SEALED_REL} is not a sealed bundle (bad header).`);
  }
  return { mac: sealedBuf.subarray(MAGIC.length, MAGIC.length + MAC_LEN) };
}

/** Decrypts + authenticates; returns the bundle. Throws SealError on a wrong key or any tampering. */
export function open(key, sealedBuf) {
  const { mac } = readHeader(sealedBuf);
  const iv = sealedBuf.subarray(MAGIC.length + MAC_LEN, HEADER_LEN);
  const ct = sealedBuf.subarray(HEADER_LEN, sealedBuf.length - TAG_LEN);
  const tag = sealedBuf.subarray(sealedBuf.length - TAG_LEN);
  let bundleBuf;
  try {
    const decipher = createDecipheriv('aes-256-gcm', subkeys(key).enc, iv);
    decipher.setAAD(Buffer.concat([MAGIC, mac]));
    decipher.setAuthTag(tag);
    bundleBuf = gunzipSync(Buffer.concat([decipher.update(ct), decipher.final()]));
  } catch {
    throw new SealError(`${SEALED_REL} does not open with this CONTENT_KEY (wrong key, or the file was modified).`);
  }
  if (!timingSafeEqual(macOf(key, bundleBuf), mac)) throw new SealError(`${SEALED_REL}: HMAC mismatch (tampered).`);
  return bundleBuf;
}

export function sameMac(a, b) {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Atomic write (temp file + rename). */
export function writeAtomic(file, data) {
  mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  writeFileSync(tmp, data);
  renameSync(tmp, file);
}

export const mtimeMs = (file) => statSync(file).mtimeMs;
export const isCI = () => Boolean(process.env.CI);
