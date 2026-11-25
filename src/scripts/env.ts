/**
 * Shared client helpers (Kai). Every module inits through onReady(), which runs on
 * DOMContentLoaded AND on the `protected:unlocked` document event that Theo's unlock script
 * dispatches after injecting decrypted content. Inits must be idempotent: mark elements
 * with a data flag and skip them the second time.
 */
export const THEME_EVENT = 'seam:theme';

const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');

export const reduced = (): boolean => reduceMQ.matches;
export const finePointer = (): boolean => fineMQ.matches;
export const onReducedChange = (fn: () => void): void => reduceMQ.addEventListener('change', fn);

export function onReady(fn: () => void): void {
  const run = () => {
    try {
      fn();
    } catch (err) {
      console.error('[seam]', err);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  document.addEventListener('protected:unlocked', run);
}

/** Returns true the first time it sees `el` for `key`, then false. */
export function claim(el: Element, key: string): boolean {
  const attr = `data-ready-${key}`;
  if (el.hasAttribute(attr)) return false;
  el.setAttribute(attr, '');
  return true;
}

export const cssVar = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

/** 45° seam clip: render on the left of a "/" line whose bottom end sits at x. */
export const seamClip = (x: number, h: number): string =>
  `polygon(-2px -2px, ${x + h}px -2px, ${x}px ${h + 2}px, -2px ${h + 2}px)`;

export function hexRGB(h: string): [number, number, number] {
  let s = h.replace('#', '').trim();
  if (s.length === 3) s = s.replace(/(.)/g, '$1$1');
  const n = parseInt(s.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
