/**
 * Decision trail (Kai): at 85% in view, each role's old values fly into the one kept
 * (900ms expo-out, 70ms stagger, ≤ 4 steps); the originals stay as dimmed ghosts.
 * Replay button. Reduced motion: the final state, values listed in text.
 */
import { claim, reduced } from './env';

type Row = HTMLElement & { _afterX?: number };

const isColour = (v: string) => typeof CSS !== 'undefined' && CSS.supports('color', v);

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
}

function layout(row: Row) {
  const track = row.querySelector<HTMLElement>('.track');
  if (!track) return;
  let vals: string[] = [];
  try {
    vals = JSON.parse(row.dataset.vals ?? '[]');
  } catch {
    vals = [];
  }
  const kept = row.dataset.final ?? '';
  const W = track.clientWidth;
  const phone = W < 520;
  const afterX = phone ? W - 44 : Math.round(W * 0.62);
  const span = afterX - 72;
  const stepX = Math.min(64, span / Math.max(1, vals.length - 1));
  let html = '';
  vals.forEach((v, i) => {
    const x = vals.length === 1 ? 0 : Math.round(i * stepX);
    const fill = isColour(v) ? `background:${esc(v)}` : '';
    html += `<i class="dot${fill ? '' : ' text'}" data-x="${x}" style="left:${x}px;${fill}" title="${esc(v)}"></i>`;
  });
  const lastX = Math.round((vals.length - 1) * stepX);
  html += `<i class="arrow" style="left:${lastX + 44}px;width:${Math.max(8, afterX - lastX - 56)}px"></i>`;
  const keptFill = isColour(kept) ? `background:${esc(kept)}` : '';
  html += `<div class="after" style="left:${afterX}px"><i class="${keptFill ? '' : 'text'}" style="${keptFill}"></i><span>${esc(kept)}</span></div>`;
  track.innerHTML = html;
  row._afterX = afterX;
}

function merge(row: Row) {
  const after = row.querySelector<HTMLElement>('.after');
  if (!after) return;
  if (reduced() || !after.animate) {
    after.classList.add('in');
    return;
  }
  row.querySelectorAll<HTMLElement>('.dot').forEach((d, i) => {
    const dx = (row._afterX ?? 0) + 4 - parseFloat(d.dataset.x ?? '0');
    const c = d.cloneNode() as HTMLElement;
    d.parentNode?.appendChild(c);
    c.animate(
      [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translateX(${dx}px)`, opacity: 0 },
      ],
      { duration: 900, delay: Math.min(i, 4) * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
    ).finished.then(() => c.remove(), () => c.remove());
    d.animate([{ opacity: 1 }, { opacity: 0.38 }], { duration: 400, delay: Math.min(i, 4) * 70, easing: 'ease-out', fill: 'forwards' });
  });
  setTimeout(() => after.classList.add('in'), 700);
}

function setup(trail: HTMLElement) {
  const rows = Array.from(trail.querySelectorAll<Row>('[data-trail-row]'));
  if (!reduced()) trail.classList.add('trail-armed');
  rows.forEach(layout);
  if ('IntersectionObserver' in window && !reduced()) {
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            merge(e.target as Row);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    rows.forEach((r) => io.observe(r));
  } else rows.forEach((r) => r.querySelector('.after')?.classList.add('in'));

  const replay = trail.querySelector<HTMLButtonElement>('[data-trail-replay]');
  if (replay && !reduced()) {
    replay.hidden = false;
    replay.addEventListener('click', () => {
      rows.forEach((r, i) => {
        layout(r);
        setTimeout(() => merge(r), 60 + i * 120);
      });
    });
  }
  let lastW = trail.clientWidth;
  new ResizeObserver(() => {
    if (trail.clientWidth === lastW) return;
    lastW = trail.clientWidth;
    rows.forEach((r) => {
      layout(r);
      r.querySelector('.after')?.classList.add('in');
    });
  }).observe(trail);
}

export function initDecisionTrail(): void {
  document.querySelectorAll<HTMLElement>('[data-trail]').forEach((t) => {
    if (claim(t, 'trail')) setup(t);
  });
}
