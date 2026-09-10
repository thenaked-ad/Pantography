document.addEventListener('shopify:section:load', function (event) {
  var section = event.srcElement;
  console.log('section load:', section);
  if (Shopify.visualPreviewMode && section.closest('shopify-editor') != null) {
    section.closest('shopify-editor').id = 'root';
  }
  if (event.srcElement.classList.contains('shopify-section-announcement-bar-container')) {
    window.topBar();
    window.headerAsync();
    setTimeout(function () {
      window.transparentHeader();
    }, 1);
  }
  if (event.srcElement.getElementsByClassName('l4us').length) {
    window.listUspSlider();
  }
  if (section.classList.contains('shopify-section-header')) {
    window.headerHeight();
    window.header();
    setTimeout(function () {
      window.transparentHeader();
    }, 1);
    window.navAsync();
    window.listUspHeaderAsync();
    window.navUserAsync();
    window.modulePanelAsync();
    window.liveSearchAsync();
    window.popupsAsync();
    window.linkMoreAsync();
    window.headerAsync();
    ajaxCart.init();
    isDelayedCssVars = false;
    window.delayedCssVars();
    window.darkMode();
  }
  if (section.classList.contains('shopify-section-footer')) {
    window.footer();
  }
  if (
    section.classList.contains('recently-viewed-products') ||
    event.srcElement.getElementsByClassName('recently-viewed-products').length
  ) {
    window.recentlyViewedProducts();
  }
  if (event.srcElement.getElementsByClassName('m6fr').length) {
    window.moduleFeaturedSlider();
    window.lazyVideo();
    setTimeout(function () {
      window.transparentHeader();
    }, 1);
  }
  if (event.srcElement.getElementsByClassName('m6pr').length) {
    updateSlidersAsync();
    window.listProductSlider();
    window.modulePanelAsync();
    window.moduleLimitAsync();
    window.linkMoreAsync();
    window.productVariantsAsync();
    window.semanticSelectAsync();
    window.semanticInputAsync();
    window.productPageDrawers();
    window.ratings();
    window.listDropAsync();
    window.showHideDataElementAsync();
    window.sellingplansAsync();
    window.pickupAvailabilityAsync();
    window.formZindex();
    window.fancyboxAsync();
    window.dataChangeAscync();
    window.schemeTooltipAsync();
    window.popupsAsync();
    window.rangeSliderAsync();
    window.stickyAddtoCartAsync();
    window.recommendedProductsAsync();
    window.initializeTabs();
  }
  if (event.detail.sectionId.endsWith('sticky-add-to-cart')) {
    window.stickyAddtoCartAsync();
  }
  if (section.getElementsByClassName('m6fr').length) {
    setTimeout(function () {
      window.transparentHeader();
    }, 1);
  }
  if (section.getElementsByClassName('m6tm').length) {
    window.moduleTabsMobileAsync();
  }
  if (section.getElementsByClassName('next-video').length) {
    window.lazyVideo();
    window.muteVideo();
    window.embeddedVideo();
  }
  if (event.srcElement.querySelector('.l4cl.slider') != null) {
    window.listCollectionSlider();
  }
  if (event.srcElement.querySelector('.l4st') != null) {
    window.listStaticSlider();
  }
  if (event.srcElement.querySelector('.l4cl') != null) {
    window.checkLimit();
    window.ratings();
    window.listScrollableAsync();
    quickShop.init();
  }
  if (event.srcElement.querySelector('.l4ft') != null) {
    window.lazyVideo();
  }
  if (event.srcElement.querySelector('.l4ts') != null) {
    window.listTestimonialsSlider();
    window.ratings();
  }
  if (event.detail.sectionId.endsWith('main-collection') || event.detail.sectionId.endsWith('main-search')) {
    window.gridListSwitchAsync();
    window.initFiltersAsync();
    window.rangeSliderAsync();
    window.collectionSortAsync();
    window.collectionLoadMoreAsync();
    window.formFilterAsync();
    window.linkMoreAsync();
    window.moduleLimitAsync();
    window.modulePanelAsync();
    window.semanticSelectAsync();
    window.lazyVideo();
    window.productPageDrawers();
    window.moduleTabsMobileAsync();
  }
  if (event.srcElement.getElementsByClassName('product-recommendations').length) {
    setTimeout(function () {
      window.recommendedProductsAsync();
    }, 50);
  }
  if (event.srcElement.getElementsByClassName('f8vl').length) {
    window.accordionAsync();
    window.accordionLabelAsync();
    window.semanticInputAsync();
    window.listAlertsAsync();
    ajaxCart.init();
  }
  if (section.getElementsByClassName('countdown-container').length) {
    window.countdownAsync();
  }
  if (section.querySelector('.input-show > label') != null) {
    // window.inputShowAsync();
  }
  if (section.querySelector('.s1tt') != null) {
    window.schemeTooltipAsync();
  }
  if (section.querySelector('a[data-copy]') != null) {
    window.linkCopyAsync();
  }
  if (section.querySelector('select') != null) {
    window.semanticSelectAsync();
  }
  if (section.querySelector('.f8vl') != null) {
    window.formValidateAsync();
  }
  if (section.querySelector('video.lazy') != null) {
    window.lazyVideo();
  }
  if (section.querySelector("input[type='date']") != null) {
    window.inputDateAsync();
  }
  if (section.querySelector('.n6as') != null) {
    window.navAsideAsync();
  }
  if (section.querySelectorAll('[data-val][data-of]').length) {
    window.ratings();
  }
  if (
    event.detail.sectionId.endsWith('main-password') ||
    event.detail.sectionId.endsWith('main-giftcard') ||
    event.detail.sectionId.endsWith('main-404')
  ) {
    window.background();
  }
  if (event.detail.sectionId.endsWith('main-giftcard')) {
    if (document.getElementById('background')) {
      document.documentElement.classList.add('t1as');
    } else {
      document.documentElement.classList.remove('t1as');
    }
  }
  if (section.querySelector('.accordion-a > div') != null) {
    window.accordionAsync();
    Array.from(section.querySelectorAll('.accordion-a > div')).forEach(function (el) {
      el.classList.remove('open');
    });
    event.target.classList.add('open');
  }
  if (section.querySelector('.masonry') != null) {
    window.masonry();
  }
  if (section.querySelector('.media-flexible') != null) {
    setTimeout(function () {
      window.transparentHeader();
    }, 1);
    window.mediaFlexible();
  }
  if (document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').length) {
    document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').forEach(function (el) {
      el.classList.remove('toggle');
    });
  }
  if (section.querySelectorAll('[data-sal]') != null) {
    setTimeout(function () {
      window.sals();
    }, 1);
  }

  if(section.querySelector('#cart') != null) {
    handleSideCart();
    console.log('handlesidecart');
    ajaxCart.init();
    ajaxCart.load(false, true, false, true, false);
  }

  let popups = section.querySelector('article.popup-a:not([data-title^="block-popup"])');

  if (popups !== null) {
      window.popupsAsync();
      loadPopup(popups.getAttribute('data-title'));
  } else if (html_tag.classList.contains('popup-shown')) {
      // Close any open popup if a new section is selected
      let openPopups = document.querySelector('article.popup-a.shown');
      if (openPopups !== null) {
          openPopups.querySelector('.close').click();
      }
  }

});

