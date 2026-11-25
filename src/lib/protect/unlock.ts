/**
 * Client unlock for password-protected pages (bundled by Astro via <script> in
 * src/layouts/partials/Protected.astro). Model + attribute contract: ./README.md.
 *
 * 1. Read the sealed payload {v,salt,iv,ct} from <script type="application/json" data-protected-payload>.
 * 2. If this tab already unlocked a page from the same build (sessionStorage holds the DERIVED
 *    AES key for that salt, never the password), decrypt silently.
 * 3. Otherwise wait for the LockGate form: PBKDF2-SHA256 (600k) -> AES-256-GCM decrypt.
 * 4. Inject the HTML, re-run inline scripts, dispatch `protected:unlocked` on document.
 */

export const PBKDF2_ITERATIONS = 600_000;
const STORAGE_PREFIX = 'er-protect:v1:';

type Payload = { v: 1; salt: string; iv: string; ct: string };
type GateState = 'idle' | 'unlocking' | 'error' | 'unlocked' | 'unavailable';

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    material,
    { name: 'AES-GCM', length: 256 },
    true, // extractable so the raw key can be kept for this tab
    ['decrypt'],
  );
}

async function decrypt(key: CryptoKey, payload: Payload): Promise<string> {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(payload.iv) }, key, fromB64(payload.ct));
  return new TextDecoder().decode(plain);
}

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

async function recallKey(payload: Payload): Promise<CryptoKey | null> {
  const raw = storage()?.getItem(STORAGE_PREFIX + payload.salt);
  if (!raw) return null;
  try {
    return await crypto.subtle.importKey('raw', fromB64(raw), 'AES-GCM', false, ['decrypt']);
  } catch {
    return null;
  }
}

async function rememberKey(payload: Payload, key: CryptoKey) {
  try {
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
    storage()?.setItem(STORAGE_PREFIX + payload.salt, toB64(raw));
  } catch {
    /* private mode or storage disabled: unlock still works for this page */
  }
}

function forgetKey(payload: Payload) {
  try {
    storage()?.removeItem(STORAGE_PREFIX + payload.salt);
  } catch {
    /* ignore */
  }
}

function readPayload(container: HTMLElement): Payload | null {
  const el = container.querySelector('script[data-protected-payload]');
  if (!el?.textContent) return null;
  try {
    const p = JSON.parse(el.textContent) as Payload;
    return p.v === 1 && p.salt && p.iv && p.ct ? p : null;
  } catch {
    return null;
  }
}

function inject(container: HTMLElement, html: string, slug: string) {
  container.innerHTML = html;
  // Inline scripts inserted via innerHTML don't run; re-create them so they do.
  // (External module scripts were hoisted out of the ciphertext at build time and already ran.)
  for (const old of Array.from(container.querySelectorAll('script'))) {
    const type = old.getAttribute('type');
    if (type && type !== 'module' && type !== 'text/javascript') continue;
    const fresh = document.createElement('script');
    for (const attr of Array.from(old.attributes)) fresh.setAttribute(attr.name, attr.value);
    fresh.textContent = old.textContent;
    old.replaceWith(fresh);
  }
  container.dataset.protectedState = 'unlocked';
  document.documentElement.dataset.protected = 'unlocked';
  document.dispatchEvent(new CustomEvent('protected:unlocked', { detail: { slug, container } }));
}

function setState(gate: HTMLElement | null, state: GateState, message = '') {
  if (!gate) return;
  gate.dataset.lockState = state;
  const status = gate.querySelector<HTMLElement>('[data-lock-status]');
  if (status) status.textContent = state === 'error' ? '' : message;
  const error = gate.querySelector<HTMLElement>('[data-lock-error]');
  if (error) {
    if (state === 'error') error.textContent = message;
    else error.textContent = '';
    error.hidden = state !== 'error';
  }
  const unavailable = gate.querySelector<HTMLElement>('[data-lock-unavailable]');
  if (unavailable) unavailable.hidden = state !== 'unavailable';
  const form = gate.querySelector<HTMLFormElement>('[data-lock-form]');
  if (form) {
    form.hidden = state === 'unavailable';
    for (const el of Array.from(form.elements) as HTMLInputElement[]) el.disabled = state === 'unlocking';
    form.setAttribute('aria-busy', String(state === 'unlocking'));
  }
  const input = gate.querySelector<HTMLInputElement>('[data-lock-input]');
  input?.setAttribute('aria-invalid', String(state === 'error'));
  if (state === 'unlocked') gate.hidden = true;
}

async function setup(container: HTMLElement) {
  if (container.dataset.protectedState) return; // already handled
  const slug = container.dataset.protectedSlug ?? '';
  const gate = document.querySelector<HTMLElement>(`[data-lock-gate][data-lock-slug="${CSS.escape(slug)}"]`) ??
    document.querySelector<HTMLElement>('[data-lock-gate]');

  // Dev build (plaintext) or a build without PROTECTED_PASSWORD (notice only).
  if (container.hasAttribute('data-protected-dev')) {
    container.dataset.protectedState = 'dev';
    return;
  }
  const payload = readPayload(container);
  if (!payload || !globalThis.crypto?.subtle) {
    container.dataset.protectedState = 'unavailable';
    setState(gate, 'unavailable', payload ? 'This browser cannot decrypt this page.' : '');
    return;
  }
  container.dataset.protectedState = 'locked';

  const remembered = await recallKey(payload);
  if (remembered) {
    try {
      inject(container, await decrypt(remembered, payload), slug);
      setState(gate, 'unlocked');
      return;
    } catch {
      forgetKey(payload); // stale key from an older build
    }
  }

  setState(gate, 'idle');
  const form = gate?.querySelector<HTMLFormElement>('[data-lock-form]');
  const input = gate?.querySelector<HTMLInputElement>('[data-lock-input]');
  if (!form || !input) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = input.value;
    if (!password) return;
    setState(gate, 'unlocking', 'Unlocking…');
    try {
      const key = await deriveKey(password, fromB64(payload.salt));
      const html = await decrypt(key, payload); // AES-GCM: a wrong password fails authentication here
      await rememberKey(payload, key);
      input.value = '';
      setState(gate, 'unlocked', 'Unlocked.');
      inject(container, html, slug);
      container.focus({ preventScroll: false });
    } catch {
      setState(gate, 'error', 'That password didn’t work.');
      input.focus();
      input.select();
    }
  });
}

export function initProtected() {
  const run = () => {
    for (const container of Array.from(document.querySelectorAll<HTMLElement>('[data-protected-content]'))) {
      void setup(container);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
}
