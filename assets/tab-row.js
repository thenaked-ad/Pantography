/* Collection tabs as one row (section-collection-list "tab_row", styles in
   assets/tab-row.css). When the row is wider than the screen it scrolls sideways:
   swipe on touch screens, drag with a mouse. The edges fade while there is more
   to see, and the current tab is brought into view. */
(() => {
  const setup = (row) => {
    if (row.dataset.tabRowReady) return;
    row.dataset.tabRowReady = '';

    const overflowing = () => row.scrollWidth > row.clientWidth + 1;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      row.classList.toggle('tab-row--more-left', overflowing() && row.scrollLeft > 2);
      row.classList.toggle('tab-row--more-right', overflowing() && row.scrollLeft < max - 2);
    };
    row.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(row);

    /* centre the current collection's tab when the row scrolls */
    const current = [...row.querySelectorAll('a[href]')]
      .find((a) => a.pathname === window.location.pathname);
    if (current && overflowing()) {
      const tab = current.closest('li') || current;
      row.scrollLeft = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    }

    /* drag to scroll with a mouse; touch screens scroll natively */
    let down = false;
    let dragged = false;
    let startX = 0;
    let startLeft = 0;
    row.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !overflowing()) return;
      down = true;
      dragged = false;
      startX = event.clientX;
      startLeft = row.scrollLeft;
    });
    window.addEventListener('pointermove', (event) => {
      if (!down) return;
      const dx = event.clientX - startX;
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true;
        row.classList.add('is-dragging');
      }
      if (dragged) row.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      row.classList.remove('is-dragging');
    });
    /* window capture runs before every other click handler, so letting go after
       a drag never opens a tab */
    window.addEventListener('click', (event) => {
      if (!dragged || !row.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);
    row.addEventListener('dragstart', (event) => event.preventDefault());

    update();
  };

  const start = () => document.querySelectorAll('ul[data-tab-row]').forEach(setup);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  document.addEventListener('shopify:section:load', start);
})();
