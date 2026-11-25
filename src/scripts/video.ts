/**
 * Loops (Kai): preload="none" until needed; play at ≥ 50% in view, pause off screen.
 * A Play/Pause control is always shown once JS runs (WCAG 2.2.2). Reduced motion: never
 * autoplays; the poster stays until the visitor presses Play. A visitor's pause sticks.
 */
import { claim, reduced } from './env';

const PLAY = '<svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M0 0 10 6 0 12Z"></path></svg><span>Play</span>';
const PAUSE = '<svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z"></path></svg><span>Pause</span>';

function setup(fig: HTMLElement, io: IntersectionObserver | null) {
  const v = fig.querySelector('video');
  const btn = fig.querySelector<HTMLButtonElement>('[data-video-toggle]');
  if (!v || !btn) return;
  let userPaused = false;
  const sync = () => {
    const playing = !v.paused && !v.ended;
    btn.innerHTML = playing ? PAUSE : PLAY;
    btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  };
  v.addEventListener('play', sync);
  v.addEventListener('pause', sync);
  btn.hidden = false;
  sync();
  btn.addEventListener('click', () => {
    if (v.paused) {
      userPaused = false;
      void v.play().catch(() => sync());
    } else {
      userPaused = true;
      v.pause();
    }
  });
  (v as HTMLVideoElement & { _seam?: { userPaused: () => boolean } })._seam = { userPaused: () => userPaused || reduced() };
  io?.observe(v);
}

let io: IntersectionObserver | null = null;

export function initVideo(): void {
  if (!io && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement & { _seam?: { userPaused: () => boolean } };
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            if (!v._seam?.userPaused() && v.paused) void v.play().catch(() => {});
          } else if (!v.paused) v.pause();
        }
      },
      { threshold: [0, 0.5] },
    );
  }
  document.querySelectorAll<HTMLElement>('[data-seam-video]').forEach((f) => {
    if (claim(f, 'video')) setup(f, io);
  });
}
