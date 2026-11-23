/* Wall builder. Markup and settings: sections/wall-builder.liquid.
   Catalogue: templates/collection.wallfeed.liquid, read from the Floating and the
   Flat collections. The artworks are the visitor's favourites (assets/favourites.js).
   The frames fill the space in their true proportions; the wall's real size is
   written underneath. Each frame is the studio's front shot of that artwork: the Flat
   product's image in the chosen colour, or the Floating product's main image (a white
   frame; Black and Wood lay the studio's moulding over it). A drawn frame shows while
   a photo loads, or if there isn't one. */
if (!customElements.get('wall-builder')) {
  const STORAGE_KEY = 'pantography-wall-v1';
  const GAP_CM = 12;  /* between frames on the wall (about 5in) */
  const GAP_IN = 5;

  /* Frame sizes as sold. art = the stamp's width and bar = the moulding's, each as a
     share of the frame's width, measured from the studio's product mockups. */
  const SIZES = {
    floating: [
      { key: 'Small', w: 27, h: 28, art: 0.45, bar: 0.052 },
      { key: 'Medium', w: 53, h: 56, art: 0.54, bar: 0.037 },
      { key: 'Large', w: 90, h: 95, art: 0.56, bar: 0.033 }
    ],
    flat: [
      { key: 'Medium', w: 48, h: 52, art: 0.62, bar: 0.03 },
      { key: 'Large', w: 70, h: 75, art: 0.62, bar: 0.028 }
    ]
  };
  const STYLES = { floating: 'Floating', flat: 'Flat' };
  const COLOURS = ['White', 'Black', 'Wood'];

  /* Floating and Flat are separate products, paired by title: "ALABAMA" and
     "ALABAMA FLAT". One Flat title is misspelt in the store (SOLOMAN ISLANDS FLAT). */
  const titleKey = (title) => String(title || '').toUpperCase().replace(/\s+/g, ' ').trim()
    .replace(/\s+FLAT(\s+PRINTS?)?$/, '')
    .replace(/^SOLOMAN\b/, 'SOLOMON');
  const sizeOf = (label) => {
    if (/small/i.test(label)) return 'Small';
    if (/large/i.test(label)) return 'Large';
    if (/medium/i.test(label)) return 'Medium';
    return '';
  };
  const colourOf = (label) => COLOURS.find((c) => c.toLowerCase() === String(label || '').trim().toLowerCase()) || '';
  const titleCase = (text) => String(text).toLowerCase().replace(/(^|[\s(\-.])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  const columnsFor = (n) => (n <= 3 ? n : n === 4 ? 2 : Math.ceil(Math.sqrt(n)));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const listOf = (names) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

  const formatMoney = (cents, format) => {
    const group = (value, decimals, thousands, point) => {
      const [whole, part] = (value / 100).toFixed(decimals).split('.');
      return whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + (part ? point + part : '');
    };
    return (format || '£{{amount}}').replace(/\{\{\s*(\w+)\s*\}\}/, (match, key) => {
      if (key === 'amount_no_decimals') return group(cents, 0, ',', '.');
      if (key === 'amount_with_comma_separator') return group(cents, 2, '.', ',');
      if (key === 'amount_no_decimals_with_comma_separator') return group(cents, 0, '.', ',');
      return group(cents, 2, ',', '.');
    });
  };

  class WallBuilder extends HTMLElement {
    connectedCallback() {
      if (this.started) return;
      this.started = true;
      const find = (name) => this.querySelector(`[data-wb-${name}]`);
      this.el = {
        wall: find('wall'), dims: find('dims'), strip: find('strip'), favCount: find('fav-count'),
        favHint: find('fav-hint'), styles: find('styles'), sizes: find('sizes'), colours: find('colours'),
        count: find('count'), total: find('total'), submit: find('submit'), status: find('status')
      };
      this.root = (this.dataset.root || '/').replace(/\/?$/, '/');
      this.moneyFormat = this.dataset.moneyFormat;

      /* The site's fonts come from a font app that styles p, li, a and headings.
         Buttons and spans miss out, so copy the font from a probe paragraph. */
      const probe = this.querySelector('[data-wb-font-probe]');
      const copyFont = () => this.style.setProperty('--wb-font', getComputedStyle(probe).fontFamily);
      copyFont();
      window.addEventListener('load', copyFont, { once: true });

      this.state = this.restore();
      this.byHandle = new Map();
      this.byKey = new Map();
      this.frames = new Map();
      this.loaded = false;

      this.bind();
      this.renderOptions();
      this.render();
      this.load();
      document.addEventListener('pantography:favourites', () => this.render());
      new ResizeObserver(() => this.layout()).observe(this.el.wall);
    }

    /* ------------------------------------------------------------ state */

    restore() {
      let saved = {};
      try { saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (error) { saved = {}; }
      const style = SIZES[saved.style] ? saved.style : 'floating';
      const size = SIZES[style].some((s) => s.key === saved.size) ? saved.size : 'Medium';
      const colour = COLOURS.includes(saved.colour) ? saved.colour : 'White';
      const off = Array.isArray(saved.off) ? saved.off.filter((k) => typeof k === 'string') : [];
      return { style, size, colour, off };
    }

    save() {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (error) { /* storage blocked */ }
    }

    get size() {
      return SIZES[this.state.style].find((s) => s.key === this.state.size) || SIZES[this.state.style][0];
    }

    /* -------------------------------------------------------- catalogue */

    async load() {
      try {
        await Promise.all([
          this.loadFeed(this.dataset.floatingUrl, 'floating'),
          this.loadFeed(this.dataset.flatUrl, 'flat')
        ]);
        this.loaded = true;
      } catch (error) {
        this.failed = true;
      }
      this.render();
    }

    async loadFeed(url, style) {
      if (!url) return;
      const get = (page) => fetch(`${url}?view=wallfeed&page=${page}`, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw new Error(`Feed ${response.status}`);
          return response.json();
        });
      const first = await get(1);
      const rest = await Promise.all(Array.from({ length: Math.max(0, (first.pages || 1) - 1) }, (_, i) => get(i + 2)));
      [first, ...rest].forEach((page) => page.items.forEach((item) => this.addItem(item, style)));
    }

    addItem(item, style) {
      const product = {
        handle: item.h,
        title: item.t,
        url: item.u,
        art: item.a,
        photo: item.i,
        front: item.f,
        style,
        key: titleKey(item.t),
        variants: (item.v || []).map(([id, one, two, price, available, image]) => {
          const colourFirst = Boolean(colourOf(one));
          return {
            id,
            size: sizeOf(colourFirst ? two : one),
            colour: colourOf(colourFirst ? one : two),
            price,
            available,
            image
          };
        })
      };
      this.byHandle.set(product.handle, product);
      const pair = this.byKey.get(product.key) || {};
      if (!pair[style]) pair[style] = product;
      this.byKey.set(product.key, pair);
    }

    /* The favourites, newest first, one per artwork even if both its Floating and
       its Flat versions are hearted. */
    pieces() {
      const favourites = window.PantographyFavourites ? window.PantographyFavourites.list() : [];
      const seen = new Set();
      const pieces = [];
      favourites.forEach((handle) => {
        const hearted = this.byHandle.get(handle);
        if (!hearted || seen.has(hearted.key)) return;
        seen.add(hearted.key);
        const pair = this.byKey.get(hearted.key);
        const named = pair.floating || pair.flat;
        pieces.push({
          key: hearted.key,
          pair,
          name: titleCase(named.title.replace(/\s+FLAT(\s+PRINTS?)?$/i, '')),
          art: (pair.floating && pair.floating.art) || (pair.flat && pair.flat.art) || '',
          photo: (pair.flat && pair.flat.photo) || (pair.floating && pair.floating.photo) || ''
        });
      });
      return pieces;
    }

    variantFor(piece, size = this.state.size) {
      const product = piece.pair[this.state.style];
      if (!product) return null;
      const variant = product.variants.find((v) => v.size === size && v.colour === this.state.colour);
      return variant && variant.available ? variant : null;
    }

    /* The front shot for the chosen style, size and colour. Flat: the variant's own
       image (either size, same colour). Floating: the white frame's photo, with a
       moulding laid over it for Black and Wood. */
    frontFor(piece) {
      const product = piece.pair[this.state.style];
      if (!product) return null;
      const { colour, size } = this.state;
      if (this.state.style === 'flat') {
        const ofColour = (v) => v.colour === colour && v.image;
        const variant = product.variants.find((v) => ofColour(v) && v.size === size) || product.variants.find(ofColour);
        return variant ? variant.image : null;
      }
      return product.front || null;
    }

    /* --------------------------------------------------------- controls */

    bind() {
      this.addEventListener('click', (event) => {
        const style = event.target.closest('[data-wb-style]');
        if (style) {
          this.state.style = style.dataset.wbStyle;
          if (!SIZES[this.state.style].some((s) => s.key === this.state.size)) this.state.size = 'Medium';
          return this.changed();
        }
        const size = event.target.closest('[data-wb-size]');
        if (size) {
          this.state.size = size.dataset.wbSize;
          return this.changed();
        }
        const colour = event.target.closest('[data-wb-colour]');
        if (colour) {
          this.state.colour = colour.dataset.wbColour;
          return this.changed();
        }
        const piece = event.target.closest('[data-wb-piece]');
        if (piece) {
          const key = piece.dataset.wbPiece;
          const off = new Set(this.state.off);
          if (off.has(key)) off.delete(key);
          else off.add(key);
          this.state.off = [...off];
          return this.changed();
        }
        if (event.target.closest('[data-wb-submit]')) this.addToBasket();
        return undefined;
      });
    }

    changed() {
      this.save();
      this.renderOptions();
      this.render();
    }

    renderOptions() {
      const { style, colour } = this.state;
      this.el.styles.querySelectorAll('[data-wb-style]').forEach((button) => {
        button.setAttribute('aria-checked', String(button.dataset.wbStyle === style));
      });
      this.el.colours.querySelectorAll('[data-wb-colour]').forEach((button) => {
        button.setAttribute('aria-checked', String(button.dataset.wbColour === colour));
      });
      this.el.sizes.replaceChildren(...SIZES[style].map((size) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'wb__option wb__option--size';
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', String(size.key === this.state.size));
        button.dataset.wbSize = size.key;
        button.innerHTML = `<strong>${size.key}</strong><span>${size.w}cm x ${size.h}cm</span><em data-wb-size-price></em>`;
        return button;
      }));
    }

    /* ----------------------------------------------------------- render */

    render() {
      const pieces = this.loaded ? this.pieces() : [];
      const off = new Set(this.state.off);
      const onWall = pieces.filter((piece) => !off.has(piece.key));
      this.onWall = onWall;

      this.renderStrip(pieces, off);
      this.renderWall(pieces, onWall);
      this.renderSummary(onWall);
      this.layout();
    }

    artImage(piece, className) {
      const img = document.createElement('img');
      img.className = className;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (piece.art) img.src = piece.art;
      else {
        /* no stamp art on file: crop the stamp out of the Flat product photo */
        img.src = piece.photo;
        img.classList.add('is-photo');
      }
      return img;
    }

    renderStrip(pieces, off) {
      this.el.favCount.textContent = pieces.length ? `(${pieces.length})` : '';
      this.el.favHint.hidden = pieces.length < 2;
      this.el.strip.closest('.wb__favourites').hidden = !pieces.length;
      this.el.strip.replaceChildren(...pieces.map((piece) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'wb__piece';
        button.dataset.wbPiece = piece.key;
        const on = !off.has(piece.key);
        button.setAttribute('aria-pressed', String(on));
        button.setAttribute('aria-label', `${piece.name}, ${on ? 'on the wall' : 'not on the wall'}`);
        button.title = piece.name;
        const art = document.createElement('span');
        art.className = 'wb__piece-art';
        art.append(this.artImage(piece, 'wb__piece-img'));
        const name = document.createElement('span');
        name.className = 'wb__piece-name';
        name.textContent = piece.name;
        button.append(art, name);
        li.append(button);
        return li;
      }));
    }

    renderWall(pieces, onWall) {
      const { wall } = this.el;
      let message = '';
      if (this.failed) message = 'Sorry, the artworks did not load. Please refresh the page.';
      else if (!this.loaded) message = 'Loading your favourites…';
      else if (!pieces.length) message = 'Your wall is empty. Tap the heart on any artwork and it will appear here.';
      else if (!onWall.length) message = 'Tap a favourite below to put it on the wall.';

      let note = wall.querySelector('.wb__wall-note');
      if (message) {
        if (!note) {
          note = document.createElement('p');
          note.className = 'wb__wall-note';
        }
        note.textContent = message;
        wall.replaceChildren(note);
        this.frames.clear();
        wall.classList.add('is-empty');
        return;
      }
      wall.classList.remove('is-empty');

      /* keep each frame's element (and its loaded image) between renders */
      const frames = onWall.map((piece) => {
        let frame = this.frames.get(piece.key);
        if (!frame) {
          frame = document.createElement('div');
          frame.className = 'wb__frame';
          ['t', 'r', 'b', 'l'].forEach((side) => {
            const bar = document.createElement('span');
            bar.className = `wb__bar wb__bar--${side}`;
            bar.setAttribute('aria-hidden', 'true');
            frame.append(bar);
          });
          const mount = document.createElement('div');
          mount.className = 'wb__mount';
          mount.append(this.artImage(piece, 'wb__art'));
          const front = document.createElement('img');
          front.className = 'wb__front';
          front.alt = '';
          front.decoding = 'async';
          front.addEventListener('load', () => front.classList.add('is-loaded'));
          front.addEventListener('error', () => front.classList.remove('is-loaded'));
          const moulding = document.createElement('span');
          moulding.className = 'wb__moulding';
          moulding.setAttribute('aria-hidden', 'true');
          const missing = document.createElement('span');
          missing.className = 'wb__missing';
          frame.append(mount, front, moulding, missing);
          frame.setAttribute('role', 'img');
          this.frames.set(piece.key, frame);
        }
        const variant = this.variantFor(piece);
        const other = this.state.style === 'flat' ? 'floating' : 'flat';
        const why = piece.pair[this.state.style] ? 'Not available in this size' : `Only available ${STYLES[other]}`;
        frame.dataset.frame = this.state.colour;
        frame.dataset.style = this.state.style;
        const front = frame.querySelector('.wb__front');
        const src = this.frontFor(piece);
        if (!src) {
          front.removeAttribute('src');
          front.classList.remove('is-loaded');
        } else if (front.getAttribute('src') !== src) {
          front.src = src; /* the last photo stays up until this one has loaded */
        }
        frame.classList.toggle('is-unavailable', !variant);
        frame.querySelector('.wb__missing').textContent = variant ? '' : why;
        frame.setAttribute('aria-label', variant ? piece.name : `${piece.name}, ${why.toLowerCase()}`);
        return frame;
      });
      [...this.frames.keys()].forEach((key) => {
        if (!onWall.some((piece) => piece.key === key)) this.frames.delete(key);
      });
      const grid = wall.querySelector('.wb__grid') || document.createElement('div');
      grid.className = 'wb__grid';
      grid.replaceChildren(...frames);
      if (grid.parentNode !== wall) wall.replaceChildren(grid);
    }

    /* sizes every frame to scale for the space the wall has */
    layout() {
      const { wall, dims } = this.el;
      const grid = wall.querySelector('.wb__grid');
      const n = this.onWall ? this.onWall.length : 0;
      if (!grid || !n) {
        wall.style.removeProperty('height');
        dims.textContent = '';
        return;
      }
      const size = this.size;
      const cols = columnsFor(n);
      const rows = Math.ceil(n / cols);
      const styles = getComputedStyle(wall);
      const width = wall.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const maxHeight = Math.min(window.innerHeight * 0.6, 620, width * 1.1);
      /* the most a frame can be across and still fit, never more than 300px */
      const frameWidth = Math.min(
        300,
        (width - 2) / (cols + (cols - 1) * GAP_CM / size.w),
        maxHeight / (rows * size.h / size.w + (rows - 1) * GAP_CM / size.w)
      );
      const cm = frameWidth / size.w;
      const height = rows * size.h * cm + (rows - 1) * GAP_CM * cm;

      wall.style.height = `${Math.ceil(height + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom))}px`;
      grid.style.setProperty('--wb-cm', `${cm}px`);
      grid.style.setProperty('--wb-fw', `${size.w * cm}px`);
      grid.style.setProperty('--wb-fh', `${size.h * cm}px`);
      grid.style.setProperty('--wb-gap', `${GAP_CM * cm}px`);
      grid.style.setProperty('--wb-t', `${Math.max(2, size.w * size.bar * cm)}px`);
      grid.style.setProperty('--wb-art', `${size.art * 100}%`);
      grid.style.width = `${Math.ceil(cols * size.w * cm + (cols - 1) * GAP_CM * cm) + 1}px`;

      const wallW = cols * size.w + (cols - 1) * GAP_CM;
      const wallH = rows * size.h + (rows - 1) * GAP_CM;
      dims.textContent = n > 1
        ? `Your wall: about ${wallW}cm x ${wallH}cm, with ${GAP_CM}cm/${GAP_IN}in between frames`
        : `Frame: ${size.w}cm x ${size.h}cm`;
    }

    renderSummary(onWall) {
      const { style, colour } = this.state;
      const size = this.size;
      const ready = onWall.filter((piece) => this.variantFor(piece));
      const missing = onWall.filter((piece) => !this.variantFor(piece));
      const total = ready.reduce((sum, piece) => sum + this.variantFor(piece).price, 0);

      this.el.sizes.querySelectorAll('[data-wb-size]').forEach((button) => {
        const sum = onWall.reduce((acc, piece) => {
          const variant = this.variantFor(piece, button.dataset.wbSize);
          return acc + (variant ? variant.price : 0);
        }, 0);
        button.querySelector('[data-wb-size-price]').textContent = sum ? formatMoney(sum, this.moneyFormat) : '';
      });

      this.el.count.textContent = ready.length
        ? `${plural(ready.length, 'artwork', 'artworks')}, ${size.key} ${STYLES[style]} ${size.w}cm x ${size.h}cm, ${colour} frames`
        : '';
      this.el.total.textContent = ready.length ? formatMoney(total, this.moneyFormat) : '';
      this.el.submit.disabled = !ready.length || this.busy;
      this.el.submit.textContent = ready.length > 1 ? `Add all ${ready.length} to basket` : 'Add to basket';
      this.el.status.textContent = missing.length
        ? `${listOf(missing.map((piece) => piece.name))} ${missing.length === 1 ? 'is' : 'are'} not available as ${size.key} ${STYLES[style]} in ${colour}, so ${missing.length === 1 ? 'it' : 'they'} won't be added.`
        : '';
    }

    /* ----------------------------------------------------------- basket */

    async addToBasket() {
      const ready = (this.onWall || []).filter((piece) => this.variantFor(piece));
      if (!ready.length || this.busy) return;
      this.busy = true;
      this.el.submit.disabled = true;
      this.el.submit.textContent = 'Adding…';
      try {
        const response = await fetch(`${this.root}cart/add.js`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: ready.map((piece) => ({ id: this.variantFor(piece).id, quantity: 1 })) })
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.description || error.message || 'Something went wrong. Please try again.');
        }
        if (typeof window.clarity === 'function') {
          try { window.clarity('event', 'wall-add-to-basket'); } catch (error) { /* analytics never blocks */ }
        }
        window.location.href = `${this.root}cart`;
      } catch (error) {
        this.busy = false;
        this.renderSummary(this.onWall || []);
        this.el.status.textContent = error.message;
      }
    }
  }

  customElements.define('wall-builder', WallBuilder);
}
