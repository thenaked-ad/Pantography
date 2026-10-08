/* Miniatures builder. Markup and settings: sections/miniatures-builder.liquid.
   Catalogue: templates/collection.miniart.liquid. */
if (!customElements.get('miniatures-builder')) {
  const STORAGE_KEY = 'pantography-miniatures-v1';
  const MAX_POSITIONS = 60;
  const FRAME_ORDER = ['White', 'Black', 'Wood'];
  const COLOUR_ORDER = ['Blue', 'Teal', 'Green', 'Yellow', 'Orange', 'Red', 'Pink', 'Purple', 'Grey'];
  const MODE_LABELS = {
    pick: 'Chosen by me',
    arrange: 'Arranged from my shortlist',
    studio: 'Chosen by the studio'
  };

  const pad = (n) => String(n).padStart(2, '0');
  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
  /* Store titles are upper case with roman numerals (EGYPT II); keep them as they are,
     only tidying doubled spaces such as "SCOTLAND,  GLASGOW". */
  const titleCase = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  class MiniaturesBuilder extends HTMLElement {
    connectedCallback() {
      if (this.started) return;
      this.started = true;

      this.sizes = JSON.parse(this.querySelector('[data-mb-sizes]').textContent)
        .sort((a, b) => a.count - b.count);
      this.allowDuplicates = this.dataset.allowDuplicates !== 'false';
      this.showPositions = this.dataset.showPositions !== 'false';
      this.catalogue = [];
      this.byHandle = new Map();
      this.filter = { text: '', colour: '', starred: false };

      this.el = {};
      [
        'frame', 'grid', 'stage-note', 'clear-cell', 'clear-all', 'title', 'price', 'dims',
        'sizes-list', 'frames', 'frame-name', 'studio-fill', 'generate', 'notes',
        'shortlist-wrap', 'shortlist', 'shortlist-count', 'variant', 'properties', 'status',
        'submit', 'picker', 'picker-title', 'search', 'colours', 'picker-status', 'cards'
      ].forEach((name) => {
        this.el[name.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = this.querySelector(`[data-mb-${name}]`);
      });
      this.form = this.el.variant.form;

      this.state = this.restore();
      this.bind();
      this.renderAll();
      this.loadCatalogue();
    }

    /* ---------------------------------------------------------------- state */

    restore() {
      const productId = Number(this.dataset.productId);
      const size = this.sizes.find((s) => s.id === productId) || this.sizes[0];
      let saved = {};
      try {
        saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') || {};
      } catch (error) {
        saved = {};
      }
      const positions = Array.isArray(saved.positions) ? saved.positions.slice(0, MAX_POSITIONS) : [];
      while (positions.length < MAX_POSITIONS) positions.push(null);
      return {
        sizeId: size.id,
        frame: saved.frame || 'White',
        mode: MODE_LABELS[saved.mode] ? saved.mode : 'pick',
        positions,
        shortlist: Array.isArray(saved.shortlist) ? saved.shortlist : [],
        notes: typeof saved.notes === 'string' ? saved.notes : '',
        studioFill: Boolean(saved.studioFill),
        selected: null
      };
    }

    save() {
      const { frame, mode, positions, shortlist, notes, studioFill } = this.state;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ frame, mode, positions, shortlist, notes, studioFill }));
      } catch (error) {
        /* private browsing or storage blocked: the builder still works, it just forgets */
      }
    }

    get size() {
      return this.sizes.find((s) => s.id === this.state.sizeId) || this.sizes[0];
    }

    get variant() {
      const variants = this.size.variants;
      return variants.find((v) => v.frame === this.state.frame) || variants.find((v) => v.available) || variants[0];
    }

    get activePositions() {
      return this.state.positions.slice(0, this.size.count);
    }

    /* ---------------------------------------------------------------- events */

    bind() {
      this.querySelectorAll('[data-mb-mode]').forEach((button) => {
        button.addEventListener('click', () => this.setMode(button.dataset.mbMode));
      });

      this.el.grid.addEventListener('click', (event) => {
        const cell = event.target.closest('[data-index]');
        if (cell) this.selectCell(Number(cell.dataset.index));
      });

      this.el.clearCell.addEventListener('click', () => {
        if (this.state.selected === null) return;
        this.state.positions[this.state.selected] = null;
        this.changed();
      });

      this.el.clearAll.addEventListener('click', () => {
        for (let i = 0; i < this.size.count; i += 1) this.state.positions[i] = null;
        this.state.selected = this.state.mode === 'pick' ? 0 : null;
        this.changed();
      });

      this.el.studioFill.addEventListener('change', () => {
        this.state.studioFill = this.el.studioFill.checked;
        this.changed();
      });

      this.el.notes.addEventListener('input', () => {
        this.state.notes = this.el.notes.value;
        this.renderProperties();
        this.save();
      });

      this.el.generate.addEventListener('click', () => this.generate());

      this.el.search.addEventListener('input', () => {
        this.filter.text = normalize(this.el.search.value);
        this.applyFilter();
      });

      this.el.cards.addEventListener('click', (event) => {
        const star = event.target.closest('[data-star]');
        if (star) {
          this.toggleShortlist(star.dataset.star);
          return;
        }
        const card = event.target.closest('[data-handle]');
        if (card) this.chooseArtwork(card.dataset.handle);
      });

      this.el.shortlist.addEventListener('click', (event) => {
        const remove = event.target.closest('[data-unstar]');
        if (remove) this.toggleShortlist(remove.dataset.unstar);
      });

      this.el.grid.addEventListener('dragstart', (event) => {
        const cell = event.target.closest('[data-index]');
        if (!cell || this.state.mode === 'studio') return;
        event.dataTransfer.setData('text/plain', cell.dataset.index);
        event.dataTransfer.effectAllowed = 'move';
      });
      this.el.grid.addEventListener('dragover', (event) => {
        if (event.target.closest('[data-index]')) event.preventDefault();
      });
      this.el.grid.addEventListener('drop', (event) => {
        const cell = event.target.closest('[data-index]');
        const from = Number(event.dataTransfer.getData('text/plain'));
        if (!cell || Number.isNaN(from)) return;
        event.preventDefault();
        const to = Number(cell.dataset.index);
        const positions = this.state.positions;
        [positions[from], positions[to]] = [positions[to], positions[from]];
        this.state.selected = null;
        this.changed();
      });

      /* Runs before the theme's own ajax cart handler, which is bound on the form. */
      this.onSubmitCapture = (event) => {
        if (event.target !== this.form) return;
        this.renderProperties();
        const problem = this.problem();
        if (problem) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.el.status.textContent = problem;
          this.el.status.classList.add('is-error');
        }
      };
      document.addEventListener('submit', this.onSubmitCapture, true);
    }

    disconnectedCallback() {
      document.removeEventListener('submit', this.onSubmitCapture, true);
    }

    /* --------------------------------------------------------------- actions */

    setMode(mode) {
      if (!MODE_LABELS[mode]) return;
      this.state.mode = mode;
      this.state.selected = mode === 'pick' ? this.nextEmpty(-1) : null;
      this.changed();
    }

    setSize(id) {
      this.state.sizeId = id;
      if (this.state.selected !== null && this.state.selected >= this.size.count) this.state.selected = null;
      const url = new URL(this.size.url, window.location.origin);
      url.search = window.location.search;
      try {
        window.history.replaceState(window.history.state, '', url.toString());
      } catch (error) {
        /* not essential */
      }
      this.changed();
    }

    setFrame(frame) {
      this.state.frame = frame;
      this.changed();
    }

    selectCell(index) {
      if (this.state.mode === 'studio') return;
      this.state.selected = this.state.selected === index ? null : index;
      this.renderGrid();
      this.renderPickerTitle();
      if (this.state.selected !== null) this.revealPicker();
    }

    nextEmpty(after) {
      const count = this.size.count;
      for (let step = 1; step <= count; step += 1) {
        const i = (after + step + count) % count;
        if (!this.state.positions[i]) return i;
      }
      return null;
    }

    chooseArtwork(handle) {
      const { mode } = this.state;
      let target = this.state.selected;

      if (target === null && mode !== 'pick') {
        this.toggleShortlist(handle);
        return;
      }
      if (target === null) target = this.nextEmpty(-1);
      if (target === null) {
        this.el.status.textContent = 'The frame is full. Select a position to change it.';
        return;
      }
      if (!this.allowDuplicates && this.activePositions.some((h, i) => h === handle && i !== target)) {
        this.el.status.textContent = 'That artwork is already in your frame.';
        return;
      }

      this.state.positions[target] = handle;
      this.state.selected = mode === 'pick' ? this.nextEmpty(target) : null;
      this.changed();
    }

    toggleShortlist(handle) {
      const list = this.state.shortlist;
      const at = list.indexOf(handle);
      if (at === -1) list.push(handle);
      else list.splice(at, 1);
      this.changed();
    }

    /* Fill every position from the shortlist, spreading repeats evenly and
       keeping identical artworks from touching where possible. */
    generate() {
      const pool = this.state.shortlist.filter((h) => this.byHandle.has(h));
      if (!pool.length) {
        this.el.status.textContent = 'Star a few artworks first.';
        return;
      }
      const { count, cols } = this.size;
      const shuffled = (list) => {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
      };

      let picks = [];
      if (this.allowDuplicates) {
        while (picks.length < count) picks = picks.concat(shuffled(pool));
        picks = shuffled(picks.slice(0, count));
      } else {
        picks = shuffled(pool).slice(0, count);
        while (picks.length < count) picks.push(null);
      }

      const clashes = (list, i) => {
        const h = list[i];
        if (!h) return false;
        const left = i % cols ? list[i - 1] : null;
        const right = (i + 1) % cols && i + 1 < count ? list[i + 1] : null;
        const up = i >= cols ? list[i - cols] : null;
        const down = i + cols < count ? list[i + cols] : null;
        return h === left || h === right || h === up || h === down;
      };
      for (let pass = 0; pass < 6; pass += 1) {
        let fixed = true;
        for (let i = 0; i < count; i += 1) {
          if (!clashes(picks, i)) continue;
          fixed = false;
          for (let tries = 0; tries < 30; tries += 1) {
            const j = Math.floor(Math.random() * count);
            [picks[i], picks[j]] = [picks[j], picks[i]];
            if (!clashes(picks, i) && !clashes(picks, j)) break;
            [picks[i], picks[j]] = [picks[j], picks[i]];
          }
        }
        if (fixed) break;
      }

      picks.forEach((h, i) => { this.state.positions[i] = h; });
      this.state.selected = null;
      this.el.generate.textContent = 'Shuffle again';
      this.changed();
    }

    changed() {
      this.renderAll();
      this.save();
    }

    /* ------------------------------------------------------------- rendering */

    renderAll() {
      this.renderHead();
      this.renderSizes();
      this.renderFrames();
      this.renderModes();
      this.renderGrid();
      this.renderShortlist();
      this.renderPickerTitle();
      this.renderCardsState();
      this.renderProperties();
    }

    renderHead() {
      const { size, variant } = this;
      this.el.title.textContent = size.title;
      this.el.price.textContent = variant.price;
      this.el.dims.textContent = `Frame ${size.w} x ${size.h} cm. ${size.cols} across, ${size.rows} down.`;
      this.el.variant.value = variant.id;
    }

    renderSizes() {
      const list = this.el.sizesList;
      if (!list.childElementCount) {
        this.sizes.forEach((size) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'mb__pill';
          button.setAttribute('role', 'radio');
          button.dataset.size = size.id;
          button.innerHTML = '<strong></strong><span></span>';
          button.querySelector('strong').textContent = size.count;
          button.querySelector('span').textContent = `${size.cols} x ${size.rows}`;
          button.addEventListener('click', () => this.setSize(size.id));
          list.append(button);
        });
      }
      list.querySelectorAll('[data-size]').forEach((button) => {
        button.setAttribute('aria-checked', String(Number(button.dataset.size) === this.state.sizeId));
      });
    }

    renderFrames() {
      const frames = this.size.variants
        .map((v) => v.frame)
        .sort((a, b) => FRAME_ORDER.indexOf(a) - FRAME_ORDER.indexOf(b));
      if (!frames.includes(this.state.frame)) this.state.frame = this.variant.frame;

      const wrap = this.el.frames;
      if (wrap.dataset.built !== frames.join('|')) {
        wrap.replaceChildren();
        frames.forEach((frame) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'mb__swatch';
          button.setAttribute('role', 'radio');
          button.dataset.frameOption = frame;
          button.dataset.frame = frame;
          button.setAttribute('aria-label', frame);
          button.title = frame;
          button.addEventListener('click', () => this.setFrame(frame));
          wrap.append(button);
        });
        wrap.dataset.built = frames.join('|');
      }
      wrap.querySelectorAll('[data-frame-option]').forEach((button) => {
        button.setAttribute('aria-checked', String(button.dataset.frameOption === this.state.frame));
      });
      this.el.frameName.textContent = this.state.frame;
      this.el.frame.dataset.frame = this.state.frame;
    }

    renderModes() {
      const { mode } = this.state;
      this.dataset.mode = mode;
      this.querySelectorAll('[data-mb-mode]').forEach((button) => {
        button.setAttribute('aria-selected', String(button.dataset.mbMode === mode));
      });
      this.querySelectorAll('[data-mb-help]').forEach((help) => {
        help.hidden = help.dataset.mbHelp !== mode;
      });
      this.el.studioFill.checked = this.state.studioFill;
      if (this.el.notes.value !== this.state.notes) this.el.notes.value = this.state.notes;
      this.el.generate.disabled = !this.state.shortlist.length;
    }

    renderGrid() {
      const { size } = this;
      const { mode, selected } = this.state;
      const grid = this.el.grid;

      this.el.frame.style.setProperty('--mb-ratio', `${size.w} / ${size.h}`);
      grid.style.setProperty('--mb-cols', size.cols);
      grid.style.setProperty('--mb-rows', size.rows);
      grid.dataset.count = size.count;

      while (grid.childElementCount > size.count) grid.lastElementChild.remove();
      while (grid.childElementCount < size.count) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'mb__cell';
        cell.dataset.index = grid.childElementCount;
        cell.innerHTML = '<span class="mb__cell-num"></span><img alt="" draggable="false" hidden>';
        grid.append(cell);
      }

      Array.from(grid.children).forEach((cell, i) => {
        const handle = mode === 'studio' ? null : this.state.positions[i];
        const item = handle ? this.byHandle.get(handle) : null;
        const img = cell.querySelector('img');
        cell.querySelector('.mb__cell-num').textContent = i + 1;
        cell.classList.toggle('is-filled', Boolean(handle));
        cell.classList.toggle('is-selected', selected === i);
        cell.draggable = Boolean(handle) && mode !== 'studio';
        if (item) {
          if (img.getAttribute('src') !== item.a) img.src = item.a;
          img.hidden = false;
        } else {
          img.hidden = true;
          img.removeAttribute('src');
        }
        const label = item ? titleCase(item.t) : (handle ? 'Loading' : 'Empty');
        cell.setAttribute('aria-label', `Position ${i + 1}: ${label}`);
        cell.setAttribute('aria-pressed', String(selected === i));
      });

      const filled = this.activePositions.filter(Boolean).length;
      let note = '';
      if (mode === 'studio') {
        note = `The studio will compose all ${size.count} artworks for you.`;
      } else if (filled === size.count) {
        note = 'Your frame is complete. Select any position to change it, or drag to swap.';
      } else if (selected !== null) {
        note = `Position ${selected + 1} selected. Now choose an artwork below.`;
      } else {
        note = `${filled} of ${size.count} positions filled.`;
      }
      this.el.stageNote.textContent = note;
      this.el.clearCell.hidden = selected === null || !this.state.positions[selected] || mode === 'studio';
      this.el.clearAll.hidden = filled === 0 || mode === 'studio';
    }

    renderShortlist() {
      const list = this.state.shortlist;
      this.el.shortlistWrap.hidden = !list.length;
      this.el.shortlistCount.textContent = `(${list.length})`;
      this.el.shortlist.replaceChildren(...list.map((handle) => {
        const item = this.byHandle.get(handle);
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mb__chip is-on';
        button.dataset.unstar = handle;
        button.textContent = item ? titleCase(item.t) : handle;
        button.setAttribute('aria-label', `Remove ${button.textContent} from shortlist`);
        li.append(button);
        return li;
      }));
    }

    renderPickerTitle() {
      const { mode, selected } = this.state;
      let title = 'Choose an artwork';
      if (selected !== null) title = `Choose an artwork for position ${selected + 1}`;
      else if (mode === 'arrange') title = 'Star your favourites';
      else if (mode === 'studio') title = 'Star any you would like included';
      this.el.pickerTitle.textContent = title;
    }

    revealPicker() {
      if (window.matchMedia('(min-width: 990px)').matches) return;
      const top = this.el.picker.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.6) this.el.picker.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ----------------------------------------------------------- properties */

    problem() {
      const { mode, studioFill } = this.state;
      if (!this.variant.available) return 'This frame colour is not available at the moment.';
      if (mode === 'studio') return '';
      const empty = this.activePositions.filter((h) => !h).length;
      if (!empty || studioFill) return '';
      if (mode === 'arrange' && empty === this.size.count) return 'Star a few favourites and arrange your frame first.';
      return `${empty} ${empty === 1 ? 'position is' : 'positions are'} still empty. Fill ${empty === 1 ? 'it' : 'them'}, or let the studio fill the rest.`;
    }

    renderProperties() {
      const { size, variant } = this;
      const { mode, shortlist, notes, studioFill } = this.state;
      const props = [];
      const nameOf = (handle) => {
        const item = this.byHandle.get(handle);
        return item ? titleCase(item.t) : handle;
      };

      const positions = this.activePositions;
      const empty = positions.filter((h) => !h).length;

      let arrangement = MODE_LABELS[mode];
      if (mode !== 'studio' && empty && studioFill) {
        arrangement = empty === size.count ? MODE_LABELS.studio : `${arrangement}, studio to fill ${empty}`;
      }
      props.push(['Arrangement', arrangement]);

      if (mode !== 'studio') {
        const prefix = this.showPositions ? '' : '_';
        positions.forEach((handle, i) => {
          props.push([`${prefix}Position ${pad(i + 1)}`, handle ? nameOf(handle) : "Studio's choice"]);
        });
      }
      if (mode === 'studio' && shortlist.length) {
        props.push(['Include if possible', shortlist.map(nameOf).join(', ')]);
      }
      if (mode === 'studio' && notes.trim()) {
        props.push(['Notes for the studio', notes.trim()]);
      }

      const spec = [
        'v1',
        `size=${size.count}`,
        `grid=${size.cols}x${size.rows}`,
        `frame=${variant.frame}`,
        `mode=${mode}`
      ];
      if (mode !== 'studio') {
        if (empty && studioFill) spec.push('fill=studio');
        spec.push(`p=${positions.map((h) => h || '-').join(',')}`);
      }
      if (shortlist.length && mode !== 'pick') spec.push(`s=${shortlist.join(',')}`);
      props.push(['_spec', spec.join(';')]);

      this.el.properties.replaceChildren(...props.map(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `properties[${name}]`;
        input.value = value;
        return input;
      }));

      const problem = this.problem();
      this.el.submit.classList.toggle('is-blocked', Boolean(problem));
      this.el.status.classList.remove('is-error');
      this.el.status.textContent = problem;
    }

    /* ------------------------------------------------------------ catalogue */

    async loadCatalogue() {
      const base = this.dataset.feedUrl;
      const pageUrl = (page) => {
        const url = new URL(base, window.location.origin);
        url.searchParams.set('view', 'miniart');
        url.searchParams.set('page', String(page));
        const theme = window.Shopify && window.Shopify.theme;
        if (theme && theme.role && theme.role !== 'main') url.searchParams.set('preview_theme_id', theme.id);
        return url.toString();
      };
      const get = (page) => fetch(pageUrl(page), { credentials: 'same-origin' }).then((response) => {
        if (!response.ok) throw new Error(`Catalogue page ${page}: ${response.status}`);
        return response.json();
      });

      try {
        /* Two pages cover today's catalogue; ask for both at once, then any others in one wave. */
        const first = await Promise.all([get(1), get(2)]);
        const total = Number(first[0].pages) || 1;
        const rest = [];
        for (let page = 3; page <= total; page += 1) rest.push(get(page));
        const pages = first.slice(0, total).concat(await Promise.all(rest));

        pages.forEach((page) => (page.items || []).forEach((item) => {
          if (this.byHandle.has(item.h)) return;
          item.n = normalize(`${item.t} ${item.s || ''}`);
          this.byHandle.set(item.h, item);
          this.catalogue.push(item);
        }));
        this.catalogue.sort((a, b) => a.t.localeCompare(b.t));

        /* Picks saved from an earlier visit may no longer exist. */
        this.state.positions = this.state.positions.map((h) => (h && this.byHandle.has(h) ? h : null));
        this.state.shortlist = this.state.shortlist.filter((h) => this.byHandle.has(h));
        if (this.state.mode === 'pick' && this.state.selected === null) this.state.selected = this.nextEmpty(-1);

        this.renderCards();
        this.renderColours();
        this.changed();
      } catch (error) {
        console.error('Miniatures builder:', error);
        this.el.pickerStatus.textContent = 'The artworks could not be loaded. Please refresh the page.';
      }
    }

    renderColours() {
      const present = new Set();
      this.catalogue.forEach((item) => (item.c || []).forEach((c) => present.add(c)));
      const colours = COLOUR_ORDER.filter((c) => present.has(c));
      const make = (label, key, value) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mb__chip';
        button.dataset[key] = value;
        if (key === 'colour' && value) {
          const dot = document.createElement('i');
          dot.className = 'mb__dot';
          dot.dataset.colour = value;
          button.append(dot);
        }
        button.append(document.createTextNode(label));
        return button;
      };
      const chips = [make('All', 'colour', '')]
        .concat(colours.map((c) => make(c, 'colour', c)))
        .concat([make('Starred', 'starred', '1')]);
      this.el.colours.replaceChildren(...chips);
      this.el.colours.addEventListener('click', (event) => {
        const chip = event.target.closest('button');
        if (!chip) return;
        if (chip.dataset.starred) this.filter.starred = !this.filter.starred;
        else this.filter.colour = chip.dataset.colour;
        this.applyFilter();
      });
      this.applyFilter();
    }

    renderCards() {
      const fragment = document.createDocumentFragment();
      this.cards = new Map();
      this.catalogue.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'mb__card-wrap';

        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'mb__card';
        card.dataset.handle = item.h;

        const frame = document.createElement('span');
        frame.className = 'mb__card-art';
        const img = document.createElement('img');
        img.src = item.a;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        frame.append(img);

        const name = document.createElement('span');
        name.className = 'mb__card-name';
        name.textContent = titleCase(item.t);

        const used = document.createElement('span');
        used.className = 'mb__card-used';

        card.append(frame, name, used);

        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'mb__star';
        star.dataset.star = item.h;
        star.setAttribute('aria-label', `Star ${titleCase(item.t)}`);
        star.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>';

        li.append(card, star);
        fragment.append(li);
        this.cards.set(item.h, { li, star, used });
      });
      this.el.cards.replaceChildren(fragment);
    }

    renderCardsState() {
      if (!this.cards) return;
      const counts = new Map();
      if (this.state.mode !== 'studio') {
        this.activePositions.forEach((h) => { if (h) counts.set(h, (counts.get(h) || 0) + 1); });
      }
      const starred = new Set(this.state.shortlist);
      this.cards.forEach(({ li, star, used }, handle) => {
        const n = counts.get(handle) || 0;
        used.textContent = n ? (n > 1 ? `In frame x${n}` : 'In frame') : '';
        li.classList.toggle('is-used', n > 0);
        star.setAttribute('aria-pressed', String(starred.has(handle)));
      });
      if (this.filter.starred) this.applyFilter();
    }

    applyFilter() {
      const { text, colour, starred } = this.filter;
      const terms = text.split(/\s+/).filter(Boolean);
      const shortlist = new Set(this.state.shortlist);
      let shown = 0;
      this.catalogue.forEach((item) => {
        const visible = (!colour || (item.c || []).includes(colour))
          && (!starred || shortlist.has(item.h))
          && terms.every((term) => item.n.includes(term));
        this.cards.get(item.h).li.hidden = !visible;
        if (visible) shown += 1;
      });
      this.el.colours.querySelectorAll('button').forEach((chip) => {
        const on = chip.dataset.starred ? starred : chip.dataset.colour === colour;
        chip.classList.toggle('is-on', on);
        chip.setAttribute('aria-pressed', String(on));
      });
      this.el.pickerStatus.textContent = shown
        ? `${shown} ${shown === 1 ? 'artwork' : 'artworks'}`
        : (starred && !shortlist.size ? 'Nothing starred yet. Tap the star on any artwork.' : 'No artworks match. Try another search.');
    }
  }

  customElements.define('miniatures-builder', MiniaturesBuilder);
}
