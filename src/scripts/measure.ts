/**
 * Measure cursor (Kai): in spec zones ([data-measure]) and only for a fine mouse pointer,
 * a redline crosshair and a readout "x 397  y 185 · working". Coordinates are in the
 * zone's own design pixels: data-measure-w is the natural width (e.g. the render's px).
 * The native cursor stays. Elements inside can add a token with data-token="…".
 */
import { claim, finePointer } from './env';

function attach(el: HTMLElement) {
  const m = document.createElement('div');
  m.className = 'measure';
  m.setAttribute('aria-hidden', 'true');
  m.innerHTML = '<i class="mx"></i><i class="my"></i><span class="tag"></span>';
  el.appendChild(m);
  const mx = m.querySelector<HTMLElement>('.mx')!;
  const my = m.querySelector<HTMLElement>('.my')!;
  const tag = m.querySelector<HTMLElement>('.tag')!;

  el.addEventListener('pointermove', (e) => {
    if (!finePointer() || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const natural = Number(el.dataset.measureW) || r.width;
    const s = r.width / natural;
    const tokEl = (e.target as Element).closest?.('[data-token]');
    let extra = tokEl && el.contains(tokEl) ? ' · ' + tokEl.getAttribute('data-token') : '';
    const seam = el.dataset.seamX;
    if (!extra && seam !== undefined) {
      /* which side of the "/" seam: render left, working right */
      const sx = Number(seam);
      const onRender = x < sx + (r.height - y);
      extra = onRender ? ' · render' : ' · working';
    }
    tag.textContent = `x ${Math.round(x / s)}  y ${Math.round(y / s)}${extra}`;
    m.classList.add('on');
    mx.style.transform = `translateX(${x}px)`;
    my.style.transform = `translateY(${y}px)`;
    const tw = tag.offsetWidth;
    const th = tag.offsetHeight;
    const tx = x + 14 + tw > r.width ? x - 14 - tw : x + 14;
    const ty = y + 14 + th > r.height ? y - 14 - th : y + 14;
    tag.style.transform = `translate(${Math.max(0, tx)}px,${Math.max(0, ty)}px)`;
  });
  el.addEventListener('pointerleave', () => m.classList.remove('on'));
}

export function initMeasure(): void {
  document.querySelectorAll<HTMLElement>('[data-measure]').forEach((el) => {
    if (claim(el, 'measure')) attach(el);
  });
}
