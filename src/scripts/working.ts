/**
 * "Show working" (Kai): toggles html.working (CSS draws the 12-column overlay and the type
 * labels). Remembered for this tab only (sessionStorage "er-working"), restored before first
 * paint by SeamHead. ?working=1 turns it on.
 */
import { claim } from './env';

const KEY = 'er-working';
const root = document.documentElement;

function sync() {
  const on = root.classList.contains('working');
  document.querySelectorAll('[data-working-toggle]').forEach((b) => b.setAttribute('aria-checked', String(on)));
}

function set(on: boolean) {
  root.classList.toggle('working', on);
  try {
    if (on) sessionStorage.setItem(KEY, '1');
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  sync();
}

export function initWorking(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-working-toggle]').forEach((b) => {
    if (!claim(b, 'working')) return;
    b.addEventListener('click', () => set(!root.classList.contains('working')));
  });
  if (new URLSearchParams(location.search).get('working') === '1') set(true);
  sync();
}
