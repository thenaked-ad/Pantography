if (!customElements.get('collection-product-search')) {
  class CollectionProductSearch extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('.collection-search__input');
      this.form = this.querySelector('.collection-search__form');
      this.status = this.querySelector('[data-search-status]');
      this.results = this.querySelector('[data-search-results]');
      this.minimumCharacters = Number(this.dataset.minCharacters) || 2;
      this.indexFallback = this.dataset.indexFallback === 'true';
      this.indexView = this.dataset.indexView || 'rank';
      this.indexMax = Number(this.dataset.indexMax) || 48;
      this.products = [];
      this.searchRequest = 0;

      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.runSearch();
      });

      this.input.addEventListener('input', () => {
        window.clearTimeout(this.searchTimer);
        this.searchTimer = window.setTimeout(() => this.runSearch(), 180);
      });
    }

    disconnectedCallback() {
      this.toggleOriginalGrid(false);
    }

    normalize(value) {
      return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .trim();
    }

    message(template, count) {
      return String(template || '').replace('[count]', count);
    }

    setStatus(message) {
      this.status.textContent = message;
    }

    toggleOriginalGrid(shouldHide) {
      if (this.dataset.replaceOriginalGrid !== 'true') return;

      let elements = [];
      try {
        elements = document.querySelectorAll(this.dataset.originalGridSelector);
      } catch (error) {
        console.error('Collection search: invalid original grid selector.', error);
        return;
      }

      elements.forEach((element) => {
        if (shouldHide && !element.hasAttribute('data-collection-search-was-hidden')) {
          element.setAttribute('data-collection-search-was-hidden', String(element.hidden));
          element.hidden = true;
        } else if (!shouldHide && element.hasAttribute('data-collection-search-was-hidden')) {
          element.hidden = element.getAttribute('data-collection-search-was-hidden') === 'true';
          element.removeAttribute('data-collection-search-was-hidden');
        }
      });
    }

    async loadProducts() {
      if (this.loadingPromise) return this.loadingPromise;

      this.loadingPromise = (async () => {
        const seedNode = this.querySelector('[data-collection-search-page]');
        const seed = JSON.parse(seedNode.textContent);
        const productsById = new Map(seed.products.map((product) => [String(product.id), product]));
        const requests = [];

        for (let page = 1; page <= seed.pages; page += 1) {
          if (page === seed.page) continue;

          const url = new URL(this.dataset.collectionUrl, window.location.origin);
          url.searchParams.set('section_id', this.dataset.sectionId);
          url.searchParams.set('page', String(page));
          requests.push(fetch(url.toString(), { credentials: 'same-origin' }));
        }

        const responses = await Promise.all(requests);
        const failedResponse = responses.find((response) => !response.ok);
        if (failedResponse) throw new Error(`Collection page request failed: ${failedResponse.status}`);

        const pages = await Promise.all(responses.map((response) => response.text()));
        pages.forEach((html) => {
          const documentFragment = new DOMParser().parseFromString(html, 'text/html');
          const dataNode = documentFragment.querySelector('[data-collection-search-page]');
          if (!dataNode) throw new Error('Collection search data was not returned.');

          const pageData = JSON.parse(dataNode.textContent);
          pageData.products.forEach((product) => productsById.set(String(product.id), product));
        });

        this.products = Array.from(productsById.values());
      })();

      return this.loadingPromise;
    }

    /* Shopify's own ranking for the term, narrowed to this collection.
       Used only when the term matches nothing in the collection's text. */
    async rankedMatches(query) {
      const productsById = new Map(this.products.map((product) => [String(product.id), product]));
      const picked = [];
      const seen = new Set();

      for (let page = 1; page <= 3; page += 1) {
        const url = new URL('/search', window.location.origin);
        url.searchParams.set('q', query);
        url.searchParams.set('type', 'product');
        url.searchParams.set('view', this.indexView);
        url.searchParams.set('page', String(page));

        const response = await fetch(url.toString(), { credentials: 'same-origin' });
        if (!response.ok) break;

        let data;
        try {
          data = JSON.parse(await response.text());
        } catch (error) {
          console.error('Collection search: relevance feed did not return JSON.', error);
          break;
        }

        (data.ids || []).forEach((id) => {
          const key = String(id);
          if (seen.has(key)) return;
          seen.add(key);
          const product = productsById.get(key);
          if (product) picked.push(product);
        });

        if (picked.length >= this.indexMax) break;
        if (data.pages && page >= data.pages) break;
      }

      return picked.slice(0, this.indexMax);
    }

    async runSearch() {
      const requestId = ++this.searchRequest;
      const query = this.normalize(this.input.value);

      if (query.length < this.minimumCharacters) {
        this.toggleOriginalGrid(false);
        this.results.replaceChildren();
        this.results.hidden = true;
        this.setStatus(
          query.length === 0
            ? ''
            : this.message(this.dataset.promptText, this.minimumCharacters)
        );
        return;
      }

      this.toggleOriginalGrid(true);
      this.setStatus(this.dataset.loadingText);

      try {
        await this.loadProducts();
        if (requestId !== this.searchRequest) return;

        const terms = query.split(/\s+/).filter(Boolean);
        const matches = this.products
          .filter((product) => {
            const searchableText = this.normalize(product.search);
            return terms.every((term) => searchableText.includes(term));
          })
          .sort((productA, productB) => {
            const titleA = this.normalize(productA.title);
            const titleB = this.normalize(productB.title);
            const scoreA = titleA.startsWith(query) ? 0 : titleA.includes(query) ? 1 : 2;
            const scoreB = titleB.startsWith(query) ? 0 : titleB.includes(query) ? 1 : 2;
            return scoreA - scoreB || titleA.localeCompare(titleB);
          });

        if (matches.length > 0 || !this.indexFallback) {
          this.renderResults(matches);
          return;
        }

        const ranked = await this.rankedMatches(this.input.value.trim());
        if (requestId !== this.searchRequest) return;

        const rankedStatus = this.message(this.dataset.indexText, ranked.length)
          .replace('[term]', this.input.value.trim());
        this.renderResults(ranked, rankedStatus);
      } catch (error) {
        if (requestId !== this.searchRequest) return;
        this.results.replaceChildren();
        this.results.hidden = true;
        this.toggleOriginalGrid(false);
        this.setStatus(this.dataset.errorText);
        console.error('Collection search:', error);
      }
    }

    renderResults(products, statusOverride) {
      this.results.replaceChildren();

      if (products.length === 0) {
        this.results.hidden = true;
        this.setStatus(this.dataset.noResultsText);
        return;
      }

      const fragment = document.createDocumentFragment();
      products.forEach((product) => fragment.append(this.createCard(product)));
      this.results.append(fragment);
      this.results.hidden = false;
      this.setStatus(
        statusOverride
          ? statusOverride
          : products.length === 1
            ? this.dataset.oneResultText
            : this.message(this.dataset.manyResultsText, products.length)
      );
    }

    createCard(product) {
      const article = document.createElement('article');
      article.className = 'collection-search__card';

      const link = document.createElement('a');
      link.className = 'collection-search__card-link';
      link.href = product.url;

      if (product.image) {
        const imageWrap = document.createElement('span');
        imageWrap.className = 'collection-search__image-wrap';

        const image = document.createElement('img');
        image.className = 'collection-search__image';
        image.src = product.image;
        image.alt = product.image_alt || product.title;
        image.loading = 'lazy';
        image.width = 720;
        image.height = 720;
        imageWrap.append(image);
        link.append(imageWrap);
      }

      const body = document.createElement('span');
      body.className = 'collection-search__card-body';

      if (this.dataset.showVendor === 'true' && product.vendor) {
        const vendor = document.createElement('span');
        vendor.className = 'collection-search__vendor';
        vendor.textContent = product.vendor;
        body.append(vendor);
      }

      const title = document.createElement('span');
      title.className = 'collection-search__product-title';
      title.textContent = product.title;
      body.append(title);

      if (this.dataset.showPrice === 'true' && product.price) {
        const price = document.createElement('span');
        price.className = 'collection-search__price';
        price.textContent = product.price;
        body.append(price);
      }

      link.append(body);
      article.append(link);
      return article;
    }
  }

  customElements.define('collection-product-search', CollectionProductSearch);
}
