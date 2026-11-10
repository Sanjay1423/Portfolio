export {};

// Mobile menu (native <dialog>) and scrollspy.

/* ---------- Menu ---------- */
const dialog = document.getElementById('menu') as HTMLDialogElement | null;
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');

function setExpanded(open: boolean): void {
  if (!openBtn) return;
  openBtn.setAttribute('aria-expanded', String(open));
  openBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (dialog && openBtn) {
  openBtn.addEventListener('click', () => {
    dialog.showModal();
    setExpanded(true);
  });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => setExpanded(false));

  // Close first, then navigate, so the page is not inert while it scrolls.
  dialog.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = link.hash;
      dialog.close();
      requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;
        history.pushState(null, '', hash);
        target.scrollIntoView();
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    });
  });

  // Leaving the small-screen layout with the menu open: close it.
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}

/* ---------- Scrollspy ---------- */
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-nav]'));
const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
const lastId = sections[sections.length - 1]?.id;
const visible = new Set<string>();
let active: string | null = null;

function setActive(id: string | null): void {
  if (id === active) return;
  active = id;
  links.forEach((link) => {
    if (link.dataset.nav === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

function atBottom(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
}

function update(): void {
  // End-of-page rule (kept from the old site): the short last section wins at the bottom.
  if (atBottom() && lastId) {
    setActive(lastId);
    return;
  }
  const current = sections.find((s) => visible.has(s.id));
  setActive(current ? current.id : null);
}

if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      update();
    },
    // A thin band across the upper middle of the viewport decides the active section.
    { rootMargin: '-35% 0px -60% 0px', threshold: 0 },
  );
  sections.forEach((s) => observer.observe(s));

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
}
