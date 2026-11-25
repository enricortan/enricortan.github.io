/** Nav (Kai): a hairline under the bar once the page scrolls; the phone menu closes on navigation. */
import { claim } from './env';

export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav || !claim(nav, 'nav')) return;
  const update = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', update, { passive: true });
  update();

  const menu = nav.querySelector<HTMLElement>('#nav-menu');
  const btn = nav.querySelector<HTMLButtonElement>('.nav-menu-btn');
  if (menu && btn && 'showPopover' in menu) {
    menu.addEventListener('toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    });
    menu.addEventListener('click', (e) => {
      if ((e.target as Element).closest('a')) menu.hidePopover();
    });
  }
}
