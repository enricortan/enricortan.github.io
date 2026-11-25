/**
 * Work index preview (Kai). Hover (fine pointer) or focus a row: the preview box shows the
 * drawing (grid, frame, redline dimensions), then the render is built over it by a 45° seam
 * reveal, 520ms cubic-bezier(.22,1,.36,1). The image is cloned from its <template> on first
 * use, so it only loads then. Locked rows show the lock plate and never an image.
 * Reduced motion: swaps instantly.
 */
import { claim, finePointer, reduced, seamClip } from './env';

function setup(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>('[data-preview-box]');
  const render = root.querySelector<HTMLElement>('[data-preview-render]');
  const cap = root.querySelector<HTMLElement>('[data-preview-cap]');
  const dimW = root.querySelector<HTMLElement>('[data-dim-w]');
  const dimH = root.querySelector<HTMLElement>('[data-dim-h]');
  if (!box || !render) return;
  const rows = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-index-row]'));
  const cache = new Map<string, Node>();
  let current: string | null = null;
  let anim: Animation | null = null;

  function show(row: HTMLAnchorElement) {
    const id = row.dataset.indexRow ?? '';
    if (id === current || !box || !render) return;
    current = id;
    rows.forEach((r) => r.classList.toggle('is-current', r === row));
    const locked = row.hasAttribute('data-locked');
    box.classList.toggle('is-locked', locked);
    if (cap) cap.textContent = `${row.dataset.number ?? ''}  ${row.dataset.title ?? ''}${locked ? ' · password' : ', drawn, then built'}`;
    if (dimW) dimW.textContent = row.dataset.w ?? '—';
    if (dimH) dimH.textContent = row.dataset.h ?? '—';
    anim?.cancel();
    render.replaceChildren();
    if (locked) return;
    const tpl = root.querySelector<HTMLTemplateElement>(`template[data-preview-tpl="${id}"]`);
    if (!tpl) return;
    let node = cache.get(id);
    if (!node) {
      node = tpl.content.cloneNode(true);
      cache.set(id, node);
    }
    render.appendChild(node.cloneNode(true));
    if (reduced() || !render.animate) {
      render.style.clipPath = 'none';
      return;
    }
    const w = box.clientWidth;
    const h = box.clientHeight;
    render.style.clipPath = seamClip(-h - 2, h);
    anim = render.animate([{ clipPath: seamClip(-h - 2, h) }, { clipPath: seamClip(w + 2, h) }], {
      duration: 520,
      delay: 90,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'forwards',
    });
  }

  root.addEventListener('pointerover', (e) => {
    const r = (e.target as Element).closest<HTMLAnchorElement>('[data-index-row]');
    if (r && finePointer()) show(r);
  });
  root.addEventListener('focusin', (e) => {
    const r = (e.target as Element).closest<HTMLAnchorElement>('[data-index-row]');
    if (r) show(r);
  });
}

export function initWorkIndex(): void {
  document.querySelectorAll<HTMLElement>('[data-work-index]').forEach((el) => {
    if (claim(el, 'index')) setup(el);
  });
}
