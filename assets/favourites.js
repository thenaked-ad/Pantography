/* Favourites: artworks a visitor has starred, saved in this browser as a list
   of product handles (newest first). Stars come from snippets/favourite-star.liquid
   and the collection search; the miniatures builder shares the same list through
   window.PantographyFavourites. The FAVOURITES tab (section-collection-list) shows
   the list in place of the collection grid at #favourites. Each star is sent to
   Microsoft Clarity as a custom event. */
(() => {
  if (window.PantographyFavourites) return;

  const KEY = 'pantography-favourites-v1';
  const HASH = '#favourites';
  const STAR_PATH = 'M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z';

  const read = () => {
    try {
      const value = JSON.parse(window.localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value.filter((h) => typeof h === 'string' && h) : [];
    } catch (error) {
      return [];
    }
  };
  let list = read();

  const write = () => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
    } catch (error) {
      /* private browsing or storage blocked: stars still work until the page closes */
    }
  };

  const track = (handle, on) => {
    if (typeof window.clarity !== 'function') return;
    try {
      window.clarity('event', on ? 'favourite-add' : 'favourite-remove');
      if (on) window.clarity('set', 'favourite', handle);
    } catch (error) { /* analytics never blocks the star */ }
  };

  /* ------------------------------------------------------------ the stars */

  const label = (button, on) => {
    const title = button.dataset.favTitle || 'this artwork';
    button.setAttribute('aria-label', on ? `Remove ${title} from favourites` : `Add ${title} to favourites`);
  };

  const refresh = () => {
    const starred = new Set(list);
    document.querySelectorAll('[data-fav]').forEach((button) => {
      const on = starred.has(button.dataset.fav);
      if (button.getAttribute('aria-pressed') !== String(on)) {
        button.setAttribute('aria-pressed', String(on));
        label(button, on);
      }
    });
    document.querySelectorAll('[data-fav-count]').forEach((count) => {
      count.textContent = list.length ? ` (${list.length})` : '';
    });
  };

  const changed = (handle, on) => {
    refresh();
    document.dispatchEvent(new CustomEvent('pantography:favourites', {
      detail: { list: list.slice(), handle, on }
    }));
  };

  const api = {
    list: () => list.slice(),
    has: (handle) => list.includes(handle),
    /* quiet: no Clarity event (used when the builder copies in its old shortlist) */
    set(handle, on, quiet) {
      if (!handle || on === list.includes(handle)) return;
      list = on ? [handle, ...list] : list.filter((h) => h !== handle);
      write();
      if (!quiet) track(handle, on);
      changed(handle, on);
    },
    toggle(handle) {
      api.set(handle, !list.includes(handle));
    },
    /* a star for cards built in JavaScript (the collection search) */
    star(handle, title) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'fav-star';
      button.dataset.fav = handle;
      button.dataset.favTitle = title || '';
      const on = list.includes(handle);
      button.setAttribute('aria-pressed', String(on));
      label(button, on);
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${STAR_PATH}"/></svg>`;
      return button;
    }
  };
  window.PantographyFavourites = api;

  /* capture phase, so card links and quick views underneath never see the click */
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = button.dataset.fav;
    const removing = list.includes(handle);
    api.toggle(handle);
    /* unstarring inside the favourites view takes the card away */
    const card = removing && button.closest('[data-fav-grid] > li');
    if (card) {
      card.remove();
      if (view.grid && !view.grid.children.length) showEmpty();
    }
  }, true);

  /* another tab changed the list */
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    list = read();
    changed();
  });

  /* "load more" and quick views add cards after the page has loaded */
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; refresh(); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* --------------------------------------------------- the favourites view */

  const view = { open: false, grid: null, empty: null, hidden: [], active: null };
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  const fetchCard = async (handle) => {
    const response = await fetch(`${root}products/${encodeURIComponent(handle)}?section_id=product-item`);
    if (response.status === 404) return { handle, gone: true };
    if (!response.ok) return { handle };
    const holder = document.createElement('template');
    holder.innerHTML = await response.text();
    const card = holder.content.querySelector('li.product-card');
    if (!card) return { handle };
    /* the theme fades cards in on scroll; these are already in view */
    ['data-sal', 'data-sal-duration', 'data-sal-delay'].forEach((name) => card.removeAttribute(name));
    return { handle, card };
  };

  const showEmpty = () => {
    if (view.empty) return;
    view.empty = document.createElement('p');
    view.empty.className = 'fav-empty';
    view.empty.textContent = 'Nothing saved yet. Tap the star on any artwork to keep it here.';
    view.grid.after(view.empty);
  };

  const openView = async () => {
    const collectionGrid = document.getElementById('collection');
    const tab = document.querySelector('[data-fav-tab]');
    if (!collectionGrid || !tab || view.open) return;
    view.open = true;

    /* an attribute, not [hidden]: the theme's display rules beat [hidden] */
    view.hidden = [...document.querySelectorAll('#collection, .n6pg')];
    view.hidden.forEach((el) => el.setAttribute('data-fav-hidden', ''));

    const tabs = tab.closest('ul');
    view.active = tabs ? tabs.querySelector('a.active:not([data-fav-tab])') : null;
    if (view.active) view.active.classList.remove('active');
    tab.classList.add('active');

    view.grid = document.createElement('ul');
    view.grid.className = collectionGrid.className.replace(/\bl4cl-initialized\b/, '').trim();
    view.grid.dataset.favGrid = '';
    collectionGrid.after(view.grid);

    if (!list.length) {
      showEmpty();
      return;
    }
    const results = await Promise.all(list.map((handle) => fetchCard(handle).catch(() => ({ handle }))));
    if (!view.open) return;
    results.forEach((result) => {
      if (result.gone) api.set(result.handle, false, true);   /* the product no longer exists */
      else if (result.card) view.grid.append(result.card);
    });
    refresh();
    if (!view.grid.children.length) showEmpty();
  };

  const closeView = () => {
    if (!view.open) return;
    view.open = false;
    if (view.grid) view.grid.remove();
    if (view.empty) view.empty.remove();
    view.grid = null;
    view.empty = null;
    view.hidden.forEach((el) => el.removeAttribute('data-fav-hidden'));
    view.hidden = [];
    const tab = document.querySelector('[data-fav-tab]');
    if (tab) tab.classList.remove('active');
    if (view.active) view.active.classList.add('active');
    view.active = null;
  };

  const sync = () => {
    if (window.location.hash === HASH) openView();
    else closeView();
  };

  /* capture phase, so the theme's smooth scrolling for # links never sees it */
  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-fav-tab]');
    if (!tab || !document.getElementById('collection')) return;
    event.preventDefault();
    event.stopPropagation();
    if (window.location.hash !== HASH) window.history.pushState(null, '', HASH);
    sync();
  }, true);
  window.addEventListener('popstate', sync);
  window.addEventListener('hashchange', sync);

  const start = () => {
    refresh();
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
