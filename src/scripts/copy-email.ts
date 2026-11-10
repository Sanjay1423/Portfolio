export {};

// Copy email. mailto: stays the default link behavior; this is an extra button.
const btn = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const label = btn?.querySelector<HTMLElement>('[data-copy-label]');
const link = document.querySelector<HTMLAnchorElement>('[data-email]');
const status = document.querySelector<HTMLElement>('[data-copy-status]');
let timer: number | undefined;

function selectText(el: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function announce(message: string): void {
  if (!status) return;
  status.textContent = '';
  // Re-set on the next frame so repeated copies are announced again.
  requestAnimationFrame(() => (status.textContent = message));
}

btn?.addEventListener('click', async () => {
  if (!link || !label) return;
  const email = link.textContent?.trim() ?? '';
  try {
    if (!navigator.clipboard) throw new Error('no clipboard');
    await navigator.clipboard.writeText(email);
    label.textContent = 'Copied';
    btn.classList.add('is-copied');
    announce('Email address copied');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      label.textContent = 'Copy';
      btn.classList.remove('is-copied');
    }, 1800);
  } catch {
    selectText(link);
    announce('Could not copy automatically. The email address is selected.');
  }
});
