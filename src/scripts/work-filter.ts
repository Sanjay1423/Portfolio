export {};

// Work filter: All / Professional / Earlier. Without JS the buttons are hidden and every project shows.
const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.work-filters [data-filter]'));
const rows = Array.from(document.querySelectorAll<HTMLElement>('.work-list .project'));
const status = document.querySelector<HTMLElement>('[data-work-status]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const FADE_MS = 280; // --t-base

function apply(filter: string, announce = true): void {
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));

  let shown = 0;
  rows.forEach((row) => {
    const show = filter === 'all' || row.dataset.group === filter;
    if (show) shown += 1;

    if (show && row.hidden) {
      row.hidden = false;
      if (!reduce.matches) {
        row.classList.add('is-fading');
        requestAnimationFrame(() => requestAnimationFrame(() => row.classList.remove('is-fading')));
      }
    } else if (!show && !row.hidden) {
      if (reduce.matches) {
        row.hidden = true;
      } else {
        row.classList.add('is-fading');
        window.setTimeout(() => {
          // Only hide if the filter has not changed back in the meantime.
          if (row.classList.contains('is-fading')) {
            row.hidden = true;
            row.classList.remove('is-fading');
          }
        }, FADE_MS);
      }
    } else if (show) {
      row.classList.remove('is-fading');
    }
  });

  if (announce && status) {
    status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
  }
}

buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter ?? 'all')));

// A Stack link can target a row the current filter hides: reset to All, then show the row.
function revealTarget(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const row = rows.find((r) => r.id === id);
  if (!row || !(row.hidden || row.classList.contains('is-fading'))) return;
  rows.forEach((r) => {
    r.hidden = false;
    r.classList.remove('is-fading');
  });
  apply('all', true);
  row.scrollIntoView();
}
window.addEventListener('hashchange', revealTarget);

// Before an in-page link navigates to a hidden row, reset the filter so the browser can scroll to it.
document.addEventListener(
  'click',
  (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const row = rows.find((r) => r.id === decodeURIComponent(link.hash.slice(1)));
    if (row && (row.hidden || row.classList.contains('is-fading'))) {
      rows.forEach((r) => {
        r.hidden = false;
        r.classList.remove('is-fading');
      });
      apply('all', true);
    }
  },
  true,
);
