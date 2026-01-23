/* Mobile navigation (hamburger + drawer) for all pages */
(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  const overlay = document.querySelector('[data-nav-overlay]');

  // Debug: confirm script is running (use error channel so it shows up reliably)
  console.error('[nav] init', { hasToggle: !!toggle, hasNav: !!nav, hasOverlay: !!overlay });

  if (!toggle || !nav) return;

  const body = document.body;
  const openClass = 'nav-open';

  function setOpen(isOpen) {
    body.classList.toggle(openClass, isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (overlay) overlay.hidden = !isOpen;
    console.error('[nav] setOpen', isOpen);
  }

  function isOpen() {
    return body.classList.contains(openClass);
  }

  toggle.addEventListener('click', () => {
    console.error('[nav] toggle click');
    setOpen(!isOpen());
  });

  if (overlay) overlay.addEventListener('click', () => setOpen(false));

  nav.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (a) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  const mq = window.matchMedia('(max-width: 760px)');
  const onMqChange = (e) => {
    if (!e.matches) setOpen(false);
  };

  // Compatibility: Safari < 14 uses addListener/removeListener
  if (mq.addEventListener) mq.addEventListener('change', onMqChange);
  else if (mq.addListener) mq.addListener(onMqChange);

  setOpen(false);
})();
