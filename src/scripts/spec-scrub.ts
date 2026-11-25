/**
 * Spec scrub (Kai): a pinned frame (CSS sticky); one rAF read per scroll frame maps the
 * section's progress to a 45° seam: working → shipped. Steps light in sync.
 * Reduced motion: not pinned (CSS), static 50/50, every step on.
 */
import { claim, clamp, onReducedChange, reduced, seamClip } from './env';

type Scrub = {
  sec: HTMLElement;
  frame: HTMLElement;
  render: HTMLElement;
  line: SVGLineElement | null;
  steps: HTMLElement[];
  last: number;
};
const scrubs: Scrub[] = [];
let ticking = false;
let bound = false;

function update() {
  ticking = false;
  const vh = innerHeight;
  for (const s of scrubs) {
    if (!s.sec.isConnected) continue;
    const w = s.frame.clientWidth;
    const h = s.frame.clientHeight;
    let p: number;
    let t: number;
    if (reduced()) {
      p = 0.5;
      t = 0.5;
    } else {
      const r = s.sec.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue; // far off screen
      const stage = s.frame.parentElement?.clientHeight ?? vh;
      p = clamp(-r.top / Math.max(1, r.height - stage), 0, 1);
      t = clamp((p - 0.1) / 0.72, 0, 1);
    }
    const x = -h + t * (w + h);
    s.render.style.clipPath = seamClip(x, h);
    s.frame.dataset.seamX = String(x);
    if (s.line) {
      s.line.setAttribute('x1', String(x + h));
      s.line.setAttribute('y1', '0');
      s.line.setAttribute('x2', String(x));
      s.line.setAttribute('y2', String(h));
      s.line.style.display = t <= 0 || t >= 1 ? 'none' : '';
    }
    const n = s.steps.length;
    const step = reduced() ? -1 : Math.min(n - 1, Math.floor(p * n));
    if (step !== s.last) {
      s.last = step;
      s.steps.forEach((li, i) => li.classList.toggle('on', step === -1 || i === step));
    }
  }
}

const kick = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
};

export function initSpecScrub(): void {
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((sec) => {
    if (!claim(sec, 'scrub')) return;
    const frame = sec.querySelector<HTMLElement>('[data-scrub-frame]');
    const render = sec.querySelector<HTMLElement>('[data-scrub-render]');
    if (!frame || !render) return;
    scrubs.push({
      sec,
      frame,
      render,
      line: sec.querySelector<SVGLineElement>('[data-scrub-line]'),
      steps: Array.from(sec.querySelectorAll<HTMLElement>('[data-scrub-steps] > li')),
      last: -2,
    });
  });
  if (scrubs.length && !bound) {
    bound = true;
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    onReducedChange(kick);
  }
  update();
}