document.addEventListener('shopify:section:reorder', function (event) {
  //   var section = document.getElementById("shopify-section-" + event.detail.sectionId);
  //   console.log("section reorder:", section);
  setTimeout(function () {
    window.transparentHeader();
  }, 1);
});

document.addEventListener('shopify:section:unload', function (event) {
  // var section = document.getElementById("shopify-section-" + event.detail.sectionId);
  var section = event.srcElement;
  console.log('section unload:', section);
  // if (section.getElementsByClassName("m6fr").length) {
  setTimeout(function () {
    window.transparentHeader();
  }, 1);
  if(section.querySelector('.m6pn') != null) {
    hidePanels();
  }
  // }
});

document.addEventListener('shopify:section:select', function (event) {
  var section = document.getElementById('shopify-section-' + event.detail.sectionId + '');

  if (document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').length) {
    document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').forEach(function (el) {
      el.classList.remove('toggle');
    });
  }

  let popups = section.querySelector('article.popup-a:not([data-title^="block-popup"])');

  if (popups !== null) {
      window.popupsAsync();
      loadPopup(popups.getAttribute('data-title'));
  } else if (html_tag.classList.contains('popup-shown')) {
      // Close any open popup if a new section is selected
      let openPopups = document.querySelector('article.popup-a.shown');
      if (openPopups !== null) {
          openPopups.querySelector('.close').click();
      }
  }
  if (section.querySelector('#cart') != null) {
    ajaxCart.init();
    ajaxCart.load(false, true, false, true, false);
  }
});

