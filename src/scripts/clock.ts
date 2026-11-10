export {};

// "Chennai · local time HH:MM", updated each minute. The server-rendered text is just "Chennai".
const el = document.querySelector<HTMLElement>('[data-clock]');

if (el) {
  const city = el.textContent?.trim() ?? 'Chennai';
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const render = () => {
    el.textContent = `${city} · local time ${fmt.format(new Date())}`;
  };
  render();
  // Align updates to the start of each minute.
  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  window.setTimeout(() => {
    render();
    window.setInterval(render, 60_000);
  }, msToNextMinute);
}
