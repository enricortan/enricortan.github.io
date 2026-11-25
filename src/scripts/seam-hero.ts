/**
 * Seam hero loader (Kai). The WebGL code is a separate chunk, fetched only on pages with a
 * hero, after fonts are ready (or 1.2 s) and after first paint, so the h1 stays the LCP.
 */
import { claim } from './env';

export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-seam-hero]');
  if (!hero || !claim(hero, 'hero')) return;
  const fonts = document.fonts?.ready
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
    : Promise.resolve();
  void fonts.then(() =>
    requestAnimationFrame(() =>
      setTimeout(() => {
        import('./seam-hero-gl')
          .then((m) => m.initSeamHero(hero))
          .catch((err) => {
            console.warn('Seam hero fell back to the static mark:', err instanceof Error ? err.message : err);
            hero.classList.remove('gl-on');
          });
      }, 0),
    ),
  );
}