document.addEventListener('shopify:block:select', function (event) {
  var section = document.getElementById('shopify-section-' + event.detail.sectionId + '');

  if (document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').length) {
    document.querySelectorAll('.shopify-section-header #nav li.sub.toggle').forEach(function (el) {
      el.classList.remove('toggle');
    });
  }
  if (section.classList.contains('shopify-section-header') && event.srcElement.classList.contains('sub')) {
    event.srcElement.classList.add('toggle');
  }

  if (section.querySelector('.m6fr') != null) {
    var slideIndex = event.srcElement.dataset.slideIndex;
    if (slideIndex) {
      slideIndex = slideIndex - 1;
      var swiperOuter = section.querySelector('.m6fr .swiper-outer');
      if (swiperOuter) {
        swiperOuter = swiperOuter.swiper;
        if (swiperOuter != null) {
          swiperOuter.slideTo(slideIndex, 500);
        }
      }
    }
  }
  if (section.querySelector('.l4us') != null) {
    var slideIndex = event.srcElement.dataset.slideIndex;
    slideIndex = slideIndex - 1;
    var swiperOuter = section.querySelector('.l4us .swiper-outer');
    if (swiperOuter && slideIndex) {
      var swiper = swiperOuter.swiper;
      if (swiper != null) {
        swiper.slideTo(slideIndex, 500);
      }
    }
  }
  if (section.querySelector('.l4ts.slider-aside') != null) {
    var slideIndex = event.srcElement.dataset.slideIndex;
    slideIndex = slideIndex - 1;
    var swiper = section.querySelector('.l4ts .swiper-outer').swiper;
    if (swiper != null) {
      swiper.slideTo(slideIndex, 500);
      swiper.el.parentNode.setAttribute('data-index', slideIndex);
    }
  }
  if (section.querySelector('.accordion-a > div') != null) {
    window.accordionAsync();
    Array.from(section.querySelectorAll('.accordion-a > div')).forEach(function (el) {
      el.classList.remove('open');
    });
    event.target.classList.add('open');
  }
  if (section.querySelector('.m6tb') != null && event.srcElement.dataset.index) {
    window.initializeTabs();
    /*
    var tabIndex = event.srcElement.dataset.index,
      tabs = event.srcElement.closest('.m6tb'),
      active_class = 'active',
      custom_active_class = '';
    if (tabs.classList.contains('btn')) {
      active_class = 'link-btn';
    }

    if (tabs.getAttribute('data-active-class')) {
      custom_active_class = tabs.getAttribute('data-active-class');
    }
    Array.from(tabs.querySelectorAll('li[data-index], div[data-index]')).forEach(function (el) {
      el.classList.remove(active_class, custom_active_class, 'item-active');
      el.classList.add('hidden');
    });
    tabs.querySelector("li[data-index='" + tabIndex + "']").classList.add(active_class, custom_active_class);
    tabs.querySelector("div[data-index='" + tabIndex + "']").classList.remove('hidden', custom_active_class);
    */

    Array.from(tabs.querySelectorAll('li[data-index], div[data-index]')).forEach(function (el) {
      el.classList.remove(active_class);
      if (el.tagName == 'DIV') {
        el.classList.add('hidden');
      }
    });
    tabs.querySelector("li[data-index='" + tabIndex + "']").classList.add(active_class);
    tabs.querySelector("div[data-index='" + tabIndex + "']").classList.remove('hidden');
  }
});
