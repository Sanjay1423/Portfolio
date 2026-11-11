export {};

// Theme toggle. The saved choice is applied before first paint by the inline script in Base.astro.
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');
const COLORS = { light: '#f3f0e8', dark: '#0f0e0d' } as const;

type Theme = keyof typeof COLORS;

function current(): Theme {
  const set = root.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return media.matches ? 'dark' : 'light';
}

function syncButtons(): void {
  const next = current() === 'dark' ? 'light' : 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', `Switch to ${next} theme`);
  });
}

function apply(theme: Theme): void {
  root.setAttribute('data-theme', theme);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', COLORS[theme]));
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage unavailable: the choice lasts for this page view only */
  }
  syncButtons();
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark'));
});
media.addEventListener('change', syncButtons);
syncButtons();
