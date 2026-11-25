/**
 * Theme (Kai). The boot script in SeamHead already set html[data-theme] before first paint
 * (saved choice > system preference > dark). The toggle persists to localStorage ("er-theme");
 * until the visitor picks one, the page follows system changes live.
 */
import { claim, THEME_EVENT } from './env';

const KEY = 'er-theme';
const root = document.documentElement;
let listening = false;

const current = (): 'light' | 'dark' => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

function saved(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function apply(theme: 'light' | 'dark') {
  root.setAttribute('data-theme', theme);
  sync();
  document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

function sync() {
  const light = current() === 'light';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.textContent = light ? 'Dark' : 'Light';
    b.setAttribute('aria-label', light ? 'Switch to the dark theme' : 'Switch to the light theme');
  });
}

export function initTheme(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    if (!claim(b, 'theme')) return;
    b.addEventListener('click', () => {
      const next = current() === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage blocked: the switch still works for this page */
      }
      apply(next);
    });
  });
  sync();
  if (!listening) {
    listening = true;
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      const s = saved();
      if (s !== 'light' && s !== 'dark') apply(e.matches ? 'light' : 'dark');
    });
  }
}
