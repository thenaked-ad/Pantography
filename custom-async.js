/* -------------------------------------------

	Name:		Theme+
	Date:		2021/11/01

---------------------------------------------  */

var root_id = document.getElementById('root'),
	root_styles,
	header_id = document.getElementsByClassName('shopify-section-header')[0],
	header_outer = document.getElementById('header-outer'),
	header_main = document.getElementById('header'),
	header_inner = document.getElementById('header-inner'),
	footer_id = document.getElementsByClassName('shopify-section-footer')[0],
	nav_outer = document.getElementById('nav-outer'),
	nav_id = document.getElementById('nav'),
	nav_user_id = document.getElementById('nav-user'),
	nav_top_id = document.getElementById('nav-top'),
	search_id = document.getElementById('search'),
	search_input,
	totop_id = document.getElementById('totop'),
	all_list_drop = document.getElementsByClassName('l4dr'),
	ne = document.querySelectorAll('a[aria-controls="nav"]'),
	evt,
	global_dir,
	changeEvent = new Event('change'),
	updateSlidersEvt = new CustomEvent("updateSliders"),
  enable_cart_drawer = document.querySelector('.m6pn#cart'),

	readMoreText = window.translations['readmore_text'],
	unavailableText = window.translations['unavailable_text'],
	searchText = window.translations['search_text'],
	closeText = window.translations['close_text'],
	toggleText = window.translations['toggle_text'],

	form_product_sticky = document.getElementById('sticky-add-to-cart');

var a_css_announcement = window.filepaths['a_css_announcement'],
	a_css_compare = window.filepaths['a_css_compare'],
	a_css_hovers = window.filepaths['a_css_hovers'],
	a_css_fancybox = window.filepaths['a_css_fancybox'],
	a_css_marquee = window.filepaths['a_css_marquee'],
	a_css_menu = window.filepaths['a_css_menu'],
	a_css_panels = window.filepaths['a_css_panels'],
	a_css_product = window.filepaths['a_css_product'],
	a_css_popups = window.filepaths['a_css_popups'],
	a_css_print = window.filepaths['a_css_print'],
	a_css_product_scrolled = window.filepaths['a_css_product_scrolled'],
	a_css_search = window.filepaths['a_css_search'],
	a_css_select = window.filepaths['a_css_select'],
	a_css_ui_sliders = window.filepaths['a_css_ui_sliders'],
	a_css_validation = window.filepaths['a_css_validation'],
	a_css_datepicker = window.filepaths['a_css_datepicker'],
	a_js_compare = window.filepaths['a_js_compare'],
	a_js_countdown = window.filepaths['a_js_countdown'],
	a_js_fancybox = window.filepaths['a_js_fancybox'],
	a_js_masonry = window.filepaths['a_js_masonry'],
	a_js_outline = window.filepaths['a_js_outline'],
	a_js_popup = window.filepaths['a_js_popup'],
	a_js_selects = window.filepaths['a_js_selects'],
	a_js_sliders = window.filepaths['a_js_sliders'],
	a_js_typewritter = window.filepaths['a_js_typewritter'],
	a_js_validator = window.filepaths['a_js_validator'],
	a_js_datepicker = window.filepaths['a_js_datepicker'];


if (search_id) {
	search_input = search_id.querySelectorAll('input');
	if (search_id.classList.contains('text-center')) {
		html_tag.classList.add('has-search-center');
	}
}
// Move all drawers to the root element on click
var productPageDrawers = function() {
	// if element with data attribute data-panel is clicked, move the drawer
	var drawerButtons = document.querySelectorAll('.m6pr [data-panel]:not(.m6pn-moved):not(.m6pn-clicked)');
	if (drawerButtons) {
		var root = document.getElementById('root');
		drawerButtons.forEach(function (button) {
			button.addEventListener('click', function (e) {
				var panel_id = this.dataset.panel;
				var panel = document.getElementById(panel_id);
				if (panel) {
					panel.classList.add('m6pn-moved');
					panel.removeAttribute('style'); /* remove z-index styling */
					root.appendChild(panel);
				}
			});
		});
	}

	// Update drawer on changes in theme editor
	if (Shopify.designMode && html_tag.classList.contains('m6pn-open') && document.querySelector('.m6pr, .m6cl') || Shopify.designMode && html_tag.classList.contains('f8fl-open') ) {
		var openDrawer = document.querySelector('.m6pn.m6pn-initialized.toggle');
		if (openDrawer) {
			var drawerID = openDrawer.getAttribute('id');
			if (document.querySelector('.m6pr [data-panel="' + drawerID + '"], .m6cl [data-panel="' + drawerID + '"]')) {
				openDrawer.remove();
				document.querySelector('.m6pr [data-panel="' + drawerID + '"], .m6cl [data-panel="' + drawerID + '"]').click();
			} else {
				// Hide panel when there is none anymore after editing theme
				hidePanels();
				overlayClose();
			}
		} else {
			// Hide panel when there is none anymore after editing theme
			hidePanels();
			overlayClose();
		}
	}
}
productPageDrawers();

// Click event for the drawer buttons
var productPageReviewDrawer = function() {
	var reviewDrawerButtons = document.querySelectorAll('.m6pn#product-reviews .sticky-in-panel .link-btn');
	if (reviewDrawerButtons) {
		reviewDrawerButtons.forEach(function (button) {
			button.addEventListener('click', function (e) {
				var panel = this.closest('.m6pn').querySelector('.l4rv');
				if (panel) {
					panel.classList.add('hide-reviews');
				}
			});
		});
	}
}
productPageReviewDrawer();

// Get direction
if (html_tag.getAttribute('dir') === 'rtl') {
	global_dir = ['rtl', false];
} else {
	global_dir = ['ltr', true];
}

function close_dropdown(element) {
	html_tag.classList.remove('user-form-active');
	if (element.classList.contains('toggle') && !element.classList.contains('mtoggle')) {
		element.classList.remove('toggle');
		element.setAttribute('aria-expanded', false);
		return true;
	}
	return false;
}

function siblings(el) {
	if (el.parentNode === null) {
		return [];
	}

	return Array.prototype.filter.call(el.parentNode.children, function (child) {
		return child !== el;
	});
}

const mediaMax1000 = window.matchMedia('(max-width: 1000px)');
const mediaMin1000 = window.matchMedia('(min-width: 1001px)');
const mediaMin760 = window.matchMedia('(min-width: 761px)');

function close_mobile_nav() {
	html_tag.classList.remove('m2a', 'nav-hover');
	Array.from(document.querySelectorAll('a[aria-controls="nav"]')).forEach(function (el) {
		el.setAttribute('aria-expanded', false);
	});
	function updateTabIndex() {
		if (mediaMax1000.matches) {
			Array.from(document.getElementById('nav').querySelectorAll('a')).forEach(function (el) {
				el.setAttribute('tabindex', -1);
			});
		}
	}

	updateTabIndex();
	mediaMax1000.addEventListener('change', updateTabIndex);
}

function remove_active_submenus(el) {
	Array.from(el).forEach(function (el) {
		if (el.parentElement.classList.contains('toggle')) {
			el.parentElement.classList.remove('toggle');
			el.parentElement.setAttribute('aria-expanded', false);
		}
	});
}

function clear_mobile_nav() {
	if (nav_user_id) {
		remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
	}
	if (nav_id) {
		setTimeout(function () {
			Array.from(nav_id.querySelectorAll('a.toggle')).forEach(function (el) {
				if (el.parentElement.classList.contains('toggle')) {
					el.parentElement.classList.remove('toggle');
				}
			});
			if (nav_outer.hasAttribute('data-type')) {
				nav_outer.removeAttribute('data-type');
			}
			Array.from(nav_id.querySelectorAll('li.mtoggle')).forEach(function (el) {
				el.classList.remove('mtoggle');
			});
			Array.from(nav_id.querySelectorAll('ul.ul-toggle')).forEach(function (el) {
				el.classList.remove('ul-toggle');
			});
			Array.from(nav_id.getElementsByClassName('header-before')).forEach(function (el) {
				el.classList.remove('data-title-active');
			});
		}, 400);
	}
}

function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function toggle_dropdowns(el, selector) {
	var j = document.querySelectorAll(selector),
		i;
	html_tag.classList.remove('user-form-active');
	if (el.parentElement.classList.contains('toggle')) {
		el.parentElement.classList.remove('toggle');
		el.parentElement.setAttribute('aria-expanded', false);
		if (el.parentNode.classList.contains('has-form')) {
			html_tag.classList.remove('user-form-active');
		}
	} else {
		if (selector !== undefined) {
			Array.from(document.querySelectorAll(selector + ' li.toggle')).forEach(function (em) {
				em.classList.remove('toggle');
			});
		}
		if (el.parentNode.classList.contains('has-form')) {
			setTimeout(function () {
				html_tag.classList.add('user-form-active');
			}, 0);
		}
		Array.from(el.closest('ul').children).forEach(function (el) {
			el.classList.remove('toggle');
		});
		el.parentElement.classList.add('toggle');
		el.parentElement.setAttribute('aria-expanded', true);
		el.parentElement.focus(); // this will avoid page scroll down when user click with MOUSE on the element and then press space bar to toggle it
	}
}

// #nav-bar
let linkDayAdded = false;

function nav_burger(el) {
	if (!(el.parentElement.classList.contains('lang') || el.parentElement.classList.contains('currency'))) {
		clear_mobile_nav();
	}
	html_tag.classList.add('has-nav');
	Array.from(nav_id.querySelectorAll('a.toggle')).forEach(function (el) {
		el.parentElement.classList.remove('toggle');
	});
	if (nav_user_id) {
		remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
	}
	html_tag.classList.remove('nav-hover');
	if (footer_id) {
		function checkLangCurrency(footerSelector, topSelector, className) {
			const footerElement = footer_id.querySelector(footerSelector);
			const topElement = header_id.querySelector(topSelector);
			if (!footerElement && topElement) {
				html_tag.classList.add(className);
			}
		}
		checkLangCurrency('li.lang', 'li.lang.mobile-nav-only.mobile-only', 'no-footer-lang');
		checkLangCurrency('li.currency', 'li.currency.mobile-nav-only.mobile-only', 'no-footer-curr');
	}

	// Add another link-day in the top-left corner of mobile nav.
	if (!linkDayAdded) {
		const n_lday = header_id.querySelector('.link-day');
		if (n_lday) {
			const clone_day = n_lday.parentElement.cloneNode(true);
			nav_id.appendChild(clone_day);
		}
		linkDayAdded = true;
	}

	if (html_tag.classList.contains('m2a')) {
		close_mobile_nav();
	} else {
		html_tag.classList.add('m2a');
		html_tag.classList.remove('search-compact-active', 'search-full', 'user-form-active');
		if (search_id) {
			search_id.classList.remove('full', 'has-text');
		}
		setTimeout(function () {
			nav_id.querySelectorAll('li:not(.nav-bar-element) > a:not(.toggle)')[0].focus();
		}, 100);
		Array.from(ne).forEach(function (el) {
			el.setAttribute('aria-expanded', true);
		});
		function updateTabIndex() {
			if (mediaMax1000.matches) {
				Array.from(nav_id.querySelectorAll('a')).forEach(function (el) {
					el.removeAttribute('tabindex');
				});
			}
		}

		updateTabIndex();
		mediaMax1000.addEventListener('change', updateTabIndex);

		new_css('css-menu', a_css_menu);
		customDropHeight();
	}
}

function removeHasNav() {
	if (mediaMin1000.matches) {
		html_tag.classList.remove('has-nav');
	}
}

removeHasNav();
mediaMin1000.addEventListener('change', removeHasNav);

if (!isMobile && header_id) {
	header_id.addEventListener('mouseover', function () {
		new_css('css-menu', a_css_menu);
		customDropHeight();
	});
}

function checkInv(el, ratio) {
	const el_rect = el.getBoundingClientRect();
	const el_off = global_dir[1] === false ? window.innerWidth - el_rect.left - el.offsetWidth : el_rect.left;
	if (el_off > window.innerWidth * ratio) {
		el.classList.add('inv');
	} else {
		el.classList.remove('inv');
	}
}

var navAsync = function() {
	var nav_id = document.getElementById('nav'),
		nav_user_id = document.getElementById('nav-user'),
		nav_top_id = document.getElementById('nav-top'),
		header_id = document.getElementsByClassName('shopify-section-header')[0],
		root_id = document.getElementById('root'),
		aria_controls_nav,
		na,
		nc,
		nd,
		ng,
		s,
		t,
		mobile_nav_header,
		mobile_nav_header_alias = 'Menu',
		nav_user_clone,
		nav_user_cloned,
		nav_top_clone,
		nav_top_cloned,
		nav_top_img,
		nav_top_img_cloned;
	if (header_id) {
		Array.from(header_id.querySelectorAll('a.toggle')).forEach(function (el) {
			el.addEventListener('click', function () {
				new_css('css-menu', a_css_menu);
				customDropHeight();
			});
		});
	}
	if (nav_id) {
		na = document.createElement('ul');
		//nb = document.createElement('a');
		nc = nav_id.children;

		if (nc.length) {
			nd = nc[0].children;
		}
		if (typeof nd !== 'undefined') {
			const category_img = document.querySelectorAll('#nav > ul:first-child > li > a > img, #nav > ul:first-child > li > a > .img');
			category_img.forEach(el => {
				const cl = 'category-img';
				const cl_nav = el.closest('[id^="nav"]');
				if (cl_nav) {
					cl_nav.classList.add(cl);
				}
				const cl_ul = el.closest('ul');
				if (cl_ul) {
					cl_ul.classList.add(cl);
				}
			});
		}

		// If #nav-top exists, create a #nav-user for mobile menu
		if (nav_top_id) {
			const nav_top_clone = nav_top_id.querySelectorAll('ul[data-type]')[0];
			if (nav_top_clone) {
				const nav_top_cloned = nav_top_clone.cloneNode(true);
				nav_top_cloned.classList.add(nav_top_id.getAttribute('id'));
				nav_id.appendChild(nav_top_cloned);
			}
			nav_top_id.lastElementChild.classList.add('last-child');
		}

		// If #nav-user exists, create a #nav-user for mobile menu
		if (nav_user_id) {
			const nav_user_clone = nav_user_id.querySelectorAll('ul[data-type]')[0];
			if (nav_user_clone) {
				const nav_user_cloned = nav_user_clone.cloneNode(true);
				nav_user_cloned.classList.add(nav_user_id.getAttribute('id'));
				nav_id.appendChild(nav_user_cloned);
			}
		}

		// If #nav-top exists, clone the trustmark icon
		if (nav_top_id) {
			nav_top_img = nav_top_id.querySelectorAll('img')[0];
			if (nav_top_img) {
				if (nav_top_img.closest('.l4us') === null) {
					if (nav_top_img.parentElement.tagName.toLowerCase() === 'a') {
						nav_top_img = nav_top_img.parentElement;
					}
					nav_top_img_cloned = nav_top_img.cloneNode(true);
					nav_top_img_cloned.classList.add('nav-top-img');
					nav_id.appendChild(nav_top_img_cloned);
				}
			}
		}

		const nav_gallery = nav_id.getElementsByClassName('recently-viewed')[0];
		if (nav_gallery) {
			const nav_gallery_cloned = nav_gallery.cloneNode(true);
			nav_id.appendChild(nav_gallery_cloned);
		}

		// Make "show-all" clickable
		Array.from(nav_id.querySelectorAll('li.show-all > a')).forEach(function (el) {
			el.classList.add('toggle-all');
		});

		// Create a back link for mobile menu
		Array.from(document.querySelectorAll('#nav > ul > li > a.toggle')).forEach(function (el) {
			var clone_me = el.cloneNode(true);
			clone_me.classList.add('toggle-back');
			el.parentElement.append(clone_me);
			if (!el.parentNode.querySelectorAll('li > ul:first-child').length) {
				el.parentElement.classList.add('sub-classic');
			}
		});



		// Handle #nav submenus for mobile
		Array.from(nav_id.querySelectorAll('ul[data-type] > li > a.toggle, ul[data-type] > li > a.toggle-all')).forEach(function (el) {
			el.parentElement.classList.add('sub');

			function click_handler(el) {
				var mobileHeader = nav_id.getElementsByClassName('mtoggle-header')[0];
				if (nav_user_id) {
					remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
				}
				if (el.parentElement.classList.contains('toggle') || el.parentElement.classList.contains('mtoggle')) {
					el.parentElement.classList.remove('toggle', 'mtoggle');
					el.closest('ul').classList.remove('ul-toggle');
					if (el.parentElement.parentElement.getAttribute('data-type')) {
						if (nav_outer.hasAttribute('data-type')) {
							nav_outer.removeAttribute('data-type');
						}
					}
					html_tag.classList.remove('nav-hover');
				} else {
					Array.from(el.closest('ul').children).forEach(function (el) {
						el.classList.remove('toggle');
					});
					el.parentElement.classList.add('toggle', 'mtoggle');
					el.closest('ul').classList.add('ul-toggle');
					if (el.parentElement.parentElement.getAttribute('data-type')) {
						nav_outer.setAttribute('data-type', el.closest('[data-type]').getAttribute('data-type'));
						if (el.parentElement.hasAttribute('data-title')) {
							mobileHeader.innerHTML = el.parentElement.getAttribute('data-title');
						} else {
							mobileHeader.innerHTML = el.parentElement.querySelectorAll('a:not(.toggle)')[0].innerText;
						}
					}
					html_tag.classList.add('nav-hover');
				}
				if (nav_id.querySelectorAll('.ul-toggle').length === 0) {
					nav_id.removeAttribute('data-type');
				}
			}
			el.addEventListener('click', function (e) {
				click_handler(el);
				e.preventDefault();
			});
			el.addEventListener('keyup', function (e) {
				if (e.key === ' ') {
					click_handler(el);
					e.preventDefault();
				}
			});
		});
		Array.from(nav_id.querySelectorAll('ul ul > li > a.toggle')).forEach(function (el) {
			el.parentElement.classList.add('sub');

			function click_handler(el) {
				if (el.parentElement.classList.contains('toggle')) {
					el.parentElement.classList.remove('toggle', 'mtoggle');
					el.closest('ul').classList.remove('ul-toggle');
				} else {
					Array.from(el.closest('ul').children).forEach(function (el) {
						el.classList.remove('toggle');
					});
					el.parentElement.classList.add('toggle', 'mtoggle');
					el.closest('ul').classList.add('ul-toggle');
				}
			}
			el.addEventListener('click', function (e) {
				click_handler(el);
				e.preventDefault();
			});
			el.addEventListener('keyup', function (e) {
				if (e.key === ' ') {
					click_handler(el);
					e.preventDefault();
				}
			});
		});

		if (nd !== undefined) {
			Array.from(nd).forEach(function (el, index) {
				el.setAttribute('data-index', nd.length - index);
				if (el.classList.contains('sub-static')) {
					checkInv(el, 0.4);
					window.addEventListener('resize', throttle(() => {
						checkInv(el, 0.4);
					}, 500));
				}
			});
		}


		append_url(nav_id, closeText, 'close');
		Array.from(nav_id.getElementsByClassName('close')).forEach(function (el) {
			el.setAttribute('aria-controls', 'nav');
		});

		if (!isMobile && nd !== undefined) {
			Array.from(nd).forEach(function (el) {
				el.addEventListener('mouseover', function (e) {
					remove_active_submenus(nav_id.querySelectorAll('a.toggle'));
					if (el.classList.contains('sub') || el.classList.contains('show-all')) {
						html_tag.classList.add('nav-hover');
					} else {
						html_tag.classList.remove('nav-hover');
					}
				});
				el.addEventListener('mouseleave', function (e) {
					html_tag.classList.remove('nav-hover');
				});
			});
		}

		// #nav submenu
		let mobile_nav_header_alias = 'Menu';
		if (nav_id.hasAttribute('aria-label')) {
			mobile_nav_header_alias = nav_id.getAttribute('aria-label');
		}
		const mobile_nav_header = createElementWithClass('div', 'header');
		//mobile_nav_header.innerHTML = '<span>' + mobile_nav_header_alias + '</span><span class="mtoggle-header"></span>';
		const span1 = document.createElement('span');
		span1.textContent = mobile_nav_header_alias;

		const span2 = document.createElement('span');
		span2.classList.add('mtoggle-header');

		mobile_nav_header.appendChild(span1);
		mobile_nav_header.appendChild(span2);

		nav_id.prepend(mobile_nav_header);

		const aria_controls_nav = document.querySelectorAll('a[aria-controls="nav"]');
		// #nav burger
		if (aria_controls_nav) {
			Array.from(aria_controls_nav).forEach(function (el) {
				el.addEventListener('click', function (e) {
					nav_burger(el);
					e.preventDefault();
				});
				el.addEventListener('keyup', function (e) {
					if (e.key === ' ') {
						nav_burger(el);
						e.preventDefault();
					}
				});
			});
		}
	}
}
navAsync();

function linkSmallPopup(em) {
	requestAnimationFrame(() => {
		const inner = em.querySelector('.inner');
		const innerText = em.querySelector('.inner-text');

		if (inner && innerText) {
			if (inner.clientWidth < innerText.clientWidth) {
				em.classList.add('longer');
			} else {
				em.classList.remove('longer');
			}
		}
	});
}

var listUspHeaderAsync = function() {
	header_id = document.getElementsByClassName('shopify-section-header')[0];
	if (header_id) {
		var list_usp_header = header_id.getElementsByClassName('l4us');
		if (list_usp_header.length) {
			Array.from(list_usp_header).forEach(function (el, in1) {
				Array.from(el.querySelectorAll('li, .li')).forEach(function (em, in2) {
					linkSmallPopup(em);
					window.addEventListener('resize', throttle(() => {
						linkSmallPopup(em);
					}, 500));
				});
			});
		}
	}
}
listUspHeaderAsync();

var navUserAsync = function() {
// #nav-user
	var nav_id = document.getElementById('nav'),
		nav_user_id = document.getElementById('nav-user');
	if (nav_user_id) {
		// Handle #nav-user submenus
		Array.from(nav_user_id.querySelectorAll('a.toggle')).forEach(function (el) {

			function click_handler(el) {
				close_mobile_nav();
				if (nav_id) {
					remove_active_submenus(nav_id.querySelectorAll('a.toggle'));
				}
				toggle_dropdowns(el);
			}

			el.addEventListener('click', function (e) {
				click_handler(el);
				e.preventDefault();
			});
			el.addEventListener('keyup', function (e) {
				if (e.key === ' ') {
					click_handler(el);
					e.preventDefault();
				}
			});
			if (!isMobile && el.nextElementSibling !== null) {
				el.nextElementSibling.addEventListener('mouseleave', function () {
					close_dropdown(el.parentElement);
				});
			}
		});

		// If #nav & .shopify-section-footer exists, create a contact module for mobile menu
		if (footer_id && nav_id) {
			var f_lang = footer_id.querySelectorAll('li.lang a[aria-controls="nav"], li.currency a[aria-controls="nav"]'),
				f_anch;
			if (f_lang.length) {
				Array.from(f_lang).forEach(function (el) {
					el.addEventListener('click', function (e) {
						var nv_cl;
						if (el.closest('li').classList.contains('lang')) {
							nv_cl = nav_id.querySelectorAll('.lang > a.toggle:not(.toggle-back)')[0];
						} else {
							nv_cl = nav_id.querySelectorAll('.currency > a.toggle:not(.toggle-back)')[0];
						}
						nv_cl.click();
						setTimeout(function () {
							nv_cl.focus();
						}, 100);
						e.preventDefault();
					});
				});
			}
		}
	}
}
navUserAsync();

if (nav_id) {
	// Mobile nav to be keyboard accessible only on mobile devices
	function navTabIndex() {
		if (mediaMax1000.matches) {
			Array.from(nav_id.querySelectorAll('a')).forEach(function (el) {
				el.setAttribute('tabindex', -1);
			});
		} else {
			Array.from(nav_id.querySelectorAll('a')).forEach(function (el) {
				el.removeAttribute('tabindex');
			});
		}
	}

	navTabIndex();
	mediaMax1000.addEventListener('change', navTabIndex);
}

// Add Toggleable functionality to all ".l4dr" elements
var listDropAsync = function() {
	all_list_drop = document.querySelectorAll('.l4dr');
	Array.from(all_list_drop).forEach(function (element) {
		Array.from(element.querySelectorAll('a.toggle')).forEach(function (el) {
			function click_handler(el) {
				toggle_dropdowns(el, '.l4dr');
				new_css('css-menu', a_css_menu);
				customDropHeight();
			}

			el.addEventListener('click', function (e) {
				click_handler(el);
				e.preventDefault();
			});
			el.addEventListener('keyup', function (e) {
				if (e.key === ' ') {
					click_handler(el);
					e.preventDefault();
				}
			});
			if (!isMobile) {
				el.nextElementSibling.addEventListener('mouseleave', function () {
					close_dropdown(el.parentElement);
				});
			}
		});
	});
}
listDropAsync();

document.onclick = function (evt) {
	evt = evt || window.event;
	var clicked_element = evt.target,
		all_aria_expanded = document.querySelectorAll('[aria-expanded="true"]'),
		el_aria_expanded,
		closest_link;
	// if there's no dropdown open, do nothing
	if (all_aria_expanded.length === 0) {
		return;
	}

	// loop through all opened dropdowns and check if click was inside/outside of it to determine if keeps opened or not
	// it will keeps opened only if click in an inside element that's not a children of a clickable link
	for (el_aria_expanded of all_aria_expanded) {
		if (el_aria_expanded === clicked_element) {
			continue;
		}
		// .contains() will check if clicked_element belongs to el_aria_expanded
		// and if belongs to, don't do anything (leave dropdown opened)
		if (el_aria_expanded.contains(clicked_element)) {
			// close dropdown when clicked in any of the links <a> present in dropdown
			closest_link = clicked_element.closest("a:not(.toggle, .show)");
			if (closest_link && closest_link.contains(clicked_element)) {
				close_dropdown(el_aria_expanded);
			}
			continue;
		}

		close_dropdown(el_aria_expanded);
	}
};


/////////////////////////////////////

function aria_hide(el) {
	el.setAttribute('aria-hidden', true);
	el.setAttribute('focusable', false);
}

function aria_show(el) {
	el.setAttribute('aria-hidden', false);
	el.setAttribute('focusable', true);
}

function getSiblings(el) {
	return Array.from(el.parentNode.children).filter(function (sibling) {
		return sibling !== el;
	});
}

// check if string ends with any of array suffixes
function endsWithAny(suffixes, string) {

	for (let suffix of suffixes) {
		if (string.endsWith(suffix))
			return true;
	}
	return false;
}

let asyncCSSCalled = false;

function asyncCSS() {
	if (asyncCSSCalled) return;
	asyncCSSCalled = true;
	delayedCssVars();
	new_css('hovers-css', a_css_hovers);
	loadRes(a_js_outline, null);
}

if (!isMobile) {
	document.addEventListener('mouseover', asyncCSS, {
		once: true
	});
}

document.addEventListener('keyup', asyncCSS, {
	once: true
});
document.addEventListener('touchstart', asyncCSS, {
	once: true
});
document.addEventListener('scroll', asyncCSS, {
	once: true
});

// Assign aria elements to the #skip links
var skip_id = document.getElementById('skip');
if (skip_id) {
	Array.from(skip_id.querySelectorAll('a')).forEach(function (el) {
		el.addEventListener('focus', function () {
			this.setAttribute('aria-hidden', false);
		});
		el.addEventListener('blur', function () {
			this.setAttribute('aria-hidden', true);
		});
	});
}


// Form validation
function validate_me(el) {
	loadRes(a_js_validator, function () {
		if (typeof Validator === 'function') {
			Array.from(el.querySelectorAll('button .processing, button .processed')).forEach(function (em) {
				em.closest('button').classList.add('has-info');
			});
			el.noValidate;
			var validationPlugin = new Validator(el, {
				autoScroll: false,
				showValid: true
			});

			if (!validationPlugin.hasError()) {
				validationPlugin.setSubmitEnabled();
			}
		}
		new_css('form-validation-css', a_css_validation);
	}, 'validator-loaded');
}

function validator_run(el) {
	var formElement = el,
		el_required = formElement.querySelectorAll('[required]');
	if (el_required.length) {
		Array.from(el_required).forEach(function (en) {
			if (en.value === '' && (en.tagName.toLowerCase() === 'input' || en.tagName.toLowerCase() === 'textarea')) {
				en.classList.add('required-empty');
			}
		});
		if (formElement.querySelectorAll('.required-empty').length) {
			Array.from(formElement.querySelectorAll('button[type="submit"]')).forEach(function (em) {
				em.disabled = true;
			});
		}
	}
	Array.from(formElement.querySelectorAll('p input')).forEach(function (em) {
		em.closest('p').classList.add('has-input');
	});
	Array.from(formElement.querySelectorAll('p.has-input, ul:not(.l4us, .l4al)')).forEach(function (em) {
		if (!em.classList.contains('form-group')) {
			if (em.tagName.toLowerCase() === 'ul') {
				em.appendChild(createElementWithClass('li', 'invalid-feedback'));
			} else {
				em.appendChild(createElementWithClass('span', 'invalid-feedback'));
			}
			em.classList.add('form-group');
			Array.from(em.querySelectorAll('span[class*="size-"] + .invalid-feedback')).forEach(function (en) {
				en.previousElementSibling.before(en);
			});
		}
	});
	if (formElement.hasAttribute('data-hold')) {
		validate_me(formElement);
	}
	Array.from(formElement.querySelectorAll('input, select, textarea, button')).forEach(function (formInputs) {
		formInputs.addEventListener('focus', function () {
			validate_me(formElement);
		});
		formInputs.addEventListener('change', function () {
			validate_me(formElement);
		});
	});
	if (!isMobile) {
		formElement.addEventListener('mouseover', function () {
			validate_me(formElement);
		});
		formElement.addEventListener('mouseenter', function () {
			validate_me(formElement);
		});
	}
	if (el.querySelectorAll('footer.hidden').length) {
		el.addEventListener('submit', function (e) {
			el.classList.add('submitted');
			e.preventDefault();
		});
	}
}

var formValidateAsync = function() {
	var form_validate = document.querySelectorAll('.f8vl:not(.f8vl-initialized)');
	if (form_validate.length) {
		Array.from(form_validate).forEach(function (el) {
			el.classList.add('f8vl-initialized');
			el.classList.remove('processing', 'processed');
			validator_run(el);
		});
	}
};
formValidateAsync();

var changeInputsRequired = function(addAttribute, container) {
	Array.from(container.querySelectorAll('input, textarea')).forEach(function (el) {
		if (!addAttribute) {
			el.checked = false;
			el.setAttribute('disabled', 'disabled');
			if (el.getAttribute('data-required') != undefined) {
				el.removeAttribute('required');
			}
		} else {
			el.removeAttribute('disabled');
			if (el.getAttribute('data-required') != undefined) {
				el.setAttribute('required', 'required');
			}
		}
	});
};

function data_show_me(el) {
	el.addEventListener('click', function (e) {
		const targets = document.querySelectorAll('[data-element="' + el.getAttribute('data-enable') + '"]');
		targets.forEach(function (item) {
			item.classList.remove('hidden');
		});
		if (el.tagName.toLowerCase() === 'a') {
			e.preventDefault();
		}
	});
	const sibling = el.nextElementSibling;
	if (
		!isMobile &&
		sibling &&
		sibling.hasAttribute('data-element') &&
		sibling.getAttribute('data-element') === el.getAttribute('data-enable')
	) {
		el.addEventListener('mouseenter', function () {
			sibling.classList.remove('hidden');
		});
		const targets = document.querySelectorAll('[data-element="' + el.getAttribute('data-enable') + '"]');
		targets.forEach(function (item) {
			item.addEventListener('mouseleave', function () {
				el.classList.remove('hidden');
				item.classList.add('hidden');
			});
		});
		if (
			el.hasAttribute('data-element') &&
			el.hasAttribute('data-disable') &&
			el.getAttribute('data-disable') === el.getAttribute('data-element')
		) {
			el.addEventListener('mouseenter', function () {
				el.classList.add('hidden');
			});
		}
	}
}

function data_hide_me(el) {
	el.addEventListener('click', function (e) {
		Array.from(document.querySelectorAll('[data-element="' + el.getAttribute('data-disable') + '"]')).forEach(function (em) {
			console.log("em", em);
			em.classList.add('hidden');
			if (el.getAttribute('data-disable').includes('address')) {
				window.scrollTo(0, 0);
			}
		});
		if (el.tagName.toLowerCase() === 'a') {
			e.preventDefault();
		}
	});
}

function data_togg_me(el) {
	el.addEventListener('click', function (e) {
		Array.from(document.querySelectorAll('[data-element="' + el.getAttribute('data-toggle') + '"]')).forEach(function (el) {
			if (el.classList.contains('hidden')) {
				el.classList.remove('hidden');
				if (el.getAttribute('data-disable-inputs') != null) {
					changeInputsRequired(true, el);
				}
			} else {
				el.classList.add('hidden');
				if (el.getAttribute('data-disable-inputs') != null) {
					changeInputsRequired(false, el);
				}
			}
		});
		if (el.tagName.toLowerCase() === 'a') {
			e.preventDefault();
		}
	});
}

// Show/hide/toggle [data-element]
var showHideDataElementAsync = function() {
	var data_show = document.querySelectorAll('a[data-enable]:not(.data-enable-listening), input[data-enable]:not(.data-enable-listening), button[data-enable]:not(.data-enable-listening)'),
		data_hide = document.querySelectorAll('a[data-disable]:not(.data-disable-listening), input[data-disable]:not(.data-disable-listening), button[data-disable]:not(.data-disable-listening)'),
		data_toggle = document.querySelectorAll('a[data-toggle]:not(.data-toggle-listening), input[data-toggle]:not(.data-toggle-listening), button[data-toggle]:not(.data-toggle-listening)');
	if (data_show.length || data_hide.length || data_toggle.length) {
		Array.from(data_show).forEach(function (el) {
			el.classList.add('data-enable-listening');
			data_show_me(el);
		});
		Array.from(data_hide).forEach(function (el) {
			el.classList.add('data-disable-listening');
			data_hide_me(el);
		});
		Array.from(data_toggle).forEach(function (el) {
			el.classList.add('data-toggle-listening');
			data_togg_me(el);
		});
	}
}
showHideDataElementAsync();

// Toggle input type
var a_show = document.querySelectorAll('a.show');
if (a_show.length) {
	// renamed i to index. Below you do a for-loop and use the same variable name i. This can be really confusing
	// and, as you assign in the for loop the i variable, this i from the function(el, i) is never used - could be removed from code
	Array.from(a_show).forEach(function (el) {
		var c = el.children,
			d = el.parentElement.nextElementSibling,
			i,
			all;
		el.parentElement.classList.add('has-show');
		d.addEventListener('keyup', function (e) {
			if (d.value === '') {
				el.parentElement.classList.remove('not-empty');
			} else {
				el.parentElement.classList.add('not-empty');
			}
		});
		el.addEventListener('click', function (e) {
			el.classList.toggle('show-toggle');
			for (i = 0, all = c.length; i < all; i = i + 1) {
				c[i].classList.toggle('hidden');
			}
			if (d.getAttribute('type') === 'password') {
				d.setAttribute('type', 'text');
			} else {
				d.setAttribute('type', 'password');
			}
			e.preventDefault();
		});
	});
}

// +/- input
var semanticInputAsync = function() {
	var input_amount = document.querySelectorAll('.input-amount:not(.semantic-input-initialized)');
	if (input_amount.length) {
		Array.from(input_amount).forEach(function (el) {
			el.classList.add('semantic-input-initialized');
			var inc = createElementWithClass('a', 'incr'),
				dec = createElementWithClass('a', 'decr');

			inc.setAttribute('href', './');
			dec.setAttribute('href', './');
			inc.setAttribute('aria-label', 'Increase by 1');
			dec.setAttribute('aria-label', 'Descrease by 1');
			el.innerHTML = '<span class="semantic-amount">' + el.innerHTML + '</span>';

			Array.from(el.children).forEach(function (el) {
				var inp = el.querySelector('input');
				el.appendChild(inc);
				el.appendChild(dec);
				if (parseFloat(inp.value) === 1 || inp.value === '') {
					el.querySelector('.decr').classList.add('disabled');
				}
				if (inp.hasAttribute('min') && parseFloat(inp.value) < parseFloat(inp.getAttribute('min')) + 1) {
					el.querySelector('.decr').classList.add('disabled');
				}
				if (inp.hasAttribute('max') && parseFloat(inp.value) === parseFloat(inp.getAttribute('max'))) {
					el.querySelector('.incr').classList.add('disabled');
				}
			});
			if (el.parentNode.classList.contains('submit')) {
				Array.from(el.parentNode.querySelectorAll('button')).forEach(function (em) {
					if (em.classList.contains('size-m')) {
						el.classList.add('size-m');
					}
					if (em.classList.contains('size-l')) {
						el.classList.add('size-l');
					}
				});
			}
		});
		Array.prototype.slice.call(input_amount).map(function (el) {
			return {
				input: el.querySelector('input'),
				decr: el.querySelector('.decr'),
				incr: el.querySelector('.incr'),
				get value() {
					return parseInt(this.input.value);
				},
				set value(newValue) {
					var input = el.querySelector("input"),
						decrElements,
						incrElements,
						dataLink,
						inputLink,
						decrElementLinkData,
						incrElementLinkData;
					input.value = newValue;

					decrElements = [this.decr]; // if has data-link, it will change decr for data-link element too
					incrElements = [this.incr]; // if has data-link, it will change decr for data-link element too

					// check if input has a data-link attribute. If it has, get element associated with and set new value
					dataLink = input.getAttribute("data-link");
					if (dataLink) {
						inputLink = document.querySelector(dataLink);
						if (inputLink) {
							inputLink.value = newValue;

							decrElementLinkData = inputLink.closest(".input-amount");
							incrElementLinkData = inputLink.closest(".input-amount");
							if (decrElementLinkData) {
								decrElementLinkData = decrElementLinkData.querySelector(".decr");
								decrElements.push(decrElementLinkData);
							}
							if (incrElementLinkData) {
								incrElementLinkData = incrElementLinkData.querySelector(".incr");
								incrElements.push(incrElementLinkData);
							}
						}
					}

					// loop through all decr elements to change its class if needed
					Array.from(decrElements).forEach(function (decrEl) {
						var st = 2;
						if (input.hasAttribute('min')) {
							st = parseFloat(input.getAttribute('min')) + 1;
						}
						if (parseFloat(newValue) < st) {
							decrEl.classList.add('disabled');
						} else {
							if (decrEl.classList.contains('disabled') && !input.classList.contains('disable-on-change')) {
								decrEl.classList.remove('disabled');
							}
						}
					});
					Array.from(incrElements).forEach(function (incrEl) {
						if (input.hasAttribute('max')) {
							if (parseFloat(newValue) >= parseFloat(input.getAttribute('max'))) {
								incrEl.classList.add('disabled');
							} else {
								if (incrEl.classList.contains('disabled') && !input.classList.contains('disable-on-change')) {
									incrEl.classList.remove('disabled');
								}
							}
						}
					});
				}
			};
		}).forEach(function (el) {
			var step = 1;
			if (el.input.hasAttribute('step')) {
				step = parseFloat(el.input.getAttribute('step'));
			}
			el.decr.addEventListener('click', function (e) {
				if (el.input.classList.contains('disable-on-change')) { el.decr.classList.add('disabled') }
				if (el.input.hasAttribute('min')) {
					if (el.value > parseFloat(el.input.getAttribute('min'))) {
						el.value -= step;
					}
				} else {
					if (el.value > 1) {
						el.value -= step;
					}
				}
				el.input.dispatchEvent(changeEvent);
				e.preventDefault();
			});
			el.incr.addEventListener('click', function (e) {
				if (el.input.classList.contains('disable-on-change')) { el.incr.classList.add('disabled') }
				if (el.input.hasAttribute('max')) {
					if (el.value < parseFloat(el.input.getAttribute('max'))) {
						el.value += 1;
					}
				} else {
					el.value += step;
				}
				if (isNaN(el.value)) {
					el.value = step;
				}
				el.input.dispatchEvent(changeEvent);
				e.preventDefault();
			});
			el.input.addEventListener('change', function () {
				el.value = parseFloat(el.value);
				if (isNaN(el.value)) {
					el.value = 1;
					el.decr.classList.add('disabled');
				}
			});
		});
	}
};
semanticInputAsync();

// .l4ne.featured - prepend the big image before the list on mobile device (blog)
var list_news = document.getElementsByClassName('l4ne');
if (list_news.length) {
	Array.from(list_news).forEach(function (el) {
		if (el.classList.contains('featured')) {
			Array.from(el.querySelectorAll('li:first-child')).forEach(function (el) {
				var clone_me = el.cloneNode(true),
					clone_cont = document.createElement('ul'),
					list = el.closest('.l4ne');
				clone_cont.classList.add('mobile-only', 'l4ne', 'l4ne-figure-before');
				el.closest('li').classList.add('mobile-hide');
				list.before(clone_cont);
				if (list.previousElementSibling.classList.contains('l4ne-figure-before')) {
					list.previousElementSibling.append(clone_me);
				}
			});
		}
	});
}


// Update text based on title (product page)
function dataChange(el, en, eo = '.inner') {
	Array.from(document.querySelectorAll(en)).forEach(function (em) {
		Array.from(em.querySelectorAll(eo)).forEach(function (en) {
			en.innerHTML = el;
		});
	});
}

var dataChangeAscync = function () {
	var data_change = document.querySelectorAll('a[data-change][title]:not(.listening-data-change), input[data-change][title]:not(.listening-data-change)'),
			data_change_to = document.querySelectorAll('[class^="data-change-to"]:not(.listening-data-change)');

	if (data_change_to.length) {
		Array.from(data_change_to).forEach(function (el) {
			var oldCont = createElementWithClass('span', 'hidden');
			oldCont.innerHTML = el.innerHTML;
			el.innerHTML = '<span class="inner">' + el.innerHTML + '</span>'
			el.appendChild(oldCont);
			el.classList.add('listening-data-change');
		});
	}

	if (data_change.length) {
		Array.from(data_change).forEach(function (el) {
			el.classList.add('listening-data-change');
			el.addEventListener('click', function (e) {
				dataChange(el.getAttribute('title'), el.getAttribute('data-change'), ['.inner', '.hidden']);
				if (el.tagName.toLowerCase() === 'a') {
					e.preventDefault();
				}
			});
			if (!isMobile) {
				if (el.tagName.toLowerCase() === 'input' && el.nextElementSibling.tagName.toLowerCase() === 'label') {
					el.nextElementSibling.addEventListener('mouseenter', function (e) {
						dataChange(el.getAttribute('title'), el.getAttribute('data-change'));
					});
					el.nextElementSibling.addEventListener('mouseleave', function (e) {
						dataChange(document.querySelectorAll(el.getAttribute('data-change') + ' .hidden')[0].innerText, el.getAttribute('data-change'));
					});
				}
			}
		});
	}
};
dataChangeAscync();

// Self-embedded YouTube/Vimeo
window.embeddedVideo = function() {
	var data_self_video = document.querySelectorAll('a[data-youtube], a[data-vimeo]');
	if (data_self_video.length) {
		Array.from(data_self_video).forEach(function (el) {
			el.addEventListener('click', function (e) {
				var iframeCont = createElementWithClass('iframe', 'iframe-playing');
				iframeCont.setAttribute('frameborder', 0);
				iframeCont.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
				iframeCont.setAttribute('allowfullscreen', '');
				if (el.hasAttribute('data-youtube')) {
					iframeCont.setAttribute('src', 'https://www.youtube.com/embed/' + el.getAttribute('data-youtube') + '?autoplay=1&amp;rel=0');
				}
				if (el.hasAttribute('data-vimeo')) {
					iframeCont.setAttribute('src', 'https://player.vimeo.com/video/' + el.getAttribute('data-vimeo') + '?autoplay=1');
				}
				el.appendChild(iframeCont);
				e.preventDefault();
			});
		});
	}
}
embeddedVideo();

var bindInputAsync = function () {
	var data_bind_input = document.querySelectorAll('input[data-bind], textarea[data-bind]');
	if (data_bind_input.length) {
		Array.from(data_bind_input).forEach(function (el) {
			el.addEventListener('change', function (e) {
				var binded = document.querySelectorAll('input[id="' + el.getAttribute('data-bind') + '"], textarea[id="' + el.getAttribute('data-bind') + '"]'),
					check_cont;
				Array.from(binded).forEach(function (em) {
					if (em.tagName === 'INPUT') {
						check_cont = em.closest('.check')
						em.checked = el.checked;
						if (check_cont !== null && el.checked == true) {
							check_cont.getElementsByClassName('invalid-feedback')[0].innerHTML = '';
						}
					} else if (em.tagName === 'TEXTAREA') {
						em.value = el.value;
						em.removeAttribute('name');
					}
				});
			});
		});
	}
};
bindInputAsync();

// Cookie bar
var cookie_id = document.getElementById('cookie-bar'),
	cookie_popup = document.querySelector('[data-title*="cookie"][data-popup-delay]'),
	cookiebanner_testmode = general.cookiebanner_testmode,
	age_verify_popup_testmode = general.age_verify_popup_testmode;

function hideCookieBanner() {
	if (cookie_popup) {
		cookie_popup.removeAttribute('data-popup-delay');
	}
	setTimeout(function () {
		html_tag.classList.remove('cookie-on');
	}, 400);
	if (!form_product_sticky) {
		root_id.removeAttribute('style');
		if (totop_id) {
			totop_id.removeAttribute('style');
		}
	}
}

function cookieClick(el) {
	html_tag.classList.add('cookie-toggle');
	if (el.classList.contains('cookie-accept')) {
		handleCookieAccept();
	} else if (el.classList.contains('cookie-decline')) {
		handleCookieDecline();
	} else {
		hideCookieBanner();
	}
	if (!form_product_sticky) {
		root_id.removeAttribute('style');
		if (totop_id) {
			totop_id.removeAttribute('style');
		}
	}
	setTimeout(function () {
		html_tag.classList.remove('cookie-on');
	}, 400);
	Cookies.set('cookie-bar', 'no', { expires: 30, sameSite: 'none', secure: true });
}

function handleCookieAccept() {
	Cookies.set('cookie-bar', 'no', { expires: 30, sameSite: 'none', secure: true });
	window.Shopify.customerPrivacy.setTrackingConsent(true, hideCookieBanner);
}

function handleCookieDecline() {
	Cookies.set('cookie-bar', 'no', { expires: 30, sameSite: 'none', secure: true });
	window.Shopify.customerPrivacy.setTrackingConsent(false, hideCookieBanner);
}

if (cookie_id || cookie_popup || document.querySelector('.popup-blocker[data-title="age-verifier-popup"] .age-verifier-popup-cookie-text') ) {
	window.Shopify.loadFeatures([
			{
				name: 'consent-tracking-api',
				version: '0.1',
			}
		],
		function (error) {
			if (error) {
				throw error;
			}
			const shouldShowGDPRBanner = window.Shopify.customerPrivacy.shouldShowGDPRBanner();
			if (!shouldShowGDPRBanner) {
				Cookies.set('cookie-bar', 'no', { expires: 30, sameSite: 'none', secure: true });
			}
		});

	if (document.querySelector('.popup-blocker[data-title="age-verifier-popup"] .age-verifier-popup-cookie-text')) {
		if (age_verify_popup_testmode) {
			Cookies.remove('cookie-bar', { sameSite: 'none', secure: true });
		}
	} else if (cookiebanner_testmode) {
		Cookies.remove('cookie-bar', { sameSite: 'none', secure: true });
	}

	if (!form_product_sticky && cookie_id) {
		html_tag.classList.remove('cookie-on');
		root_id.style.paddingBottom = cookie_id.offsetHeight + 'px';
		if (totop_id) {
			totop_id.style.paddingBottom = cookie_id.offsetHeight + 'px';
		}
	}
	append_url(root_id, closeText, 'cookie-close');
	Array.from(document.querySelectorAll('.cookie-close, .cookie-decline, .cookie-accept')).forEach(function (el) {
		el.addEventListener('click', function (e) {
			cookieClick(el);
			e.preventDefault();
		});
	});
}

if (Cookies.get('cookie-bar') === 'no' || document.getElementsByClassName('popup-blocker').length) {
	if (cookie_popup) {
		cookie_popup.removeAttribute('data-popup-delay');
	}
	if (Cookies.get('cookie-bar') === 'no' && document.querySelector('.popup-blocker[data-title="age-verifier-popup"] .age-verifier-popup-cookie-text')) {
		document.querySelector('.popup-blocker[data-title="age-verifier-popup"] .age-verifier-popup-cookie-text').remove();
		document.querySelector('.popup-blocker[data-title="age-verifier-popup"] .cookie-accept').classList.remove('cookie-accept');
	}
	html_tag.classList.remove('cookie-on');
	if (!form_product_sticky) {
		root_id.removeAttribute('style');
		if (totop_id) {
			totop_id.removeAttribute('style');
		}
	}
} else {
	html_tag.classList.add('cookie-on');
}

// Custom look of select boxes
var semanticSelectAsync = function() {
	var select_tag = document.querySelectorAll('select[id]:not(.semantic-select-initialized):not(.js-hidden)');
	if (select_tag.length && !isMobile) {
		loadRes(a_js_selects, function () {
			Array.from(select_tag).forEach(function (el) {
				el.classList.add('semantic-select-initialized');
				var sp = '',
					bvsel,
					findSwiper;
				if (el.hasAttribute('data-search-placeholder')) {
					sp = el.getAttribute('data-search-placeholder');
				}
				el.setAttribute('tabindex', -1);
				if (el.querySelectorAll('option[selected]:not([disabled], .disabled, [data-class="disabled"])').length) {
					el.parentNode.classList.add('done');
				}

				if (!isMobile) {
					wrap(el, document.createElement('span'), 'select-wrapper');
					randomize(el);
					bvsel = new BVSelect({
						selector: '#' + el.getAttribute('id') + '[data-random="' + el.dataset.random + '"]',
						searchbox: true,
						search_placeholder: sp,
						search_autofocus: true,
						offset: false
					});
					Array.from(el.nextSibling.querySelectorAll('.bv_ul_inner a')).forEach(function (em) {
						em.addEventListener('click', function () {
							el.dispatchEvent(changeEvent);
							if (em.closest('.form-group') !== null) {
								em.closest('.form-group').classList.remove('is-invalid');
							}
							if (em.parentNode.classList.contains('has-scroll')) {
								document.querySelectorAll(em.getAttribute('href'))[0].scrollIntoView();
							}
							if (em.hasAttribute('data-slide-to')) {
								if (em.closest('li') !== null) {
									findSwiper = em.closest('li').querySelectorAll('.s4wi')[0].children[0].swiper;
									findSwiper.slideTo(em.getAttribute('data-slide-to'));
								}
							}
						});
					});
					Array.from(el.parentNode.getElementsByClassName('bv_atual')).forEach(function (em) {
						em.addEventListener('click', function () {
							new_css('css-select', a_css_select);
						});
						em.addEventListener('focus', function () {
							new_css('css-select', a_css_select);
						});
					});
				}
			});
		}, 'selects-loaded');
	}
}
semanticSelectAsync();

var productListSlider = function() {
	var list_product_slider = document.getElementsByClassName('l4pr');
  if (list_product_slider.length) {
    Array.from(list_product_slider).forEach(function (el) {
      var data_update_product_slider = document.querySelectorAll('[data-l4pr-index]');
      if (data_update_product_slider.length && !el.hasAttribute('data-variant-image')) {
        Array.from(data_update_product_slider).forEach(function (em) {
          var parent = el,
            order,
            mx,
            ox;
  
          if (em.hasAttribute('data-l4pr-target')) {
            parent = document.getElementById(em.getAttribute('data-l4pr-target'));
            if (!el.classList.contains('slider')) {
              parent = document.getElementById(em.getAttribute('data-l4pr-target') + '-desktop');
            }
          }
          if (em.tagName.toLowerCase() === 'option') {
            var em = em.parentNode;
            em.addEventListener('change', function () {
              var dx = em[em.selectedIndex].getAttribute('data-l4pr-index') - 1;
              if (dx !== null && parent !== null) {
                if (!el.classList.contains('slider')) {
                  mx = parent.querySelectorAll('li:nth-child(' + dx + ') .anchor')[0];
                  if (mx !== undefined) {
                    mx.scrollIntoView();
                  }
					const nextSibling = parent.nextElementSibling;
					if (nextSibling) {
						const swiperOuter = nextSibling.querySelector('.swiper-outer');
						if (swiperOuter && swiperOuter.swiper) {
							swiperOuter.swiper.slideTo(dx);
						}
					}
                } else if (parent.getElementsByClassName('swiper-outer').length) {
                  parent.getElementsByClassName('swiper-outer')[0].swiper.slideTo(dx);
                }
              }
            });
          } else {
            em.addEventListener('click', function (e) {
              order = 1 + parseFloat(em.getAttribute('data-l4pr-index'));
              if (parent !== null) {
                ox = parent.querySelectorAll('li:nth-child(' + order + ') .anchor');
                if (!el.classList.contains('slider')) {
                  if (ox[0] !== undefined) {
                    ox[0].scrollIntoView();
                  }
					const nextSibling = parent.nextElementSibling;
					if (nextSibling) {
						const swiperOuter = nextSibling.querySelector('.swiper-outer');
						if (swiperOuter) {
							swiperOuter.swiper.slideTo(em.getAttribute('data-l4pr-index') - 1);
						}
					}
                } else {
                  parent.getElementsByClassName('swiper-outer')[0].swiper.slideTo(em.getAttribute('data-l4pr-index') - 1);
                }
                if (em.tagName.toLowerCase() === 'a' && !em.classList.contains('option')) {
                  e.preventDefault();
                }
              }
            });
          }
        });
      }
    });
  }
}
setTimeout(function () {
	productListSlider();
}, 500);

var module_collection_any = document.getElementsByClassName('m6cl');
if (module_collection_any.length) {
	Array.from(module_collection_any).forEach(function (el) {
		var closestSection = el.closest('.shopify-section');
		if (closestSection !== null) {
			closestSection.classList.add('has-m6cl');
		}
	});
}

// sidebar sliding from the edge (product page, cart)
var module_product = document.getElementsByClassName('m6pr'),
	module_collection = document.querySelectorAll('.m6cl.sticky');
if (module_product.length || module_collection.length) {
	html_tag.classList.add('t1pr');
}

// sidebar sliding from the edge (product page, cart)
var module_panel = document.getElementsByClassName('m6pn'),
	a_module_panel = document.querySelectorAll('a[data-panel]');

function negTabIn(el) {
	// Elements won't be tabbable.
	Array.from(el.querySelectorAll('a, input, button, select, textarea, [role="button"]')).forEach(function (el) {
		el.setAttribute('tabindex', -1);
	});
}

function posTabIn(el) {
	// Elements will be tabbable.
	Array.from(el.querySelectorAll('a, input, button, select, textarea, [role="button"]')).forEach(function (el) {
		el.removeAttribute('tabindex');
	});
}

function hidePanels() {
	var cld, m6pn_clicked;
	html_tag.classList.remove('m6pn-open');
	Array.from(module_panel).forEach(function (el) {
		if(el.getAttribute("id") == 'product-reviews'){
			if(el.querySelector('.l4rv').classList.contains('hide-reviews')) {
				setTimeout(function(){
					el.querySelector('.l4rv').classList.remove('hide-reviews');
				}, 500);
			}
		}
		el.classList.remove('toggle');
		el.setAttribute('aria-hidden', true);
		negTabIn(el);
	});
	m6pn_clicked = document.getElementsByClassName('m6pn-clicked');
	if (m6pn_clicked.length) {
		if (whatInput.ask() === 'keyboard') {
			setTimeout(function () {
				document.getElementsByClassName('m6pn-clicked')[0].focus();
			}, 100);
		}
	}
}

//to check when element gets position sticky
function getStickyFooters() {
	var sticky_in_panel = document.getElementsByClassName('sticky-in-panel');
	if (sticky_in_panel.length) {
		Array.from(sticky_in_panel).forEach(function (eo) {
			if (eo.classList.contains('sticky-in-panel')) {
				if (!eo.getElementsByClassName('offset-dist').length) {
					var trickDiv = createElementWithClass('div', 'offset-dist');
					eo.prepend(trickDiv);
				}
				const observer = new IntersectionObserver(
						([e]) => e.target.parentElement.classList.toggle('is-sticky', e.intersectionRatio < 1), {
							threshold: [1, 0]
						}
				);
				observer.observe(eo.getElementsByClassName('offset-dist')[0]);
			}
		});
	}
}

function openPanel(id) {
	var linked = document.querySelectorAll('.m6pn[id="' + id + '"]'),
		linked_child,
		a_source = document.querySelectorAll('a[data-panel="' + id + '"]');

	overlayClose();
	html_tag.classList.add('has-panels', 'm6pn-open');
	Array.from(a_module_panel).forEach(function (em) {
		em.classList.remove('m6pn-clicked');
	});
	Array.from(a_source).forEach(function (em) {
		em.classList.add('m6pn-clicked');
	});
	Array.from(module_panel).forEach(function (el) {
		el.setAttribute('aria-hidden', true);
		el.classList.remove('toggle');
    if(el.scrollHeight > el.clientHeight){
			el.classList.add('has-scrollbar');
		}
	});
	Array.from(linked).forEach(function (el) {
		el.classList.add('toggle');
		el.setAttribute('aria-hidden', false);
		posTabIn(el);
	});
	//to check when element gets position sticky
	getStickyFooters();
	new_css('product-css', a_css_product);
	new_css('css-panels', a_css_panels);
}


var modulePanelAsync = function () {
	module_panel = document.querySelectorAll('.m6pn');
	var a_module_panel = document.querySelectorAll('a[data-panel]:not(.listening)');
    Array.from(module_panel).forEach(function (el) {
        el.classList.add('m6pn-initialized');
        el.setAttribute('aria-hidden', true);
		Array.from(el.getElementsByClassName('m6pn-close')).forEach(function (em) { em.remove(); });
		if (!el.querySelector('.m6pn-close:not(.strong)')) {
			append_url(el, 'Close', 'm6pn-close');
		}
        setTimeout(function () {
            negTabIn(el);
        }, 500);
		el.getElementsByClassName('m6pn-close')[0].addEventListener('click', function (e) {
			hidePanels();
			if (html_tag.hasAttribute('data-panel-close-to')) {
				var close_to = html_tag.getAttribute('data-panel-close-to');
				setTimeout(function () {
					openPanel(close_to);
				}, 0);
			}
			html_tag.removeAttribute('data-panel-close-to');
			e.preventDefault();
      });
		Array.from(el.querySelectorAll('a[data-panel-hide="' + el.id + '"]')).forEach(function (em) {
			em.addEventListener('click', function (e) {
				hidePanels();
				e.preventDefault();
			});
		});
    });

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.key === 'Escape') {
            hidePanels();
        }
    };
    if (a_module_panel.length) {
		Array.from(a_module_panel).forEach(function (el) {
			el.classList.add('data-panel-initialized');
			var id = el.dataset.panel,
				href = el.getAttribute('href'),
				linked = document.querySelectorAll('.m6pn[id="' + id + '"]'),
				parent = el.closest('.m6pn[id]');
			el.classList.add('listening');

			if (linked.length) {
				el.setAttribute('aria-haspopup', true);
				el.setAttribute('aria-controls', id);
				if (el.tagName.toLowerCase() === 'a') {
					el.addEventListener('click', function (e) {
						if (id == 'cart') {
							e.preventDefault();
							ajaxCart.load();
						} else {
							openPanel(id);
							if (parent !== null) {
								html_tag.setAttribute('data-panel-close-to', parent.getAttribute('id'));
							} else {
								html_tag.removeAttribute('data-panel-close-to');
							}
							if (!href.includes('#')) {
								e.preventDefault();
							}
						}
					});
					el.addEventListener('keyup', function (e) {
						if (e.key === ' ') {
							e.preventDefault();
							if (id == 'cart') {
								ajaxCart.load();
								return;
							} else {
								openPanel(id);
								if (parent !== null) {
									html_tag.setAttribute('data-panel-close-to', parent.getAttribute('id'));
								} else {
									html_tag.removeAttribute('data-panel-close-to');
								}
								e.preventDefault();
							}
						}
					});
				}
			}
		});
    }
};
modulePanelAsync();

// IMG comparison .image-compare
var image_compare = document.getElementsByClassName('img-compare');
if (image_compare.length) {
	loadRes(a_js_compare, function () {
		new_css('compare-css', a_css_compare);
		Array.from(image_compare).forEach(function (el) {
			var a, b,
				opt_vertical = false,
				opt_start = 50,
				opt_labels = false,
				opt_labels_bef = 'Before',
				opt_labels_aft = 'After';

			if (el.querySelectorAll('img').length === 2) {
				if (el.classList.contains('vertical')) {
					opt_vertical = true;
				} else {
					if (global_dir[1] === false) {
						a = el.children[0],
							b = a.cloneNode(true);
						el.appendChild(b);
						el.removeChild(a);
					}
				}
				if (el.getAttribute('data-start') !== null) {
					if (global_dir[1] === false) {
						opt_start = 100 - parseFloat(el.getAttribute('data-start'));
					} else {
						opt_start = parseFloat(el.getAttribute('data-start'));
					}
				}
				if (el.getAttribute('data-label-before') !== null || el.getAttribute('data-label-after') !== null) {
					opt_labels = true;
					if (el.getAttribute('data-label-before') !== null) {
						opt_labels_bef = el.getAttribute('data-label-before');
					}
					if (el.getAttribute('data-label-after') !== null) {
						opt_labels_aft = el.getAttribute('data-label-after');
					}
				}
				if (el.children.length === 2) {
					new ImageCompare(el, {
						verticalMode: opt_vertical,
						startingPoint: opt_start,
						showLabels: opt_labels,
						labelOptions: {
							before: opt_labels_bef,
							after: opt_labels_aft
						}
					}).mount();
				}
			}
		}, 'compare-loaded');
	});
}

var inputDateAsync = function() {
	var input_date = document.querySelectorAll('input[type="date"]:not(.datepicker-initialized)'),
		global_lang = general.language;
	if (input_date.length && !isMobile) {
		const datepicker_langs = ['ar', 'az', 'bg', 'bm', 'bn', 'br', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'ka', 'kk', 'km', 'ko', 'lt', 'lv', 'me', 'mk', 'mn', 'mr', 'ms', 'nl', 'no', 'oc', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'ta', 'tg', 'th', 'tk', 'tr', 'uk', 'uz', 'vi'];
		const datepicker_options = {
			orientation: 'bottom',
			format: 'dd-mm-yyyy',
			language: global_lang
		};
		new_css('datepicker-css', a_css_datepicker);
		if (datepicker_langs.includes(global_lang)) {
			let datepicker_path;
			if (window.Shopify === undefined) {
				datepicker_path = 'js/datepicker-lang/datepicker-lang-' + global_lang + '.js';
			} else {
				datepicker_path = datepicker_path_global;
			}
			loadRes(a_js_datepicker, function () {
				loadRes(datepicker_path, function () {
					Array.from(input_date).forEach(function (el) {
						var minDate = null,
							maxDate = null;
						if (el.getAttribute('data-min-date') == 'today') {
							minDate = new Date();
						}
						if (el.getAttribute('data-max-days') != null) {
							maxDate = new Date();
							maxDate.setDate(maxDate.getDate() + parseInt(el.getAttribute('data-max-days')));
						}
						datepicker_options['minDate'] = minDate;
						datepicker_options['maxDate'] = maxDate;
						el.classList.add('datepicker-initialized');
						el.setAttribute('type', 'text');
						if (typeof Datepicker === 'function') {
							new Datepicker(el, datepicker_options);
						}
					}, 'datepicker-loaded');
				}, 'datepicker-lang-loaded');
			});
		} else {
			loadRes(a_js_datepicker, function () {
				Array.from(input_date).forEach(function (el) {
					var minDate = null,
						maxDate = null;
					if (el.getAttribute('data-min-date') == 'today') {
						minDate = new Date();
					}
					if (el.getAttribute('data-max-days') != null) {
						maxDate = new Date();
						maxDate.setDate(maxDate.getDate() + parseInt(el.getAttribute('data-max-days')));
					}
					datepicker_options['minDate'] = minDate;
					datepicker_options['maxDate'] = maxDate;
					el.classList.add('datepicker-initialized');
					el.setAttribute('type', 'text');
					if (typeof Datepicker === 'function') {
						new Datepicker(el, datepicker_options);
					}
				});
			}, 'datepicker-loaded');
		}
	}
};
inputDateAsync();

var listCartAsync = function() {
	var list_cart = document.getElementsByClassName('l4ca');
	if (list_cart.length) {
		var removeHidden = function() {
			if (document.querySelector('#cart .empty.hidden') && document.querySelector('#cart .l4ca > li') === null) {
				document.querySelector('#cart .empty').classList.remove('hidden');
			}
		};
		Array.from(list_cart).forEach(function (el) {
			var hide_delay = 10000000;
			if (el.getAttribute('data-delay')) {
				hide_delay = parseFloat(el.getAttribute('data-delay'));
			}
			Array.from(el.querySelectorAll('a .icon-x-circle')).forEach(function (em) {
				em.closest('a').classList.add('remove');
			});
			if(el.classList.contains('in-panel')){
				Array.from(el.children).forEach(function (em) {
					if(em.querySelectorAll('select').length){
						em.classList.add('has-select');
					}
				});
			}
			Array.from(el.querySelectorAll('a.remove')).forEach(function (em) {
				var par = em.closest('li');
				if (par !== undefined) {
					par.addEventListener('removing', function (e) {
						asyncCSS();
						if (!par.classList.contains('removing')) {
							par.classList.add('removing');
							var timeout = setTimeout(function () {
								if (par.classList.contains('removing')) {
									//par.remove();
									par.classList.add('removing2');
									setTimeout(function () {
										par.remove();
										removeHidden();
									}, 400);
								}
							}, hide_delay);
						} else {
							par.classList.remove('removing');
							removeHidden();
							clearTimeout(timeout);
						}
						e.preventDefault();
					});
				}
			});
		});
	}
};
listCartAsync();


// Searchbox
function clearCompactSearch() {
	html_tag.classList.remove('search-compact-active', 'search-full', 'user-form-active');
	search_id.classList.remove('full', 'has-text', 'not-empty');
	negTabIn(search_id.getElementsByTagName('fieldset')[0]);
	search_input[0].value = '';
}

function compactSearch() {
	if (html_tag.classList.contains('search-compact-active')) {
		clearCompactSearch();
	} else {
		new_css('css-search', a_css_search);
		customDropHeight();
		html_tag.classList.add('search-compact-active');
		html_tag.classList.remove('user-form-active', 'm2a', 'nav-hover', 'f8fl-open', 'f8fl-open2');
		search_id.classList.remove('full', 'has-text', 'not-empty');
		search_input[0].value = '';
		search_input[0].focus();
		if (!search_input[0] === document.activeElement) {
			setTimeout(function () {
				search_input[0].focus();
			}, 250);
		}
		posTabIn(search_id.getElementsByTagName('fieldset')[0]);
	}
}

function removeTextSearch() {
	html_tag.classList.remove('search-full', 'user-form-active');
	html_tag.classList.add('search-cleared');
	search_id.classList.remove('has-text', 'not-empty');
	search_input[0].value = '';
	search_input[0].focus();
	if (!search_input[0] === document.activeElement) {
		setTimeout(function () {
			search_input[0].focus();
		}, 250);
	}
}

function overlayClose(n) {
	html_tag.classList.remove('search-compact-active', 'search-full', 'user-form-active', 'm2a', 'nav-hover', 'f8fl-open', 'f8fl-open2');
	if (search_id) {
		search_id.classList.remove('full', 'has-text');
	}
	if (nav_id) {
		clear_mobile_nav();
	}
	if (nav_user_id) {
		remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
	}
	if (n !== true) {
		if (module_panel.length) {
			hidePanels();
			if (html_tag.hasAttribute('data-panel-close-to')) {
				var close_to = html_tag.getAttribute('data-panel-close-to');
				setTimeout(function () {
					openPanel(close_to);
				}, 0);
			}
			html_tag.removeAttribute('data-panel-close-to');
		}
	}
}


document.addEventListener('keydown', function (evt) {
	evt = evt || window.event;
	if (evt.key === 'Escape' || evt.key === 'Esc') {
		close_mobile_nav();
		overlayClose(true);
		if (nav_id) {
			remove_active_submenus(nav_id.querySelectorAll('a.toggle'));
		}
		if (nav_user_id) {
			remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
		}
		if (all_list_drop.length > 0) {
			Array.from(all_list_drop).forEach(function (element) {
				remove_active_submenus(element.querySelectorAll('a.toggle'));
			});
		}
	}
});

var liveSearchAsync = function () {
	search_id = document.getElementById('search');
	nav_user_id = document.getElementById('nav-user');
	header_inner = document.getElementById('header-inner');
	if (search_id) {
		search_input = search_id.querySelectorAll('input');
		var livesearchEl = document.getElementById('livesearch'),
			livesearch_placeholders = livesearchEl.querySelector('.search-placeholders');
		append_url(search_id, toggleText, 'toggle');
		if (search_id.classList.contains('wide')) {
			html_tag.classList.add('search-is-wide');
		}
		if (search_id.classList.contains('no-autocomplete')) {
			html_tag.classList.add('search-without-autocomplete');
		}
		var search_compact_cont = document.createElement('span'),
			v_cm;

		search_compact_cont.classList.add('search-compact-cont');

		append_url(search_compact_cont, closeText, 'search-compact-toggle', '#search');
		search_compact_cont.getElementsByClassName('search-compact-toggle')[0].setAttribute('aria-controls', 'search');
		search_compact_cont.getElementsByClassName('search-compact-toggle')[0].setAttribute('aria-label', searchText);

		if (nav_user_id && !nav_user_id.querySelectorAll('li.search:not(.hidden)').length) {
			search_compact_cont.classList.add('active');
		}
    if (header_inner.hasAttribute('data-custom-search')) {
      search_compact_cont.getElementsByClassName('search-compact-toggle')[0].innerHTML = `<i aria-hidden="true" class="icon-custom"><img src="${header_inner.dataset.customSearch.split(',')[0]}" width="${header_inner.dataset.customSearch.split(',')[1]}" height="${header_inner.dataset.customSearch.split(',')[1]}" /></i>`;
    } else {
      search_compact_cont.getElementsByClassName('search-compact-toggle')[0].innerHTML = '<i aria-hidden="true" class="icon-zoom"></i>';
    }
		
		header_inner.prepend(search_compact_cont);
		if (search_compact_cont.nextElementSibling.classList.contains('link-btn')) {
			insertAfter(search_compact_cont, search_compact_cont.nextElementSibling);
		}
		if (search_id.classList.contains('compact')) {
			html_tag.classList.add('has-search-compact');
		}

		Array.from(search_id.querySelectorAll('form > p, fieldset > p')).forEach(function (el) {
			append_url(el, 'Clear', 'clear-toggle');
			append_url(el, 'Clear', 'search-back');
			el.getElementsByClassName('search-back')[0].addEventListener('click', function (e) {
				overlayClose();
				e.preventDefault();
			});
			Array.from(el.querySelectorAll('.clear-toggle')).forEach(function (em) {
				em.addEventListener('click', function (e) {
					removeTextSearch();
					e.preventDefault();
				});
			});
		});
		search_id.addEventListener('submit', function (e) {
			search_id.classList.add('processing');
		});
		Array.from(search_input).forEach(function (el) {
			el.addEventListener('keyup', function () {
				html_tag.classList.remove('m2a');
				if (el.value.length === 0 && !livesearch_placeholders) {
					html_tag.classList.remove('search-full', 'user-form-active');
					search_id.classList.remove('full', 'has-text', 'not-empty');
				} else {
					search_id.classList.add('full', 'has-text', 'not-empty');
					if (!search_id.classList.contains('no-autocomplete')) {
						search_id.classList.add('processing');
						setTimeout(function () {
							liveSearch(el, livesearch_placeholders);
						}, 300);
					}
				}
			});
			el.addEventListener('focus', function () {
				html_tag.classList.add('search-focus');
				html_tag.classList.remove('nav-hover');
				if (nav_id) {
					remove_active_submenus(nav_id.querySelectorAll('a.toggle'));
				}
				if (nav_user_id) {
					remove_active_submenus(nav_user_id.querySelectorAll('a.toggle'));
				}
				new_css('css-search', a_css_search);
				customDropHeight();
				if (livesearch_placeholders) {
					livesearchEl.innerHTML = '';
					livesearchEl.appendChild(livesearch_placeholders);
					html_tag.classList.add('search-full');
					search_id.classList.add('full', 'has-text');
				}
			});
		});
		Array.from(search_id.querySelectorAll('a.toggle')).forEach(function (el) {
			el.addEventListener('click', function (e) {
				clearCompactSearch();
				search_id.classList.remove('full', 'has-text', 'not-empty');
				html_tag.classList.remove('search-focus', 'search-full', 'user-form-active');
				e.preventDefault();
			});
		});
		Array.from(header_id.querySelectorAll('[aria-controls="search"]')).forEach(function (el) {
			el.setAttribute('href', '#' + search_id.getAttribute('id'));
			el.addEventListener('click', function (e) {
				removeTextSearch();
				compactSearch();
				e.preventDefault();
			});
			if (!isMobile) {
				el.addEventListener('mouseover', function () {
					new_css('css-search', a_css_search);
					customDropHeight();
				});
			}
		});

		// Hide #search when clicked outside;
		function hideSearch(e) {
			if (!e || !e.target) return;

			const target = e.target;
			if (!(target instanceof Element)) return;

			const c = target.closest('a[aria-controls]');
			const c1 = c !== null && c.getAttribute('aria-controls') === 'search';
			const c2 = target.closest('#search') !== null;

			if (!(c1 || c2)) {
				clearCompactSearch();
			}
		}

		function setupListener(e) {
			if (e.matches) {
				document.addEventListener('click', hideSearch);
			} else {
				document.removeEventListener('click', hideSearch);
			}
		}

		mediaMin760.addEventListener('change', setupListener);
		setupListener(mediaMin760);
	}
}
liveSearchAsync();

// Create tooltips
var schemeTooltipAsync = function(){
	var scheme_tooltip = document.querySelectorAll('.s1tt:not(.ready)');
	if (scheme_tooltip.length) {
		Array.from(scheme_tooltip).forEach(function (el, in1) {
			const innerText = el.innerHTML;
			const closestEl = el.closest('p, h1, h2, h3, h4, h5, h6');
			if (closestEl !== null) {
				closestEl.classList.add('s1tt-cont');
			}
			const icon = createElementWithClass('i', 'icon-info-circle');
			icon.setAttribute('aria-hidden', 'true');
			if (el.children[0].tagName.toLowerCase() === 'span' && !(el.getAttribute('data-panel') || el.getAttribute('data-panel'))) {
				el.setAttribute('data-index', 'tip-' + in1);
				if (el.tagName.toLowerCase() === 'a') {
					el.setAttribute('data-popup', 'tip-' + in1);
				} {
					append_url(el, 'Popup', 's1tt-popup');
					el.getElementsByClassName('s1tt-popup')[0].setAttribute('data-popup', 'tip-' + in1);
				}
				var linkedPopup = document.createElement('div');
				linkedPopup.classList.add('popup-a', 'w360', 'from-tooltip');
				linkedPopup.setAttribute('data-title', el.getAttribute('data-index'));
				linkedPopup.innerHTML = '<p>' + innerText + '</p>';
				root_id.appendChild(linkedPopup);
				el.appendChild(icon);
			} else {
				el.children[0].innerHTML = '<span class="hidden">' + innerText + '</span>';
				el.children[0].appendChild(icon);
			}
			el.classList.add('ready');
		});
	}
}
schemeTooltipAsync();

var newsletter_popup = document.querySelector('.popup-a[data-title="newsletter-popup"]');
// Popups async (move the loaded function at the top of scripts-async + delete the below if buggy)
var loadPopup = function (id) {
	loadRes(a_js_popup, function () {
		asyncCSS();
		const allPopups = document.querySelectorAll('[class^="popup-"]:not(html):not(.ready, .initialized-popup)');
		if (allPopups.length > 0 && typeof allPopups.semanticPopup === 'function' && !document.documentElement.classList.contains('spi')) {
			allPopups.semanticPopup();
		}
		openPopup(id);
		Array.from(allPopups).forEach(function (el) {
			Array.from(el.getElementsByClassName('m6tb')).forEach(function (em) {
				if (typeof semanticTabs === 'function' && !el.classList.contains('tabs-initialized')) {
					semanticTabs(em);
				}
				em.classList.add('tabs-initialized');
			});
			Array.from(el.getElementsByClassName('f8vl')).forEach(function (em) {
				validator_run(em);
			});
			Array.from(el.querySelectorAll('a[data-enable], input[data-enable], button[data-enable]')).forEach(function (em) {
				data_show_me(em);
			});
			Array.from(el.querySelectorAll('a[data-disable], input[data-disable], button[data-disable]')).forEach(function (em) {
				data_hide_me(em);
			});
			Array.from(el.querySelectorAll('a[data-toggle], input[data-toggle], button[data-toggle]')).forEach(function (em) {
				data_togg_me(em);
			});
		});
		if (cookie_popup) {
			Array.from(cookie_popup.querySelectorAll('.cookie-decline, .cookie-accept')).forEach(function (el) {
				el.addEventListener('click', function (e) {
					cookieClick(el);
					e.preventDefault();
				});
			});
		}
		if (newsletter_popup) {
			Array.from(newsletter_popup.querySelectorAll('a.close')).forEach(function (el) {
				el.addEventListener("click", function(event) {
					Cookies.set('has-newsletter', 'no', { sameSite: 'none', secure: true });
				});
			});
			newsletter_popup.querySelector('form').addEventListener("submit", function(event) {
				Cookies.set('has-newsletter', 'no', { sameSite: 'none', secure: true });
			});
		}
		if (document.getElementById(id).classList.contains('popup-blocker')) {
			html_tag.classList.add('page-blocked');
			Array.from(document.querySelectorAll('.popup-blocker a.close')).forEach(function (el) {
				var popup_delay_not_blocker = document.querySelectorAll('[data-popup-delay][data-title]:not(.popup-blocker)');
				el.addEventListener('click', function (e) {
					Cookies.set('age', 'old', { sameSite: 'none', secure: true });
					console.log("age set to old");
					html_tag.classList.remove('page-blocked');
					if (popup_delay_not_blocker.length) {
						delayHandler(popup_delay_not_blocker[0]);
					}
				});
			});
		}
	}, 'popup-loaded');
};

var popupsAsync = function() {
	var allApopups = document.querySelectorAll('a[data-popup]:not(.popup-initialized), form[data-popup]'),
		formPopups = document.querySelectorAll('form[data-popup]'),
		age_verify_popup_testmode  = general.age_verify_popup_testmode,
		newsletter_popup_testmode = general.newsletter_popup_testmode;
	function popupFocus(im) {
		setTimeout(function () {
			if (document.querySelectorAll('[data-title="' + im + '"]')[0].querySelectorAll('a, input, button, select, textarea, [role="button"]')[0] != undefined) {
				document.querySelectorAll('[data-title="' + im + '"]')[0].querySelectorAll('a, input, button, select, textarea, [role="button"]')[0].focus();
			}
		}, 100);
	}

	function delayHandler(el) {
		var proceed = false;
		if (el.getAttribute('data-title') === 'newsletter-popup') {
			if (Cookies.get('has-newsletter') != 'no' || newsletter_popup_testmode ) {
				proceed = true;
			}
		} else {
			proceed = true;
		}
		if (proceed) {
			if (parseFloat(el.getAttribute('data-popup-delay')) === 0) {
				loadPopup(el.getAttribute('data-title'));
				popupFocus(el.getAttribute('data-title'));
			} else {
				setTimeout(function () {
					loadPopup(el.getAttribute('data-title'));
					popupFocus(el.getAttribute('data-title'));
				}, el.getAttribute('data-popup-delay'));
			}
		}
	}

	for (var i = 0; i < allApopups.length; i++) {
		allApopups[i].classList.add('popup-initialized');
		allApopups[i].addEventListener('click', function (event) {
			event.preventDefault();
			loadPopup(this.getAttribute('data-popup'));
			popupFocus(this.getAttribute('data-popup'));
		});
		Array.from(formPopups).forEach(function (el) {
			if (!el.classList.contains('f8vl')) {
				el.addEventListener('submit', function (event) {
					event.preventDefault();
					loadPopup(this.getAttribute('data-popup'));
					popupFocus(this.getAttribute('data-popup'));
				});
			}
		});
	}
	var popup_delay = document.querySelectorAll('[data-popup-delay][data-title]'),
		popup_after = document.querySelectorAll('[data-popup-after][data-title]');

	if (popup_after.length) {
		Array.from(popup_after).forEach(function (el) {
			var otherPopups = document.querySelectorAll('[data-title]:not(.page-blocker, [data-popup-after])');


			if (!el.classList.contains('popup-blocker') && Cookies.get(el.dataset.title + 16) === undefined) {
				Array.from(otherPopups).forEach(function (em) {
					if (em.dataset.popupDelay !== undefined) {
						em.classList.add('has-delay');
						em.removeAttribute('data-popup-delay');
					}
				});
			}

			document.addEventListener('click', function (event) {
				if (event.target.tagName.toLowerCase() === 'a' && event.target.classList.contains('close') && event.target.closest('[data-popup-after]') !== null) {
					loadPopup(el.dataset.popupAfter);
				}
			});
		});
	}

	var popup_delay = document.querySelectorAll('[data-popup-delay][data-title]');
	if (popup_delay.length) {
		Array.from(popup_delay).forEach(function (el) {
			if (el.classList.contains('popup-blocker')) {
				if (Cookies.get('age') === undefined || age_verify_popup_testmode) {
					delayHandler(el);
				} else if (document.querySelectorAll('[data-popup-delay][data-title]:not(.popup-blocker)')[0]) {
					delayHandler(document.querySelectorAll('[data-popup-delay][data-title]:not(.popup-blocker)')[0]);
				}
			} else {
				if (!document.getElementsByClassName('popup-blocker').length) {
					delayHandler(el);
				}
			}
		});
	}
}
popupsAsync();

function l4cl_scroll(el) {
	if (el.classList.contains('hr') && el.clientHeight < el.scrollHeight) {
		el.classList.add('is-scrollable');
	}
}
// .l4cl
var listScrollableAsync = function() {
	var list_collection = document.querySelectorAll('.l4cl:not(.l4cl-initialized, .l4cl-hold)');
	if (list_collection.length) {
		Array.from(list_collection).forEach(function (el) {
			el.classList.add('l4cl-initialized');
			var data_li = el.querySelectorAll('li');

			if (data_li.length) {
				Array.from(data_li).forEach(function (em) {
					var data_img = em.querySelectorAll('.check.color li[data-img]'),
						any_img = em.querySelectorAll('img:not(.color-variant-img)'),
						in_slider = em.querySelectorAll('picture.slider')[0],
						in_slider_img,
						first_img = any_img[0],
						second_img = first_img;

					if (em.querySelectorAll('picture ~ picture').length && em.classList.contains('second-img-hover')) {
						if (em.classList.contains('second-img-first')) {
							first_img = em.querySelectorAll('picture ~ picture img')[0];
							second_img = em.querySelectorAll('picture img')[0];
						} else {
							first_img = em.querySelectorAll('picture img')[0];
							second_img = em.querySelectorAll('picture ~ picture img')[0];
						}
					}
					if (data_img.length && first_img !== undefined) {
						if (first_img !== undefined) {
							em.addEventListener('mouseover', function () {
								Array.from(em.querySelectorAll('picture img')).forEach(function (eo) {
									if (!eo.hasAttribute('data-src-initial')) {
										eo.setAttribute('data-src-initial', eo.getAttribute('src'));
									}
									if (!eo.hasAttribute('data-srcset-initial') && eo.hasAttribute('srcset')) {
										eo.setAttribute('data-srcset-initial', eo.getAttribute('srcset'));
									}
								});
							});
							em.addEventListener('mouseleave', function () {
								Array.from(em.querySelectorAll('picture img')).forEach(function (eo) {
									eo.setAttribute('src', eo.getAttribute('data-src-initial'));
									if (eo.hasAttribute('data-srcset-initial')) {
										eo.setAttribute('srcset', eo.getAttribute('data-srcset-initial'));
									}
								});
							});
						}
						if (in_slider !== undefined) {
							Array.from(data_img).forEach(function (en) {
								en.addEventListener('mouseover', function () {
									var in_slider_img = em.querySelectorAll('.swiper-slide-active')[0];
									if (in_slider_img !== undefined) {
										Array.from(em.querySelectorAll('.swiper-slide-active img')).forEach(function (eo) {
											eo.setAttribute('src', en.getAttribute('data-img'));
											if (eo.hasAttribute('srcset')) {
												eo.removeAttribute('srcset');
											}
										});
									}
								});
							});
						}
						Array.from(data_img).forEach(function (en) {
							en.addEventListener('mouseover', function () {
								Array.from(any_img).forEach(function (eo) {
									eo.setAttribute('src', en.getAttribute('data-img'));
									if (eo.hasAttribute('srcset')) {
										eo.removeAttribute('srcset');
									}
								});
							});
						});
					}
				});
			}
			if (el.parentNode.tagName.toLowerCase() === 'li') {
				el.parentNode.classList.add('l4cl-container');
			}
			l4cl_scroll(el);
			window.addEventListener('resize', throttle(() => {
				l4cl_scroll(el);
			}, 500));

			Array.from(el.querySelectorAll('figure')).forEach(function (em) {
				if (em.querySelectorAll('.link-btn a, input, button').length) {
					em.classList.add('has-form');
				}
			});
			Array.from(el.querySelectorAll('picture.slider')).forEach(function (em) {
				var closestFig = em.closest('figure'),
					closestLi = em.closest('li');

				if (closestFig !== null && closestLi !== null) {
					function initializeSlider() {
						if (!closestFig.classList.contains('slider-ready')) {
							randomize(closestFig);
							create_slider(em, {
								direction: 'horizontal',
								allowTouchMove: false,
								loop: true,
								autoHeight: true,
								slidesPerView: 1,
								spaceBetween: 1,
								lazy: {
									loadPrevNext: true
								},
								navigation: {
									nextEl: '[data-random="' + closestFig.getAttribute('data-random') + '"] .swiper-button-next',
									prevEl: '[data-random="' + closestFig.getAttribute('data-random') + '"] .swiper-button-prev'
								},
                on: {
                  slideChangeTransitionEnd: function () {
                    Array.from(closestFig.querySelectorAll('[src][data-src-initial]')).forEach(function (eo) {
                      eo.setAttribute('src', eo.getAttribute('data-src-initial'));
                      if (eo.hasAttribute('data-srcset-initial')) {
                        eo.setAttribute('srcset', eo.getAttribute('data-srcset-initial'));
                      }
                    });
                  }
                }
							});
						}
						closestFig.classList.add('slider-ready');
					}
					closestLi.addEventListener('mouseenter', function () {
						initializeSlider();
					});

					function io(entries) {
						entries.map((entry) => {
							if (entry.isIntersecting) {
								initializeSlider();
							}
						});
					}
					new IntersectionObserver(io).observe(closestLi);
				}

			});
		});
	}
};
listScrollableAsync();

// .n6as (collection)
var navAsideAsync = function() {
	var nav_aside = document.querySelectorAll('.n6as a.toggle:not(.n6as-initalized), .n6as .inactive > a:not(.n6as-initalized)');
	if (nav_aside.length) {
		nav_aside.forEach(function (el) {
			el.classList.add('n6as-initalized');
			el.parentElement.classList.add('sub');
			el.addEventListener('click', function (e) {
				toggle_dropdowns_simple(el.parentElement);
				e.preventDefault();
			});
		});
	}
}
navAsideAsync();

function removeClassByPrefix(node, prefix) {
	var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
	node.className = node.className.replace(regx, '');
	return node;
}

// Grid or list view
var saveCollectionview = function(attribute, value) {
	config = {
		method: 'POST',
		body: JSON.stringify({
			attributes: {
				[attribute]: value
			}
		}),
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
			'Accept': 'application/javascript'
		}
	};
	fetch(routes.cart_update_url, config)
		.then((response) => response.json())
		.then((response) => {
			if (response.status) {
				handleErrorMessage(response.description);
				return;
			}
		})
		.catch((error) => {
			console.log("saveCollectionview error", error);
		});
}

var gridListSwitchAsync = function() {
	var form_sort = document.getElementsByClassName('f8sr'),
		form_sort_list_view,
		form_sort_list_inline;
	if (form_sort.length) {
		Array.from(form_sort).forEach(function (form_cont) {
			form_sort_list_view = form_cont.getElementsByClassName('l4vw'),
				form_sort_list_inline = form_cont.getElementsByClassName('l4in');

			if (form_sort_list_view.length) {
				Array.from(form_sort_list_view).forEach(function (el) {
					html_tag.classList.add('t1cl');
					if (el.getAttribute('aria-controls') !== null) {
						var im = el,
							view_item = el.querySelectorAll('li'),
							view_list = document.getElementById(im.getAttribute('aria-controls'));
						el.querySelectorAll('a > i[class*="icon-view-"]').forEach(function (el) {
							el.parentElement.addEventListener('click', function (e) {
								view_item.forEach(function (el) {
									el.classList.remove('active');
								});
								if (el.classList.contains('icon-view-list')) {
									view_list.classList.add('hr');
									form_cont.classList.add('hr');
									im.querySelectorAll('a > i.icon-view-list').forEach(function (el) {
										el.closest('li').classList.add('active');
									});
									saveCollectionview('collection_layout', 'list');
								}
								if (el.classList.contains('icon-view-grid')) {
									view_list.classList.remove('hr');
									form_cont.classList.remove('hr');
									im.querySelectorAll('a > i.icon-view-grid').forEach(function (el) {
										el.closest('li').classList.add('active');
									});
									saveCollectionview('collection_layout', 'grid');
								}
								e.preventDefault();
							});
						});
					}
				});
			}

			if (form_sort_list_inline.length) {
				Array.from(form_sort_list_inline).forEach(function (el) {
					if (el.getAttribute('aria-controls') !== null) {
						var im = el,
							view_item = el.querySelectorAll('li'),
							view_list = document.getElementById(im.getAttribute('aria-controls'));
						el.querySelectorAll('input').forEach(function (el) {
							el.parentElement.addEventListener('click', function (e) {
								removeClassByPrefix(view_list, 'width-');
								view_list.classList.add(el.getAttribute('data-width'));
								saveCollectionview('collection_grid_view', el.getAttribute('data-width'));
							});
						});
					}
				});
			}
		});
	}
}
gridListSwitchAsync();

// .f8fl (collection)
var formFilterAsync = function() {
	var form_filter = document.getElementsByClassName('f8fl');
	if (form_filter.length) {
		Array.from(form_filter).forEach(function (el) {
			var cl = el.closest('.m6pn');
			html_tag.classList.add('t1cl');
			append_url(el, closeText, 'f8fl-toggle');
			if (el.hasAttribute('id')) {
				Array.from(document.querySelectorAll('[href="#' + el.getAttribute('id') + '"]')).forEach(function (el) {
					el.classList.add('f8fl-toggle');
				});
			}
			Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(function (em) {
				append_url(em, closeText, 'header-toggle');
				em.querySelector('a.header-toggle').addEventListener('click', function (e) {
					toggle_dropdowns_simple(em);
					countPrefixSuffix();
					var st = el.getElementsByClassName('sticky-in-panel')[0];

					if (cl !== null) {
						if (cl.scrollHeight > cl.clientHeight) {
							cl.classList.add('has-scrollbar');
						}
					}
					if (!em.hasAttribute('id')) {
						e.preventDefault();
					}
				});
			});
		});
		Array.from(document.getElementsByClassName('f8fl-toggle')).forEach(function (el) {
			el.setAttribute('aria-controls', 'filter');
		});
		Array.from(document.querySelectorAll('a[aria-controls="filter"]')).forEach(function (el) {
			el.addEventListener('click', function (e) {
				getStickyFooters();
				html_tag.classList.add('has-filters');
				if (html_tag.classList.contains('f8fl-open')) {
					html_tag.classList.remove('f8fl-open');
					setTimeout(function () {
						html_tag.classList.remove('f8fl-open2');
					}, 500);
				} else {
					html_tag.classList.add('f8fl-open', 'f8fl-open2');
				}
				new_css('css-panels', a_css_panels);
				e.preventDefault();
			});
		});
	}
}
formFilterAsync();

	// .input-range (collection)
var rangeSliderAsync = function() {
	var input_range = document.querySelectorAll('.input-range:not(.input-range-initialized)'),
		input_range_steps = document.querySelectorAll('.input-range-steps:not(.input-range-steps-initialized)');

	if (input_range_steps.length) {
		Array.from(input_range_steps).forEach(function (el) {
			el.classList.add('input-range-steps-initialized');
			Array.from(el.children).forEach(function (el) {
				el.innerHTML = '<span class="inner">' + el.innerHTML + '</span>';
			});
		});
	}
	if (input_range.length) {
		loadRes(a_js_sliders, function () {
			new_css('form-sliders-css', a_css_ui_sliders);
			Array.from(input_range).forEach(function (el) {
				el.classList.add('input-range-initialized');
				el.appendChild(createElementWithClass('div', 'range-inner'));
				var data_min = el.querySelectorAll('input[min]')[0],
					data_max = el.querySelectorAll('input[max]')[0],
					data_el = el.querySelectorAll('input')[0],
					evt = new Event('change'),
					opt_connect = true,
					opt_start = [parseFloat(data_min.value), parseFloat(data_max.value)];

				if (el.classList.contains('single')) {
					opt_connect = 'lower';
					data_min = data_el;
					data_max = data_min;
					opt_start = parseFloat(data_el.value);
				}
				if (!el.classList.contains('slider-is-here')) {
					el.querySelectorAll('.range-inner').forEach(function (eo) {
						noUiSlider.create(eo, {
							start: opt_start,
							connect: opt_connect,
							step: 1,
							direction: global_dir[0],
							range: {
								'min': [parseFloat(data_min.getAttribute('min'))],
								'max': [parseFloat(data_max.getAttribute('max'))]
							}
						});
						eo.noUiSlider.on('update', function (values, handle) {
							if (handle) {
								data_max.value = parseFloat(values[handle]).toFixed();
							} else {
								data_min.value = parseFloat(values[handle]).toFixed();
							}
						});
						eo.noUiSlider.on('change', function (handle) {
							if (handle) {
								data_max.dispatchEvent(evt);
							} else {
								data_min.dispatchEvent(evt);
							}
						});
						Array.from(eo.querySelectorAll('[role="slider"]')).forEach(function (em) {
							em.setAttribute('aria-label', 'slider');
						});
						el.querySelectorAll('input').forEach(function (en) {
							en.addEventListener('keyup', function () {
								if (en.hasAttribute('min')) {
									eo.noUiSlider.set([parseFloat(en.value), null]);
								} else if (en.hasAttribute('max')) {
									eo.noUiSlider.set([null, parseFloat(en.value)]);
								}
							});
						});
					});
				}
				el.classList.add('slider-is-here');
			});
		}, 'sliders-loaded');
	}
}
rangeSliderAsync();

var masonry = function() {
  // Masonry, .l4ft (index)
  var list_featured = document.getElementsByClassName('l4ft');
  if (list_featured.length) {
    loadRes(a_js_masonry, function () {
      Array.from(list_featured).forEach(function (el) {

        if (el.classList.contains('masonry')) {
          el.classList.add('masonry-initialized');
          var msnry = new Masonry(el, {
            itemSelector: 'li',
            originLeft: global_dir[1],
            percentPosition: true,
			transitionDuration: 0
          });

          if (el.classList.contains('masonry-initialized')) {
            function io(entries) {
              entries.map((entry) => {
				  if (entry.isIntersecting && !el.classList.contains('in-view')) {
					  msnry.reloadItems();
					  el.classList.add('in-view');
				  }
              });
            }
            new IntersectionObserver(io).observe(el);
          }
			window.addEventListener('resize', throttle(() => {
				msnry.reloadItems();
			}, 500));
        }
      });
    }, 'masonry-loaded');
  }
}
masonry()

var headerAsync = function () {
	header_id = document.getElementsByClassName('shopify-section-header')[0];
	header_outer = document.getElementById('header-outer');
	header_inner = document.getElementById('header-inner');
	top_bar = document.getElementsByClassName('shopify-section-announcement-bar')[0];
	nav_outer = document.getElementById('nav-outer');
	nav_top_id = document.getElementById('nav-top');
	search_id = document.getElementById('search');
	if (nav_outer) {
		Array.from(getSiblings(nav_outer)).forEach(function (el) {
			if (el.getAttribute('id') === 'search') {
				el.classList.add('compact');
			}
		});
	}

	function toggleDay() {
		if (html_tag.classList.contains('day-switched')) {
			Cookies.set('darkmode', 'off', { sameSite: 'none', secure: true });
			html_tag.classList.remove('day-switched');
		} else {
			html_tag.classList.add('day-switched');
			Cookies.set('darkmode', 'on', { sameSite: 'none', secure: true });
		}
	}

	if (header_outer) {
		var link_day = document.getElementsByClassName('link-day');
		if (link_day.length) {
			Array.from(link_day).forEach(function (el) {
				el.parentElement.classList.add('link-day-container');
			});
		}
		document.addEventListener('click', function (event) {
			if (event.target.matches('a.link-day, a.link-day *')) {
				toggleDay();
				event.preventDefault();
			}
		});
		document.addEventListener('keyup', function (event) {
			if (event.key === ' ') {
				if (event.target.matches('a.link-day, a.link-day *')) {
					toggleDay();
					event.preventDefault();
				}
			}
		});

		// Closable top bar
		var topBarAsync = function () {
			var top_bar = document.getElementsByClassName('shopify-section-announcement-bar');
			if (top_bar.length) {
				Array.from(top_bar).forEach(function (el) {
                  if (el.children.length > 0) {
					  append_url(el.children[0], closeText, 'close');
					el.querySelector('a.close').addEventListener('click', function (e) {
						el.parentNode.removeChild(el);
						if (window.Shopify !== undefined && !Shopify.designMode) {
							Cookies.set('notice', 'closed', { sameSite: 'none', secure: true });
						}
						distance_counter.style.top = le.getBoundingClientRect().top + window.scrollY + sa + 'px';
						e.preventDefault();
					});
					if (Cookies.get('notice') === 'closed') {
						if (el.parentNode !== null) {
							el.parentNode.removeChild(el);
						}
					} else {
						new_css('announcement-css', a_css_announcement);
					}
					append_url(el, closeText, 'overlay-close');
                  }
				});
			}
		};
		topBarAsync();

		var sa, le, distance_counter, distance_spacer;

		if (nav_outer && nav_outer.classList.contains('sticky')) {
			le = nav_outer;
		} else {
			le = header_outer;
		}

		html_tag.setAttribute('data-fixed', le.getAttribute('id'));

		function io(entries) {
			entries.map((entry) => {
				if (entry.isIntersecting) {
					html_tag.classList.remove('fixed-sticky');
					le.classList.remove('fixed');
				} else {
					html_tag.classList.add('fixed-sticky');
					le.classList.add('fixed');
					if (le.id === 'nav') {
						function ovClose() {
							if (mediaMin1000.matches) {
								overlayClose(true);
							}
						}

						ovClose();
						mediaMin1000.addEventListener('change', ovClose);
					}
					new_css('css-menu', a_css_menu);
					customDropHeight();
				}
			});
		}

		distance_counter = document.getElementById('distance-counter');
		distance_spacer = document.getElementById('distance-spacer');
		if (distance_counter == null) {
			distance_counter = document.createElement('div');
			distance_counter.setAttribute('id', 'distance-counter');
		}
		le.before(distance_counter);


		let distanceSpacerCreated = false;

		function createDistanceSpacer() {
			if (!distanceSpacerCreated) {
				const distance_spacer = document.createElement('div');
				distance_spacer.setAttribute('id', 'distance-spacer');

				distance_spacer.style.height = le.clientHeight + 'px';

				le.after(distance_spacer);

				distanceSpacerCreated = true;
			}
		}
		if (!isMobile) {
			document.addEventListener('mouseover', createDistanceSpacer);
		}

		document.addEventListener('keyup', createDistanceSpacer);
		document.addEventListener('touchstart', createDistanceSpacer);
		document.addEventListener('scroll', createDistanceSpacer);


		window.addEventListener('resize', throttle(() => {
			const distance_spacer = document.getElementById('distance-spacer');
			if (distance_spacer) {
				distance_spacer.style.height = le.clientHeight + 'px';
			}
		}, 500));


		if (link_day.length) {
			Array.from(link_day).forEach(function (el) {
				el.addEventListener('click', function (e) {
					const distance_spacer = document.getElementById('distance-spacer');
					if (distance_spacer) {
						distance_spacer.style.height = le.clientHeight + 'px';
					}
				});
			});
		}

		if (header_outer && !header_outer.classList.contains('no-sticky')) {
			new IntersectionObserver(io, {
			}).observe(distance_counter);
		} else {
			html_tag.classList.add('t1st');
			html_tag.classList.remove('fixed-sticky');
		}
	}

	if (header_id) {
		append_url(root_id, closeText, 'overlay-close');
		if (header_outer) {
			append_url(header_inner, closeText, 'overlay-close');
		}
		if (nav_outer) {
			append_url(nav_outer, closeText, 'overlay-close');
		}
		if (search_id) {
			if (nav_top_id) {
				append_url(nav_top_id, closeText, 'overlay-close');
			}
		}
		if (header_outer) {
			append_url(header_outer, closeText, 'overlay-close');
		}
		Array.from(document.querySelectorAll('a.overlay-close')).forEach(function (el) {
			el.addEventListener('click', function (e) {
				overlayClose();
				e.preventDefault();
			});
		});
	}
}
headerAsync();

// Countdown timer
var countdownAsync = function () {
	var countdown_tag = document.querySelectorAll('.countdown:not(.countdown-initialized)');

	if (countdown_tag.length) {
		loadRes(a_js_countdown, function () {
			Array.from(countdown_tag).forEach(function (el) {
				el.classList.add('countdown-initialized');
				var container = el.closest('li, article'),
					now = new Date(),
					nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()),
					show_until = new Date(el.getAttribute('data-show-until')),
					show_from = new Date(el.getAttribute('data-show-from')),
					show_days = el.getAttribute('data-show-days'),
					word_day,
					word_days,
					word_hour,
					word_hours,
					word_min,
					word_mins,
					word_sec,
					word_secs;

				var ended = function() {
					if (container.querySelector('.countdown-ended-show') !== null) {
						el.remove();
						container.querySelector('.countdown-ended-hide').remove();
						container.querySelector('.countdown-ended-show').classList.remove('hidden');
					} else {
						container.remove();
					}
				}
				if (show_from > now || now > show_until || !show_days.includes(nowUTC.getDay())) {
					ended();
					return;
				}

				el.innerHTML = '<span class="hidden">' + el.innerHTML + '</span>';

				if (el.getAttribute('data-day') !== null) {
					word_day = el.getAttribute('data-day');
				} else {
					word_day = 'day';
				}
				if (el.getAttribute('data-days') !== null) {
					word_days = el.getAttribute('data-days');
				} else {
					word_days = 'days';
				}
				if (el.getAttribute('data-hour') !== null) {
					word_hour = el.getAttribute('data-hour');
				} else {
					word_hour = 'hour';
				}
				if (el.getAttribute('data-hours') !== null) {
					word_hours = el.getAttribute('data-hours');
				} else {
					word_hours = 'hours';
				}
				if (el.getAttribute('data-minute') !== null) {
					word_min = el.getAttribute('data-minute');
				} else {
					word_min = 'minute';
				}
				if (el.getAttribute('data-minutes') !== null) {
					word_mins = el.getAttribute('data-minutes');
				} else {
					word_mins = 'minutes';
				}
				if (el.getAttribute('data-second') !== null) {
					word_sec = el.getAttribute('data-second');
				} else {
					word_sec = 'second';
				}
				if (el.getAttribute('data-seconds') !== null) {
					word_secs = el.getAttribute('data-seconds');
				} else {
					word_secs = 'seconds';
				}

				function renderMe() {
					if (!el.classList.contains('done')) {
						simplyCountdown(el, {
							year: show_until.getFullYear(),
							month: show_until.getMonth() + 1,
							day: show_until.getDate(),
							hours: show_until.getHours(),
							minutes: show_until.getMinutes(),
							seconds: show_until.getSeconds(),
							enableUtc: false,
							zeroPad: true,
							onEnd: function() {
								ended();
							},
							words: {
								days: {
									singular: word_day,
									plural: word_days
								},
								hours: {
									singular: word_hour,
									plural: word_hours
								},
								minutes: {
									singular: word_min,
									plural: word_mins
								},
								seconds: {
									singular: word_sec,
									plural: word_secs
								}
							}
						});
						el.classList.add('done');
						container.classList.add('done');
					}

				}
				renderMe();
			});
		}, 'countdown-loaded');
	}
};
countdownAsync();

function updateSliders(el) {
	if (el.classList.contains('s4wi')) {
		var sl_el = el.querySelector('.swiper-outer');

		function io(entries) {
			entries.map((entry) => {
				if (entry.isIntersecting) {
					if (sl_el.swiper !== null) {
						sl_el.swiper.updateAutoHeight();
					}
				}
			});
		}
		new IntersectionObserver(io).observe(el);
		setTimeout(function () {
			if (sl_el.swiper !== null && sl_el.swiper !== undefined) {
				sl_el.swiper.updateAutoHeight();
			}
		}, 300);
	}
}

var updateSlidersAsync = function () {
	var list_collection_slider = document.querySelectorAll('.l4cl.slider:not(.in-popup)');
	if (list_collection_slider.length) {
		Array.from(list_collection_slider).forEach(function (em) {
			updateSliders(em);
		});
	}

	var module_featured = document.querySelectorAll('.m6fr');
	if (module_featured.length) {
		Array.from(module_featured).forEach(function (em) {
			updateSliders(em);
		});
	}
};
updateSlidersAsync();

function countUs(element) {
	if (element.children.length === element.querySelectorAll('li.hidden').length) {
		element.classList.add('all-hidden');
	} else {
		element.classList.remove('all-hidden');
	}
}

// Floating alerts (l4al)
var listAlertsAsync = function() {
	var list_alerts = document.getElementsByClassName('l4al');
	if (list_alerts.length) {
		Array.from(list_alerts).forEach(function (em) {
			countUs(em);
			Array.from(em.querySelectorAll('li:not(.list-alerts-item-initialized)')).forEach(function (el) {
				el.classList.add('list-alerts-item-initialized');
				append_url(el, closeText, 'close');
				if (em.parentNode.id === 'root' || em.hasAttribute('data-delay')) {
					var dl = 5000;
					if (em.hasAttribute('data-delay')) {
						dl = parseFloat(em.getAttribute('data-delay'));
					}
					setTimeout(function () {
						el.classList.add('fade-me-out');
					}, dl);
					setTimeout(function () {
						el.classList.add('hidden');
						countUs(em);
					}, dl + 400);
				}
			});
		});
	}
};
listAlertsAsync();

function closeAlerts() {
	Array.from(document.querySelectorAll('.l4al a.close')).forEach(function (el) {
		var em = el.closest('.l4al');
		el.addEventListener('click', function (e) {
			if (em.parentNode.id === 'root') {
				el.closest('li').classList.add('fade-me-out');
				setTimeout(function () {
					el.closest('li').classList.add('hidden');
					countUs(em);
				}, 400);
			} else {
				el.closest('li').classList.add('hidden');
				countUs(em);
			}
			e.preventDefault();
		});
	});
}
closeAlerts();

// Print page
var link_print = document.getElementsByClassName('link-print');
if (link_print.length) {
	Array.from(link_print).forEach(function (el) {
		el.addEventListener('click', function (e) {
			new_css('css-print', a_css_print, 'print');
			setTimeout(function () {
				window.print();
			}, 400);
			e.preventDefault();
		});
	});
}

document.addEventListener('keydown', function (event) {
	if ((event.ctrlKey || event.metaKey) && (event.key === 'p' || event.keyCode === 80)) {
		new_css('css-print', a_css_print, 'print');
	}
});

var linkCopyAsync = function() {
	var link_copy = document.querySelectorAll('a[data-copy]');
	if (link_copy.length) {
		const copyToClipboardAsync = str => {
			if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
				return navigator.clipboard.writeText(str);
			}
			return Promise.reject('The Clipboard API is not available.');
		};
		Array.from(link_copy).forEach(function (el) {
			el.addEventListener('click', function (e) {
				el.classList.add('clicked');
				copyToClipboardAsync(el.dataset.copy);
				setTimeout(function () {
					el.classList.remove('clicked');
				}, 2000);
				e.preventDefault();
			});
		});
	}
}
linkCopyAsync();

// has-more toggles fancybox
var fancyboxAsync = function() {
	var swipper_bullets = document.querySelectorAll('a.swiper-pagination-bullet');
	Array.from(swipper_bullets).forEach(function (el, index) {
		el.addEventListener('click', function (e) {
			if (el.classList.contains('has-more')) {
				var data_fancybox = document.querySelectorAll('[data-fancybox]');
				data_fancybox[index].click();
			}
			return true;
		});
	});

	// Fancybox
	// let fancyboxInstance = null;
	function createFancyboxAndShowItem(itemIndex, fancyName) {

		// Enable/disable swipe support for fancybox based on the type of the displayed item
		function toogleTouchSupportOnItem(item, fancybox) {
			var touchStateForItem = true;
			if (item.type !== "image") {
				touchStateForItem = false;
			}

			if (fancybox.Carousel.Panzoom.options.touch !== touchStateForItem) {
				fancybox.Carousel.Panzoom.options.touch = touchStateForItem;
				fancybox.Carousel.updatePanzoom();
			}
		}
		const showItems = [];
		const all_items = document.querySelectorAll(`[data-fancybox="${fancyName}"]`);
		var item,
			fbox;

		all_items.forEach(item => {
			let src_type = null;
			const hrefItem = item.getAttribute('href');
			let thumbImg = null;
			const caption = item.getAttribute('data-caption');
			const alt = item.getAttribute('data-alt');
			const title = item.getAttribute('data-title');

			// Find the first relevant media element (img, video, or model-viewer)
			const mediaElement = item.querySelector('img, video, model-viewer');

			if (mediaElement) {
				const tagName = mediaElement.tagName.toLowerCase();
				if (tagName === 'img') {
					thumbImg = mediaElement.getAttribute('data-src') || mediaElement.getAttribute('src');
				} else if (tagName === 'video' || tagName === 'model-viewer') {
					thumbImg = mediaElement.getAttribute('poster');
				}
			}

			// Determine src_type based on file extension or domain
			if (endsWithAny(['jpg', 'jpeg', '.gif', '.png', '.webp'], hrefItem)) {
				src_type = 'image';
			} else if (hrefItem.includes('youtube.com/watch') || hrefItem.includes('vimeo.com/')) {
				src_type = 'video';
			} else if (endsWithAny(['mp4', 'webm', 'ogg'], hrefItem)) {
				src_type = 'html5video';
			}

			// Avoid duplication in showItems
			if (!showItems.some(_item => _item.src === hrefItem)) {
				showItems.push({
					src: hrefItem,
					type: src_type,
					preload: false,
					animated: false,
					caption: caption,
					thumb: thumbImg,
					zoom: false,
					baseClass: 'myCustomClass'
				});
			}
		});
		fbox = new Fancybox(showItems, {
			startIndex: itemIndex || 0,
			Carousel: {
				Panzoom: {
					touch: true
				}
			},
			Html: {
				video: {
					autoplay: false
				}
			},
			thumbs: {
				autoStart: true,
			},
			slug: 'gallery',
			hash: true,

			on: {
				ready: function (_fancybox) {
					//console.log(_fancybox);
					toogleTouchSupportOnItem(_fancybox.items[_fancybox.Carousel.page], _fancybox);
					// show thumbs
					_fancybox.plugins.Thumbs.toggle();
					if (_fancybox.plugins.Thumbs.state == 'hidden') {
						_fancybox.plugins.Thumbs.show();
					}
				},
				done: function (_fancybox, carousel, slide) {
					// check if there's model-viewer
					var slides = _fancybox.$container.querySelectorAll('div.fancybox__thumbs div.carousel__slide'),
						all_items = document.querySelectorAll('[data-fancybox]'),
						getClass = _fancybox.$container.querySelectorAll('.fancybox__slide.is-selected')[0];
					if (slides.length < all_items.length) {
						return;
					}
					all_items.forEach(function (el, index) {
						if (el.querySelectorAll('model-viewer').length > 0) {
							if (slides.length > index) {
								slides[index].classList.add("has-cube");
							}
						}
					});
					//fbox.updatePage()
					if (getClass !== undefined) {
						_fancybox.$container.setAttribute('data-class', getClass.getAttribute('class'));
						if (getClass.querySelector('video')) {
							getClass.querySelector('video').play();
						}
					}
				},
				"Carousel.change": function (_fancybox, carousel, slide) {
					var getClass;
					setTimeout(function () {
						getClass = _fancybox.$container.querySelectorAll('.fancybox__slide.is-selected')[0];
						if (getClass !== undefined) {
							_fancybox.$container.setAttribute('data-class', getClass.getAttribute('class'));
							if (getClass.querySelector('video')) {
								getClass.querySelector('video').play();
							}
						}
					}, 100);
					toogleTouchSupportOnItem(_fancybox.items[carousel.page], _fancybox);
				}
			}
		});
		//fancyboxInstance = fbox;
	}

	const data_fancybox = document.querySelectorAll('[data-fancybox]:not(.fancybox-initialized)');
	if (data_fancybox.length) {
		data_fancybox.forEach((el, index) => {
			el.classList.add('fancybox-initialized');
			const hrefItem = el.getAttribute('href');

			if (hrefItem.includes('youtube.com/watch') || hrefItem.includes('vimeo.com/')) {
				el.setAttribute('data-type', 'video');
			} else if (endsWithAny(['mp4', 'webm', 'ogg'], hrefItem)) {
				el.setAttribute('data-type', 'html5video');
			}

			const fancybox_name = el.getAttribute('data-fancybox');
			const zoom = el.getAttribute('data-zoom');

			const fancyClick = (e) => {
				e.preventDefault();

				if (zoom === 'false') {
					html_tag.classList.add('fb-no-zoom');
				}

				let itemIndex = 0;
				if (fancybox_name) {
					const list = [...document.querySelectorAll(`[data-fancybox="${fancybox_name}"]`)];
					itemIndex = list.indexOf(el);

					list.forEach(model => {
						model.querySelectorAll('model-viewer').forEach(viewer => {
							viewer.addEventListener('click', (e) => {
								e.preventDefault();
								e.stopPropagation();
								e.cancelBubble = true;
							});
						});
					});
				}

				loadRes(a_js_fancybox, () => {
					new_css('css-fancybox', a_css_fancybox);
					createFancyboxAndShowItem(itemIndex, fancybox_name);
				}, 'fancybox-loaded');

				el.removeEventListener('click', fancyClick);
			};
			el.removeEventListener('click', fancyClick);
			el.addEventListener('click', fancyClick);
		});

		document.addEventListener('click', (event) => {
			if (event.target.closest('.carousel__button.fancybox__button--close')) {
				html_tag.classList.remove('fb-no-zoom');
			}
		});
	}
}
fancyboxAsync();


const anchor_element = document.querySelectorAll('[id^="section-"]');
if (anchor_element.length) {
	Array.from(anchor_element).forEach(el => {
		if (!el.classList.contains('has-anchor') && !el.classList.contains('anchor')) {
			const anchor_tag = createElementWithClass('span', 'anchor');
			anchor_tag.id = el.id;
			el.classList.add('has-anchor');
			el.removeAttribute('id');
			el.append(anchor_tag);
		}
	});
}

var accordionAsync = function() {
	const accordion_a = document.querySelectorAll('.accordion-a > div');
	if (accordion_a.length) {
		Array.from(accordion_a).forEach(el => {
			if (!el.classList.contains('accordion-initialized')) {
				el.classList.add('accordion-initialized');
				append_url(el.children[0], toggleText, 'acc-toggle');

				el.querySelector('.acc-toggle').addEventListener('click', (e) => {
					el.classList.toggle('open');
					e.preventDefault();
				});
			}
		});
	}
};
accordionAsync();

var accordionLabelAsync = function() {
	const accordionLabel = document.querySelectorAll('.accordion-a summary label:not(.accordion-initialized)');
	if (accordionLabel.length) {
		Array.from(accordionLabel).forEach(el => {
			el.classList.add('accordion-initialized');
			el.closest('summary').addEventListener('click', function (e) {
				const detailsElement = el.closest('details');
				if (detailsElement && !detailsElement.open) {
					const inputElement = detailsElement.querySelector('div input:not([type="checkbox"]):not([type="radio"])');
					if (inputElement) {
						setTimeout(function () {
							inputElement.focus();
						}, 0);
					}
				}
			});
		});
	}
};
accordionLabelAsync();

const shopify_default_css = document.getElementById('shopify-dynamic-checkout');
if (shopify_default_css) {
	shopify_default_css.remove();
}


if (!html_tag.classList.contains('scrolled')) {
	window.addEventListener('resize', throttle(() => {
		html_tag.classList.remove('scrolled');
	}, 500));
	window.addEventListener('scroll', function () {
		html_tag.classList.add('scrolled');
		if (window.pageYOffset > window.innerHeight) {
			html_tag.classList.add('scr-down');
		} else {
			html_tag.classList.remove('scr-down');
		}
	});
}

function checkHeight(el) {
	if (el.scrollHeight > el.clientHeight) {
		el.classList.add('high');
	} else {
		el.classList.remove('high');
	}
}
var moduleLimitAsync = function() {
	const module_limit = document.getElementsByClassName('m6lm');
	if (module_limit.length) {
		Array.from(module_limit).forEach(el => {
			checkHeight(el);
			window.addEventListener('resize', throttle(() => {
				checkHeight(el);
			}, 500));
		});
	}
};
moduleLimitAsync();

var nextUntil = function (elem, selector, filter) {
	var siblings = [];
	elem = elem.nextElementSibling;
	while (elem) {
		if (elem.matches(selector)) {
			break;
		}
		if (filter && !elem.matches(filter)) {
			elem = elem.nextElementSibling;
			continue;
		}
		siblings.push(elem);
		elem = elem.nextElementSibling;
	}
	return siblings;
};


var table_drop = document.getElementsByClassName('table-drop');
if (table_drop.length) {
	Array.from(table_drop).forEach(function (el) {
		Array.from(el.getElementsByTagName('tr')).forEach(function (et) {
			if (!et.classList.contains('sub')) {
				et.classList.add('not-sub');
			}
		});
		Array.from(el.querySelectorAll('a.toggle')).forEach(function (em) {
			em.addEventListener('click', function (e) {
				var next = nextUntil(em.closest('tr'), '.not-sub');
				em.classList.toggle('active');
				Array.from(next).forEach(function (en) {
					en.classList.toggle('hidden');
					en.classList.toggle('active');
				});
				e.preventDefault();
			});
		});
	});
}

var initializeTabs = function() {
	var module_tabs = document.getElementsByClassName('m6tb');
	if (module_tabs.length) {
		Array.from(module_tabs).forEach(function (el) {
			if (typeof semanticTabs === 'function' /*&& typeof semanticTabs !== 'undefined'*/ && !el.classList.contains('tabs-initialized')) {
				semanticTabs(el);
			}
			el.classList.add('tabs-initialized');
		});
	}
}
initializeTabs();

var moduleTabsMobileAsync = function() {
	var module_tabs_mobile = document.querySelectorAll('.m6tm:not(.m6tm-initialized)');
	if (module_tabs_mobile.length) {
		Array.from(module_tabs_mobile).forEach(function (el) {
			el.classList.add('m6tm-initialized');
			Array.from(el.children).forEach(function (em) {
				if (em.tagName.toLowerCase() === 'h1' || em.tagName.toLowerCase() === 'h2' || em.tagName.toLowerCase() === 'h3' || em.tagName.toLowerCase() === 'h4' || em.tagName.toLowerCase() === 'h5' || em.tagName.toLowerCase() === 'h6') {
					em.classList.add('handler');
					append_url(em, toggleText, 'toggle');
					em.getElementsByClassName('toggle')[0].addEventListener('click', function (e) {
						if (em.classList.contains('toggle')) {
							em.classList.remove('toggle');
						} else {
							em.classList.add('toggle');
						}
						e.preventDefault();
					});
				}
			});
		});
	}
}
moduleTabsMobileAsync();
//}

//to check when element gets position sticky
var form_product = document.getElementsByClassName('f8pr'),
	form_product_fixed = document.querySelectorAll('.f8pr.fixed');
if (form_product.length) {
	Array.from(form_product).forEach(function (el) {
		var dist;
		if (el.closest('.l4cl') === null) {
			if (header_id) {
				dist = header_id.offsetHeight;
			} else {
				dist = 0;
			}

			function io(entries) {
				entries.map((entry) => {
					if (entry.isIntersecting) {
						html_tag.classList.remove('l4cl-cart-active');
					} else {
						html_tag.classList.add('l4cl-cart-active');
					}
				});
			}
			new IntersectionObserver(io, {
			}).observe(el);
		}
	});
}

if (module_product.length) {
	Array.from(module_product).forEach(function (el) {
		if (el.closest('#content') !== null) {
			function io(entries) {
				entries.map((entry) => {
					if (entry.isIntersecting) {
						html_tag.classList.remove('f8pr-fixed-active');
					} else {
						new_css('product-scrolled-css', a_css_product_scrolled);
						html_tag.classList.add('f8pr-fixed-active');
						if (form_product_fixed.length) {
							function form_product_height() {
								root_styles.style.setProperty('--f8pr_fixed_height', form_product_fixed[0].clientHeight + 'px');
							}
							setTimeout(function () {
								form_product_height();
							}, 400);
							window.addEventListener('resize', throttle(() => {
								form_product_height();
							}, 500));
						}
					}
				});
			}
			new IntersectionObserver(io).observe(el);
		}
	});
}
var submenu_tabs_class = document.getElementsByClassName('submenu-tabs');
if (submenu_tabs_class.length) {
	Array.from(submenu_tabs_class).forEach(function (el) {
		var s_head = el.getElementsByClassName('submenu-tabs-header')[0],
			s_body = el.getElementsByClassName('submenu-tabs-content')[0];
		if (!el.classList.contains('disabled')) {
			Array.from(s_head.querySelectorAll('li')).forEach(function (em, index) {
				em.addEventListener('mouseover', function () {
					Array.from(s_body.children).forEach(function (en) {
						en.classList.add('hidden');
					});
					s_body.children[index].classList.remove('hidden');
				});
			});
		}
		Array.from(el.getElementsByClassName('mobile-featured')).forEach(function (eo) {
			eo.remove();
		});
	});
}


// play/mute video
window.muteVideo = function() {
	// play/mute video
	const a_video = document.querySelectorAll('a video, a ~ video, a ~ picture video');
	if (a_video.length) {
		a_video.forEach(el => {
			const muteLink = document.createElement('span');
			muteLink.innerHTML = '<a href="./">Mute</a>';
			muteLink.classList.add('link-mute');

			const pictureEl = el.closest('picture');
			if (pictureEl) {
				const linkPicEl = pictureEl.closest('a');
				if (linkPicEl) {
					linkPicEl.insertAdjacentElement('afterend', muteLink);
				} else {
					pictureEl.insertAdjacentElement('afterend', muteLink);
				}
			}

			muteLink.querySelector('a').addEventListener('click', function (e) {
				e.preventDefault();
				muteLink.classList.toggle('muted');
				el.muted = muteLink.classList.contains('muted');
			});

			const figureEl = el.closest('figure');
			const linkEl = el.closest('a');

			let av;
			if (figureEl !== null) {
				av = figureEl.querySelector('.link-overlay');
			}
			if (linkEl !== null) {
				av = linkEl;
			}
			if (av) {
				av.addEventListener('click', function (e) {
					if (av.classList.contains('video-clicked')) {
						av.classList.remove('video-clicked');
						el.pause();
					} else {
						av.classList.add('video-clicked');
						el.play();
					}
					//el.setAttribute('controls', true);
					e.preventDefault();
				});
			}
		});
	}
}
muteVideo();

// More link
function linkMoreAsync() {
	setTimeout(function(){
		var a_more = document.querySelectorAll('a.link-more:not(.link-more-initialized)');
		if (a_more.length) {
			Array.from(a_more).forEach(function (el) {
				if (el.tagName.toLowerCase() === 'a') {
					var parent = el.parentElement,
						parents = parent.parentElement,
						other_links = parents.querySelectorAll('a.link-more'),
						elements,
						limit = 5, // default limit that can be overwritten by defining the [data-limit] attribute
						inner_p;

					if(parents.querySelector('.m6lm')) {
						checkHeight(parents.querySelector('.m6lm'));
					}

					if (parents.classList.contains('check')) {
						if (el.hasAttribute('data-limit')) {
							limit = parseFloat(el.getAttribute('data-limit'));
						}
						Array.from(parents.querySelectorAll('li:nth-child(n+' + (limit + 1) + ')')).forEach(function (el) {
							if (!el.classList.contains('link-more')) {
								el.classList.add('hidden');
							}
						});
					}
					elements = parents.querySelectorAll('.hidden, .was-hidden');

					el.classList.add('link-more-initialized');
					function detectLong(el, em) {
						if (el.clientHeight < el.scrollHeight) {
							em.classList.add('long');
						} else if (el.clientHeight === 0) {
						} else {
							em.classList.remove('long');
						}
					}
					if (parents.classList.contains('info')) {
						inner_p = parents.children[0];
						if (parents.querySelectorAll('p.hidden, p:not(.link-more) .hidden').length) {
							parents.classList.add('long');
						} else {
							detectLong(inner_p, parents);
							window.addEventListener('resize', throttle(() => {
								detectLong(inner_p, parents);
							}, 500));
						}
					}
					parent.classList.add('has-link-more');
					Array.from(other_links).forEach(function (el, index) {
						el.setAttribute('data-no', other_links.length - index);
					});

					if (el.getAttribute('href') === './' || el.getAttribute('href') === '#' || el.getAttribute('href') === null) {
						el.addEventListener('click', function (e) {
							Array.from(elements).forEach(function (em) {
								if (em.classList.contains('hidden')) {
									em.classList.remove('hidden');
									em.classList.add('was-hidden');
								} else if (em.classList.contains('was-hidden')) {
									em.classList.remove('was-hidden');
									em.classList.add('hidden');
								}
							});
							if (parents.classList.contains('link-more-clicked')) {
								parents.classList.remove('link-more-clicked');
								parent.classList.remove('link-more-clicked');
							} else {
								parents.classList.add('link-more-clicked');
								parent.classList.add('link-more-clicked');
							}
							e.preventDefault();
						});
					}
				}
			});
		}
	}, 0);
}
linkMoreAsync();

var share_btn = document.querySelectorAll('a[data-share]');
if (share_btn.length) {
	Array.from(share_btn).forEach(function (el) {
		el.addEventListener('click', function (e) {
			if (navigator.share) {
				navigator.share({
					title: document.title,
					url: el.getAttribute('data-share')
				});
			}
			e.preventDefault();
		});
	});
}

const aEmailEls = document.querySelectorAll('.email');
const aEmailObs = new IntersectionObserver((entries, obs) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const el = entry.target;
			const tag = el.tagName.toLowerCase();

			if (tag !== 'input' && tag !== 'div') {
				el.innerText = el.innerText.replace('//', '@').replace(/\//g, '.');

				if (tag === 'a') {
					el.setAttribute('href', 'mailto:' + el.innerText);
				}
			}

			obs.unobserve(el);
		}
	});
});
aEmailEls.forEach(el => aEmailObs.observe(el));

// Live search
var liveSearch = function (elem, livesearch_placeholders) {
	const searchTerm = elem.value.trim();
	getSearchResults(searchTerm, livesearch_placeholders);
}
var getSearchResults = function (searchTerm, livesearch_placeholders) {
	var liveSearchEl = document.getElementById('livesearch');
	if (searchTerm.length > 0) {
		fetch(routes.predictive_search_url + "?q="+searchTerm+"&resources[limit]=4&resources[limit_scope]=each&section_id=livesearch")
			.then((response) => {
				if (!response.ok) {
					var error = new Error(response.status);
					throw error;
				}
				return response.text();
			})
			.then((text) => {
				const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-livesearch').innerHTML;
				liveSearchEl.innerHTML = resultsMarkup;
				html_tag.classList.add('search-full');
				search_id.classList.remove('processing');
				if (liveSearchEl.querySelectorAll('[data-search-suggestion]')){
					Array.from(liveSearchEl.querySelectorAll('[data-search-suggestion]')).forEach(function (el) {
						el.addEventListener('click', function (e) {
							e.preventDefault();
							search_input = search_id.querySelectorAll('input');
							search_input[0].value = el.dataset.searchSuggestion;
							search_id.classList.add('processing');
							liveSearch(search_input[0]);
						});
					});
				}
			})
			.catch((error) => {
				throw error;
			});
	} else if (livesearch_placeholders) {
		liveSearchEl.innerHTML = ''
		liveSearchEl.appendChild(livesearch_placeholders);
		html_tag.classList.add('search-full');
		search_id.classList.remove('processing');
	} else {
		search_id.classList.remove('processing');
	}
}

// Recently viewed products

var recentlyViewedProducts = function () {
	var recently_viewed_products = document.querySelectorAll(".recently-viewed-products:not(.recently-viewed-products-initialized)");
		currProductData = JSON.parse(localStorage.getItem("recentlyViewedProduct"));
	if (general.viewed_product){
		var numberOfProducts = 12,
			productUrl = general.viewed_product,
			productId = general.viewed_product_id,
			productData =  { productUrl: productUrl, productId: productId },
			pushNewProductData = false,
			currProductData, sameProduct, newProductData, sameProductIndex;
		if (currProductData === null) {
			currProductData = [];
			pushNewProductData = true;
		} else {
			sameProduct = currProductData.filter(e => e.productId === productId).length > 0;
			if (sameProduct) {
				sameProductIndex = currProductData.map(function(e) { return e.productId; }).indexOf(productId);
				currProductData.splice(sameProductIndex, 1);
				pushNewProductData = true;
			}
			if (currProductData.length < numberOfProducts && !sameProduct) {
				pushNewProductData = true;
			} else if (currProductData.length >= numberOfProducts && !sameProduct) {
				currProductData.shift();
				pushNewProductData = true;
			}
		}
		if (pushNewProductData) {
			currProductData.push(productData);
			newProductData = JSON.stringify(currProductData);
			localStorage.setItem("recentlyViewedProduct", newProductData);
		}
	}
	if (recently_viewed_products.length) {
		const productData = JSON.parse(localStorage.getItem("recentlyViewedProduct"));
		if (productData == null) {
			Array.from(recently_viewed_products).forEach(function (el) { el.remove(); });
			return;
		}
		var fill_images = recently_viewed_products[0].querySelector('[data-fill_images]')
		var recentlyViewedHtml = '',
			recentlyViewedProductsObj = {},
			itemsDone = 0,
			data = productData.reverse(),
			length = productData.length;
		Array.from(data).forEach(function (product, index, array) {
			fetch(product.productUrl +'/?section_id=product-item-compact')
				.then((response) => {
					if (!response.ok) {
						var error = new Error(response.status);
						throw error;
					}
					return response.text();
				})
				.then((text) => {
					const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').getElementById('shopify-section-product-item-compact').innerHTML;
					recentlyViewedProductsObj[product.productId] = resultsMarkup;
					itemsDone++;
					if (itemsDone === array.length){
						Array.from(productData).forEach(function (product, index, array) {
							recentlyViewedHtml += recentlyViewedProductsObj[product.productId];
						});
						Array.from(recently_viewed_products).forEach(function (el, index, array) {
							var number_of_items = parseInt(el.querySelector('[data-number_of_items]').dataset.number_of_items),
								max = number_of_items;
								fill_images = el.querySelector('[data-fill_images]');
							el.classList.add('recently-viewed-products-initialized');
							var list_collection = el.querySelector('.l4cl');
							list_collection.classList.remove('slider', 's4wi')
							list_collection.innerHTML = recentlyViewedHtml;
							var placeholder_items = list_collection.querySelectorAll('.placeholder-product');
							Array.from(placeholder_items).forEach(function (el, index, array) {
								el.remove();
							});
							if ((length - placeholder_items.length) > max) {
								list_collection.classList.add('slider');
							}
							Array.from(list_collection.querySelectorAll('figure')).forEach(function (el) {
								if (fill_images == null) {
									el.classList.remove('img-cover');
								} else {
									el.classList.add('img-cover');
									el.querySelectorAll('img').forEach(function(img) {
										if(img.getAttribute('src').includes('&pad_color=fff')) {
											img.setAttribute('src', img.getAttribute('src').replace('&pad_color=fff', ''))
										}
										if(img.getAttribute('srcset').includes('&pad_color=fff')) {
											img.setAttribute('srcset', img.getAttribute('srcset').replaceAll('&pad_color=fff', ''))
										}
									})
								}
							});
						});
						window.ratings();
						window.listCollectionSlider();
						window.formZindex();
						semanticInputAsync();
						schemeTooltipAsync();
						popupsAsync();
						listScrollableAsync();
            window.sals();
						window.checkLimit()
						ajaxCart.init();
						quickShop.init();
					}
				})
				.catch((error) => {
					console.log("recentlyViewedProducts error", error);
					throw error;
				});
		});
	}
};
recentlyViewedProducts();

// Ajax cart
var ajaxCart = (function(module) {
	var init, formOverride, addCartItem, handleCartPanel, updateCartPanel, updateCartPage, showCartPanel, updateItemQty, updateDiscount, handleCartUpdates, removeItem, updateCartCount, handleErrorMessage, addNote; // Define the functions
	var productFormContainer, sideCartContainer, cartPageTemplate, sticky, countElement, formData, formObject, line, quantity, count, config, sideCartId, enable_cart_drawer, enable_cart_drawer_header; // Define the data and elements

	init = function () {
		productFormContainer = document.querySelectorAll('form.f8pr:not(.cart-initialized), form.form-card:not(.initialized)');
		cartPageContainer = document.querySelector('.form-cart, .cart-empty');
		sideCartContainer = document.querySelector('#cart') || null;
		countElement = document.querySelectorAll('.cart-count');
    sideCartId = sideCartContainer ? sideCartContainer.getAttribute('data-section-id') || '' : '';
		enable_cart_drawer = sideCartContainer
		if (productFormContainer.length) { formOverride();	} // when there is an product form, initialize the ajax cart for the entire form
		if (cartPageContainer != null) { // when there is an cart form, initialize the ajax cart for the inputs in the form
			cartPageContainer = cartPageContainer.parentElement;
			cartPageTemplate = cartPageContainer.id.replace('shopify-section-', '');
			handleCartUpdates(cartPageContainer);
		}
	};

	formOverride = function () {
		Array.from(productFormContainer).forEach(function (form) {
			form.classList.add('cart-initialized');
			form.addEventListener('submit', function (e) {
				new_css('form-validation-css', a_css_validation);
				form.querySelector('button[type="submit"]').classList.add('processing');
				if (sticky) { sticky.querySelector('form').classList.add('processing'); }
				e.preventDefault();
				addCartItem(form);
			});
		});
	};

	addCartItem = function(form, listItem) {
		formData = new FormData(form);
		if (general.template == 'cart') {
			formData.append('sections', sideCartId +  ',' + cartPageTemplate);
		} else {
			formData.append('sections', sideCartId);
		}
		config = {
			method: 'POST',
			body: formData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/javascript'
			}
		};
		fetch(routes.cart_add_url, config)
			.then((response) => response.json())
			.then((response) => {
				form.classList.remove('processing');
				if (form.querySelector('button[type="submit"]')) { form.querySelector('button[type="submit"]').classList.remove('processing'); }
				if (sticky) { sticky.querySelector('form').classList.remove('processing'); }
				document.querySelectorAll('[data-error-key]').forEach(function (el) { el.classList.remove('is-invalid'); });
				if (response.status) {
					if (listItem) {
						listItem.remove();
					}
					hidePanels();
					if (typeof response.description == 'object') {
						let keys = Object.keys(response.description);
						let messages = Object.values(response.description);
						for (let i = 0; i < keys.length; i++) {
							if (document.querySelector('[data-error-key="' + keys[i] + '"]')) {
								document.querySelector('[data-error-key="' + keys[i] + '"]').classList.add('is-invalid');
							}
						}
						for (let i = 0; i < messages.length; i++) {
							handleErrorMessage(messages[i]);
						}
					} else {
						handleErrorMessage(response.description);
					}
					return;
				}
				if (enable_cart_drawer) {
					if (listItem) {
						listItem.remove();
						updateCartPanel(response, true, true);
					} else {
						updateCartPanel(response);
					}
					if (general.template == 'cart') {
						updateCartPage(response);
					}
					if (listItem == undefined) {
						var alertAttributes = {
								message: (response.title + ' ' + translations.added_to_cart),
								type: "success",
								location: "cartpanel"
							},
							showAlertEvent = new CustomEvent("showAlert", {detail: alertAttributes});
						window.dispatchEvent(showAlertEvent);
						listAlertsAsync();
						closeAlerts();
					}
				} else {
          // console.log(response.quantity);
          // console.log(new DOMParser().parseFromString(response.sections["section-side-cart"], 'text/html'));
					// var count = new DOMParser().parseFromString(response.sections["section-side-cart"], 'text/html').querySelector('#shopify-section-side-cart').querySelector('[data-totalqty]').dataset.totalqty;
					updateCartCount(response.quantity);
					window.location.href = routes.cart_url;
				}
			})
			.catch((error) => {
				console.log("addCartItem error", error);
			});
	}

	handleErrorMessage = function(errorMessage = false) {
		if (errorMessage) {
			var alertAttributes = { message: errorMessage, type: "error" },
				showAlertEvent = new CustomEvent("showAlert", {detail: alertAttributes});
			window.dispatchEvent(showAlertEvent);
		}
	}

	showCartPanel = function() {
		openPanel('cart');
		window.dispatchEvent(new CustomEvent("themeCartOpened"));
	}

	updateCartPage = function(response = false) {
		if (response) {
			const resultsMarkup = new DOMParser().parseFromString(response.sections[cartPageTemplate], 'text/html').querySelector("#shopify-section-" + cartPageTemplate).innerHTML;
			handleCartPage(resultsMarkup);
		}
	}

	updateCartPanel = function(response = false, openCartPanel = true, undoRemove = false, forceRefetch = false, onlyShowAddedToCart = false) {
		if (response) {
      const resultsMarkup = new DOMParser().parseFromString(response.sections[sideCartId], 'text/html').querySelector('.side-cart-wrapper').innerHTML;
			handleCartPanel(resultsMarkup, openCartPanel, undoRemove);
		} else if (!sideCartContainer.classList.contains('side-cart-initialized') || forceRefetch){
			fetch(window.Shopify.routes.root + "?sections=" + sideCartId)
				.then((response) => {
					if (!response.ok) {
						var error = new Error(response.status);
						throw error;
					}
					return response.text();
				})
				.then((text) => {
					var sections = JSON.parse(text);
					const resultsMarkup = new DOMParser().parseFromString(sections[sideCartId], 'text/html').querySelector('.side-cart-wrapper').innerHTML;
					handleCartPanel(resultsMarkup, openCartPanel);
				})
				.catch((error) => {
					console.log("updateCartPanel error", error);
					throw error;
				});
		} else {
			showCartPanel();
		}
	}

	handleCartPage = function(resultsMarkup) {
		cartPageContainer.innerHTML = resultsMarkup;
		semanticInputAsync();
		formValidateAsync();
		// inputShowAsync();
		accordionAsync();
		accordionLabelAsync();
		countdownAsync();
		bindInputAsync();
		schemeTooltipAsync();
		popupsAsync();
		listAlertsAsync();
		handleCartUpdates(cartPageContainer);
		updateCartCount();
	}

	handleCartPanel = function(resultsMarkup, openCartPanel, undoRemove) {
		let items = sideCartContainer.querySelectorAll('.l4ca > li');
		sideCartContainer.innerHTML = resultsMarkup;
		sideCartContainer.classList.remove('m6pn-initialized');
		modulePanelAsync();
		semanticInputAsync();
		window.ratings();
		Array.from(items).forEach(function (item, index) {
			if (item.classList.contains('removing')) {
				if (undoRemove && sideCartContainer.querySelectorAll('.l4ca > li')[(index + 1)]) {
					sideCartContainer.querySelector('.l4ca').insertBefore(item, sideCartContainer.querySelectorAll('.l4ca > li')[(index + 1)]);
				} else if (undoRemove ) {
					sideCartContainer.querySelector('.l4ca').append(item);
				} else {
					sideCartContainer.querySelector('.l4ca').insertBefore(item, sideCartContainer.querySelectorAll('.l4ca > li')[(index)]);
				}
				if (sideCartContainer.querySelector('.empty:not(.hidden)')) {
					sideCartContainer.querySelector('.empty').classList.add('hidden');
				}
			}
		});

		if (sideCartContainer.querySelector('.product-recommendations:not(.product-recommendations-initialized)')) {
			recommendedProductsAsync();
		}

		handleCartUpdates(sideCartContainer);
		updateCartCount();
		modulePanelAsync();
		listCartAsync();
		semanticInputAsync()
		// inputShowAsync();
		formValidateAsync();

		if (openCartPanel) { showCartPanel(); }
	}

	handleCartUpdates = function(container) {
		var updateItemInput = container.querySelectorAll('input[name="updates[]"]'),
			removeItemLink 	= container.getElementsByClassName('remove-from-cart-link'),
			noteElement = container.querySelector('textarea[name="note"]'),
			submitButtons = container.querySelectorAll('.link-btn a, .link-btn button'),
			discountForm = container.querySelectorAll('.discount-form:not(.listening)'),
			removeDiscountLink = container.querySelectorAll('.remove-discount:not(.listening)');

		Array.from(updateItemInput).forEach(function (input) {
			input.addEventListener('change', function (e) {
				updateItemQty(e.target, container);
			});
		});

		Array.from(removeItemLink).forEach(function (link) {
			link.addEventListener('click', function (e) {
				e.preventDefault();
				removeItem(e.target, container);
			});
		});

		Array.from(discountForm).forEach(function (form) {
			form.classList.add('listening');
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				updateDiscount(form, form.querySelector('input[name="discount"]').value, 'add', container);
			});
		});
		Array.from(removeDiscountLink).forEach(function (link) {
			link.classList.add('listening');
			link.addEventListener('click', function (e) {
				e.preventDefault();
				updateDiscount(link, link.dataset.discountCode, 'remove', container);
			});
		});

		if (noteElement) {
			// Debounced function to handle the input event
			const debouncedAddNote = debounce(async function (e) {
				try {
					await addNote(e.target, container);
					submitButtons.forEach(button => {
						button.disabled = false;
						button.classList.remove('disabled');
					});
					noteElement.focus();
				} catch (error) {
					console.error('Error:', error);
				}
			}, 1000);

			noteElement.addEventListener('input', function (e) {
				submitButtons.forEach(button => {
					button.disabled = true;
					button.classList.add('disabled');
				});
				debouncedAddNote(e);
			});
		}
		function debounce(func, delay) {
			let timeout;
			return function (...args) {
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(this, args), delay);
			};
		}
	}

	addNote = function(attribute, container) {
		config = {
			method: 'POST',
			body: JSON.stringify({
				'note': attribute.value,
				'sections': 'side-cart,' + cartPageTemplate
			}),
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				'Accept': 'application/javascript'
			}
		};
		fetch(routes.cart_update_url, config)
				.then((response) => response.json())
				.then((response) => {
					if (response.status) {
						handleErrorMessage(response.description);
						return;
					}
					if (container === sideCartContainer) {
						updateCartPage(response);
					}
					if (cartPageContainer != null ) {
						if (container != sideCartContainer) {
							updateCartPanel(response, false);
						}
					}
				})
				.catch((error) => {
					console.log("addNote error", error);
				});
	}

	updateDiscount = function(element, discountCode, action, container) {
		if (!discountCode) return;
		discountCode = discountCode.toLowerCase();
		let discounts = [];
		const existingDiscounts = container.querySelectorAll('.remove-discount');
		for (const discount of existingDiscounts) {
			discounts.push(discount.dataset.discountCode.toLowerCase());
		}
		if (action === 'add') {
			if (discounts.includes(discountCode)) {
				handleErrorMessage(container.querySelector('.discount-form .already-applied-error-message ').innerText);
				return;
			}
			discounts.push(discountCode);
		} else if (action === 'remove') {
			const index = discounts.indexOf(discountCode);
			if (index === -1) return;
			discounts.splice(index, 1);
		}
		element.classList.add('processing');
		config = {
			method: 'POST',
			body: JSON.stringify({
				'discount': discounts.join(','),
				'sections': sideCartId + ',' + cartPageTemplate
			}),
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				'Accept': 'application/javascript'
			}
		};
		fetch(routes.cart_update_url, config)
			.then((response) => response.json())
			.then((response) => {
				element.classList.remove('processing');
				if (response.status) {
					handleErrorMessage(response.description);
					return;
				}
				if (response.discount_codes.find((discount) => { return discount.code === discountCode && discount.applicable === false; })) {
					if (container.querySelector('.discount-form')) {
						container.querySelector('.discount-form input[name="discount"]').value = '';
						handleErrorMessage(container.querySelector('.discount-form .not-applicable-error-message ').innerText);
					}
					return;
				}
				if (container === sideCartContainer) {
					updateCartPanel(response);
				}
				if (cartPageContainer != null ) {
					updateCartPage(response);
					if (container != sideCartContainer && sideCartContainer) {
						updateCartPanel(response, false);
					}
				}
			})
			.catch((error) => {
				console.log("updateDiscount error", error);
			});
	};

	updateItemQty = function(input, container) {
		key = input.dataset.key,
    		quantity = parseInt(input.value)
		config = {
			method: 'POST',
			body: JSON.stringify({
				'id': key,
				'quantity': quantity,
				'sections': sideCartId + ',' + cartPageTemplate
			}),
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				'Accept': 'application/javascript'
			}
		};
		fetch(routes.cart_change_url, config)
			.then((response) => response.json())
			.then((response) => {
				if (response.status) {
					handleErrorMessage(response.description);
					return;
				}
				if (container === sideCartContainer) {
					updateCartPanel(response);
				}
				if (cartPageContainer != null ) {
					updateCartPage(response);
					if (container != sideCartContainer && sideCartContainer) {
						updateCartPanel(response, false);
					}
				}
			})
			.catch((error) => {
				console.log("updateItemQty error", error);
			});
	};

	removeItem = function(link, container) {
		key = link.dataset.key;
		let item = link.closest('li');
		if (container === sideCartContainer || container == cartPageContainer) {
			if (item.querySelector('.removed') != null) {
				item.classList.add('processing');
			}
		}
		config = {
			method: 'POST',
			body: JSON.stringify({
				'id': key,
				'quantity': 0,
				'sections': sideCartId + ',' + cartPageTemplate
			}),
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
				'Accept': 'application/javascript'
			}
		};
		fetch(routes.cart_change_url, config)
			.then((response) => response.json())
			.then((response) => {
				if (response.status) {
					handleErrorMessage(response.description);
					return;
				}
				if (container === sideCartContainer) {
					if (item.querySelector('.removed') != null) {
						item.dispatchEvent(new CustomEvent("removing"));
						item.classList.add('removing');
						item.classList.remove('processing');
						item.querySelector('.removed a').addEventListener('click', function (e) {
							item.classList.add('processing');
							let tempForm = document.createElement('form');
							tempForm.innerHTML = '<input type="hidden" name="id" value="' + e.target.dataset.id + '"><input type="hidden" name="quantity" value="' + e.target.dataset.qty + '">';
							if (e.target.dataset.selling_plan) {
								tempForm.innerHTML += '<input type="hidden" name="selling_plan" value="' + e.target.dataset.selling_plan + '">';
							}
							for (var key in e.target.dataset) {
								if (key.indexOf('property-') === 0) {
									var data = JSON.parse(e.target.dataset[key]);
									tempForm.innerHTML += '<input type="hidden" name="properties[' + data[0] + ']" value="' + data[1] + '">';
								}
							}
							addCartItem(tempForm, item);
							tempForm.remove();
						});
					}
					updateCartPanel(response, true);
					if (cartPageContainer != null ) {
						updateCartPage(response);
					}
				} else if (cartPageContainer != null ) {
					updateCartPage(response);
					updateCartPanel(response, false);
				}
			})
			.catch((error) => {
				console.log("removeItem error", error);
			});
	};

	updateCartCount = function(count) {
		if (!count){
			count = document.querySelector('[data-totalqty]').dataset.totalqty;
		}
		Array.from(countElement).forEach(function (el) {
			el.innerHTML = count;
			if (count > 0) {
				el.classList.remove('hidden');
			}
			else {
				el.classList.add('hidden');
			}
		});
	}

	module = {
		init: init,
		load: updateCartPanel
	};
	return module;

}(ajaxCart || {}));
ajaxCart.init();

var handleSideCart = function() {
	let sideCartContainer = document.getElementById('cart');
	let userNav = document.getElementById('nav-user');


  if (!userNav || !userNav.querySelector('.cart a')) { return; }

    if (!sideCartContainer) {
      userNav.querySelector('.cart a').removeAttribute('data-panel');
      userNav.querySelector('.cart a').classList.remove('listening');
    } else {
      userNav.querySelector('.cart a').setAttribute('data-panel', 'cart');
    }

};
handleSideCart();

// Currency/country/language selector
var localization_form = document.querySelectorAll('.localization-form a');
Array.from(localization_form).forEach(function (el) {
	el.addEventListener("click", function(event) {
		event.preventDefault();
		var form = el.closest('form'),
			input = form.querySelector('input[name="locale_code"], input[name="country_code"]');
		input.value = el.dataset.value;
		form.submit();
	})
})

var removeSDScss = function () {
	var shopify_default_css = document.getElementById('shopify-dynamic-checkout');
	if (shopify_default_css) {
		shopify_default_css.remove();
	}
};
removeSDScss();

// Quickshop
var quickShop = (function(module) {
	var init, quickshopOverride, openQuickshop, handleQuickshopPanel; // Define the functions
	var quickshopButton; // Define the data and elements

	init = function () {
		quickshopButton = document.querySelectorAll('[data-quickshop]:not(.quickshop-initialized)');
		quickshopContainer = document.getElementById('quickshop');
		if (quickshopButton.length) { quickshopOverride();	}
	};
	quickshopOverride = function () {
		Array.from(quickshopButton).forEach(function (el) {
			el.classList.add('quickshop-initialized');
			el.addEventListener('click', function (e) {
				el.classList.add('loading');
				e.preventDefault();
				quickshopContainer.innerHTML = '';
				openQuickshop(el.getAttribute('href'), el);
			});
		});
	};

	openQuickshop = function(quickshopUrl, el) {
		fetch(quickshopUrl)
			.then((response) => {
				if (!response.ok) {
					var error = new Error(response.status);
					throw error;
				}
				return response.text();
			})
			.then((text) => {
				const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('div[id$="main-product"]'),
					container = resultsMarkup.querySelector('.m6pr'),
					sectionId = container.getAttribute('data-template');
				if (resultsMarkup.querySelector('.l4pr')) {
					resultsMarkup.querySelector('.l4pr').classList.remove('slider', 'slider-offset');
					resultsMarkup.querySelector('.l4pr').removeAttribute('data-spacing');
				}
				Array.from(resultsMarkup.querySelectorAll('a[href="#section-info"]')).forEach(function (el) {
					el.setAttribute('href', quickshopUrl + el.getAttribute('href'));
				});
				Array.from(resultsMarkup.querySelectorAll(' a[data-panel="product-reviews"]')).forEach(function (el) {
					el.setAttribute('href', quickshopUrl + '#section-reviews');
					el.removeAttribute('data-panel');
				});
				Array.from(resultsMarkup.querySelectorAll('.l4pr li.sticky, .product-recommendations, .quickshop-hide, #section-info')).forEach(function (el) {
					el.remove();
				});
				if (resultsMarkup.querySelector('header > h1, header > h2, header > h3, header > h4, header > h5') != null) {
					Array.from(resultsMarkup.querySelectorAll('header > h1, header > h2, header > h3, header > h4, header > h5')).forEach(function (el) {
						el.innerHTML = '<a href="' + quickshopUrl + '">' + resultsMarkup.querySelector('header > h1, header > h2, header > h3, header > h4, header > h5').innerHTML + '</a>';
					});
				}
				resultsMarkup.innerHTML = resultsMarkup.innerHTML.replaceAll(sectionId, `quickshop-${ sectionId }`);
				handleQuickshopPanel(resultsMarkup.innerHTML, el);
			})
			.catch((error) => {
				console.log("openQuickshop error", error);
				throw error;
			});
	}

	handleQuickshopPanel = function(resultsMarkup, el = false) {
		quickshopContainer.innerHTML = resultsMarkup;
		modulePanelAsync();
		semanticInputAsync();
		window.ratings();
		productVariantsAsync();
		window.listProductSlider();
		listDropAsync();
		semanticSelectAsync();
		showHideDataElementAsync();
		sellingplansAsync();
		pickupAvailabilityAsync();
		window.formZindex();
		fancyboxAsync();
		// inputShowAsync();
		accordionAsync();
		accordionLabelAsync();
		dataChangeAscync();
		countdownAsync();
		schemeTooltipAsync();
		popupsAsync();
		rangeSliderAsync();
		productPageDrawers();
		linkMoreAsync();
    	masonry();
		initializeTabs();
    window.sals();
		if (window.Shopify && Shopify.PaymentButton) {
			Shopify.PaymentButton.init();
		}
		setTimeout(function () {
			removeSDScss();
		},1);
		ajaxCart.init();
		if (window.ProductModel) window.ProductModel.loadShopifyXR();
		openPanel('quickshop');
		if (el) { el.classList.remove('loading') }
	}

	module = {
		init: init,
		open: openQuickshop
	};
	return module;
}(quickShop || {}));
quickShop.init();

var clearRangeInputs = function(minInput, maxInput) {
	var minInput = document.querySelector('#filter input#min'),
		maxInput = document.querySelector('#filter input#max');
	if (minInput && maxInput) {
		minInput.removeAttribute('name');
		maxInput.removeAttribute('name');
	}
}
var clearAllInputs = function() {
	clearRangeInputs();
	var inputs = document.querySelectorAll('#filter input[type="checkbox"]:checked');
	Array.from(inputs).forEach(function (el) {
		el.checked = false;
	});
}

var initFiltersAsync = function () {
	if (document.getElementById('filter') != null) {
		new_css('form-validation-css', a_css_validation);
		filter_form = document.getElementById('filter');
		if (filter_form.parentElement.classList.contains('m6pn') && filter_form.parentElement.parentElement.classList.contains('shopify-section')) {
			root_id.appendChild(filter_form.parentElement);
		}
		var form_filter_input_anchors = filter_form.querySelectorAll('li label a');
		Array.from(form_filter_input_anchors).forEach(function (el) {
			el.classList.add('no-click');
		});
		var form_filter_clear = document.querySelectorAll('a.remove-all, a.clear-range');
		if (form_filter_clear.length) {
			Array.from(form_filter_clear).forEach(function (el) {
				el.addEventListener('click', function(e) {
					e.preventDefault();
					if (el.classList.contains('remove-all')) {
						clearAllInputs();
					} else {
						clearRangeInputs();
					}
					processFilters();
				})
			});
		}
		var form_filter_inputs = document.querySelectorAll('#filter input:not([data-width])');
		if (form_filter_inputs.length) {
			Array.from(form_filter_inputs).forEach(function (el) {
				el.addEventListener('change', function(event) {
					processFilters();
				});
			});
		}
	}
};
initFiltersAsync();

// Collectionpage: filters
var processFilters = function() {
	filter_form = document.getElementById('filter');
	var filter_form_template = filter_form.dataset.template;
	var collectionSection = document.getElementById('shopify-section-' + filter_form_template);
	filter_form.classList.add('processing');
	if (filter_form.querySelector('.link-btn a.submit')) {
		filter_form.querySelector('.link-btn a.submit').classList.add('loading');
	}
	if (collectionSection.querySelector('.l4cl')) {
		collectionSection.querySelector('.l4cl').classList.add('processing');
	}
	var minInput = document.querySelector('#filter input#min'),
		maxInput = document.querySelector('#filter input#max');
	if ((minInput && maxInput) && minInput.value == minInput.getAttribute('min') && maxInput.value == maxInput.getAttribute('max')) {
		clearRangeInputs();
	}
	var filterFormData = new FormData(filter_form);
	var filterParams = new URLSearchParams(filterFormData).toString();
	const filterUrl = window.location.pathname + '?section_id=' + filter_form_template + '&' + filterParams;
	fetch(filterUrl)
		.then((response) => {
			if (!response.ok) {
				var error = new Error(response.status);
				throw error;
			}
			return response.text();
		})
		.then((text) => {
			const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-' + filter_form_template);
			Array.from(filter_form.querySelectorAll('h4[data-filter-toggle].toggle')).forEach(function (el) {
				resultsMarkup.querySelector('h4[data-filter-toggle="'+ el.dataset.filterToggle +'"]').classList.add('toggle');
			});
			collectionSection.innerHTML = resultsMarkup.innerHTML;
			// if (document.querySelector('.collection-wrapper')) {
			// 	document.querySelector('.collection-wrapper').scrollIntoView();
			// } else {
			// 	window.scrollTo(0, 0);
			// }
			history.pushState({ filterParams }, '', `${window.location.pathname}${filterParams && '?'.concat(filterParams)}`);
			if (document.querySelector('#root > .m6pn#filters')) {
				if (document.querySelector('#root > .m6pn#filters').classList.contains('toggle')) {
					var filtersOpen = true;
				}
				document.querySelector('#root > .m6pn#filters').remove();
				var new_filter_form = collectionSection.querySelector('.m6pn#filters');
			}
			if (new_filter_form) {
				root_id.appendChild(new_filter_form);
				modulePanelAsync();
				if (filtersOpen) {
					openPanel('filters');
				}
			}
			collectionSortAsync();
			rangeSliderAsync();
			gridListSwitchAsync();
			linkMoreAsync();
			initFiltersAsync();
			window.ratings();
			formFilterAsync();
			countPrefixSuffix();
			semanticInputAsync();
			schemeTooltipAsync();
			popupsAsync();
			collectionLoadMoreAsync();
			semanticSelectAsync();
			getStickyFooters();
			moduleTabsMobileAsync();
			window.checkLimit();
      window.sals();
			ajaxCart.init();
			quickShop.init();
		})
		.catch((error) => {
			console.log("processFilters error", error);
			throw error;
		});
};

// Collectionpage: sort_by
var collectionSortAsync = function() {
	var sort_by = document.getElementById('sort_by');
	if (sort_by != null) {
		sort_by.addEventListener('change', function() {
			setTimeout(function () {
				const inputs = document.querySelectorAll('input[type="radio"][name="sort_by"]');
				if (inputs) {
					Array.from(inputs).forEach(function (input) {
						if (input.value == sort_by.value) {
							input.checked = true;
						} else {
							input.checked = false;
						}
					});
					processFilters();
				}
			},1);
		});
	}
};
collectionSortAsync();

var collectionLoadMoreAsync = function () {
	var collection_load_more = document.querySelectorAll('#load-more-button[data-next], #load-more-button[data-prev]');
	if (collection_load_more) {
		Array.from(collection_load_more).forEach(function (button) {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				var template = button.getAttribute('data-section'),
					collectionSection = document.getElementById('shopify-section-' + template),
					curr_products = collectionSection.querySelector('.results, .l4cl'),
					pagination_info = document.getElementById('load-more-info');
				if (button.getAttribute('data-next') != null) {
					var direction = 'next'
				} else {
					var direction = 'prev';
				}
				button.classList.add('loading');
				fetch(button.getAttribute('href'))
					.then((response) => {
						if (!response.ok) {
							var error = new Error(response.status);
							throw error;
						}
						return response.text();
					})
					.then((text) => {
						const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-' + template);
						var	new_products = resultsMarkup.querySelector('.results, .l4cl'),
							new_button = resultsMarkup.querySelector('#load-more-button[data-'+ direction +'], #load-more-button[data-top]'),
							new_pagination_info = resultsMarkup.querySelector('#load-more-info');
						if (direction == 'prev'){
							var lastScrollHeight = curr_products.scrollHeight;
						}
						if (curr_products && new_products) {
							if (direction == 'next') {
								Array.from(new_products.children).forEach(function (el) {
									curr_products.appendChild(el);
								});
							} else {
								Array.from(new_products.children).reverse().forEach(function (el) {
									curr_products.insertBefore(el, curr_products.firstChild);
								});
							}
						}
						if (direction == 'next' && pagination_info && pagination_info.parentNode && new_pagination_info) {
							pagination_info.parentNode.replaceChild(new_pagination_info, pagination_info);
						}
						if (button && button.parentNode && new_button) {
							button.parentNode.replaceChild(new_button, button);
						} else if (button && direction == 'prev') {
							button.remove();
						}
						if (direction == 'prev'){
							var scrollDiff = curr_products.scrollHeight - lastScrollHeight,
								scrollTo = curr_products.scrollTop += scrollDiff;
							window.scrollTo({
								top: scrollTo,
								behavior: 'instant',
							});
						}
						window.history.replaceState({}, '', button.getAttribute('href'));
						saveLoadMoreAnchor();
						window.ratings();
						semanticInputAsync();
						schemeTooltipAsync();
						popupsAsync();
						collectionLoadMoreAsync();
						listScrollableAsync();
            window.sals();
						window.checkLimit();
						ajaxCart.init();
						quickShop.init();
					})
					.catch((error) => {
						console.log("collectionLoadMore error", error);
						throw error;
					});
			});
		});
	}
};
collectionLoadMoreAsync();

function saveLoadMoreAnchor() {
	let anchors = document.querySelectorAll('#collection > li > figure > a, .m6cl .results > div a, .m6cl .results > .l4ne a');
	if (anchors) {
		Array.from(anchors).forEach(function (el) {
			el.addEventListener('click', function(e) {
				localStorage.setItem('loadMoreItemClicked', el.getAttribute('href'));
			});
		});
	}
}

// Productpage AR functionality
var model3d = document.querySelectorAll('[data-shopify-xr]');
if (model3d.length) {
	window.ProductModel = {
		loadShopifyXR() {
			Shopify.loadFeatures([
				{
					name: 'shopify-xr',
					version: '1.0',
					onLoad: this.setupShopifyXR.bind(this),
				},
			]);
		},
		setupShopifyXR(errors) {
			if (errors) return;
			if (!window.ShopifyXR) {
				document.addEventListener('shopify_xr_initialized', () =>
					this.setupShopifyXR()
				);
				return;
			}
			document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
				window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
				modelJSON.remove();
			});
			window.ShopifyXR.setupXRElements();
		},
	};
	if (window.ProductModel) window.ProductModel.loadShopifyXR();
}

// Productcards variant select
var productcardVariantsAsync = function() {
	var card_id_input = document.querySelectorAll('.l4ca > li select[name="id"]:not(.listening)');
	var product_card_add_to_cart = document.querySelectorAll('.l4cl .product-card.update-variants select[name="id"]:not(.listening)');
	if (!card_id_input.length && product_card_add_to_cart.length) {
		card_id_input = product_card_add_to_cart;
	}
	if (card_id_input.length) {
		new_css('form-validation-css', a_css_validation);
		Array.from(card_id_input).forEach(function (el) {
			el.classList.add('listening');
			el.addEventListener('change', function() {
				setTimeout(function () {
					var selected_option = el.options[el.selectedIndex],
						productFormSection = el.closest('li'),
						variant_data = JSON.parse(selected_option.dataset.variantinfo);

					if (variant_data.image) {
						if(productFormSection.querySelector('picture.slider') == undefined) {
							productFormSection.querySelector('img').src = variant_data.image;
							productFormSection.querySelector('img').removeAttribute('srcset', 'data-src', 'data-srcset', 'sizes');
						}
					}
					if (variant_data.price) {
						productFormSection.querySelector('.price').innerHTML = '<span class="old-price"></span>' + variant_data.price;
					}
					if (variant_data.price_old) {
						productFormSection.querySelector('.old-price').innerHTML = variant_data.price_old;
						productFormSection.querySelector('.old-price').classList.remove('hidden');
					} else {
						productFormSection.querySelector('.old-price').classList.add('hidden');
					}
					productcardVariantsAsync();
					semanticSelectAsync();
					ajaxCart.init();
				},1);
			});
		});
	}
};

// Productpage variant select
var productVariantsAsync = function() {
	var main_id_input = Array.from(document.querySelectorAll('.m6pr select[name="id"]:not(.listening), .m6pr input[type="radio"][name="id"]:not(.listening)'));
	var options_input = Array.from(document.querySelectorAll('.m6pr select[name^="options"]:not(.listening), .m6pr input[type="radio"][name^="options"]:not(.listening), .m6pr-compact select[name^="options"]:not(.listening), .m6pr-compact input[type="radio"][name^="options"]:not(.listening)'));
	var product_card_add_to_cart = document.querySelectorAll('.l4cl .product-card.update-variants select[name="id"]:not(.listening)');
	var inputs = main_id_input.concat(options_input);
	if (inputs.length) {
		new_css('form-validation-css', a_css_validation);
		Array.from(inputs).forEach(function (el) {
			el.classList.add('listening');
			el.addEventListener('change', function() {
				setTimeout(function (token) {
					var productFormTemplate = el.dataset.template,
						productFormId = el.getAttribute('form'),
						productFormSection = document.querySelector('.m6pr-'+ productFormTemplate),
						sticky = document.getElementById('sticky-add-to-cart');
					productFormSection.querySelector('form.f8pr').classList.add('processing');
					if (productFormTemplate.startsWith('quickshop')) {
						productFormTemplate = productFormTemplate.replace('quickshop-', '');
						productFormId = productFormId.replace('-quickshop', '')
						var isQuickshop = true;
					}
					const oldProductUrl = productFormSection.dataset.productUrl,
						selectedOption = el.tagName === 'SELECT' ? el.options[el.selectedIndex] : el.closest('li').querySelector('input[type="radio"]:checked'),
						allSelectedOptions = document.querySelectorAll('.f8pr-variant-selection input:checked, .f8pr-variant-selection select option:checked');
					var newProductUrl = oldProductUrl;
					if (selectedOption.dataset.productUrl) {
						newProductUrl = selectedOption.dataset.productUrl;
					} else if (allSelectedOptions[0].dataset.productUrl) {
						newProductUrl = allSelectedOptions[0].dataset.productUrl;
					}
					const isSameProduct = oldProductUrl === newProductUrl || !newProductUrl;
					var newUrl = newProductUrl,
						fetchUrl = newProductUrl,
						params = '',
						renderSections = productFormTemplate;
					if (!isSameProduct && isQuickshop) {
						quickShop.open(newProductUrl);
						return;
					}
					if (sticky) {
						renderSections += ',sticky-add-to-cart';
						var hasSticky = true;
						sticky.classList.add('processing');
					}
					if (isSameProduct) {
						params = `sections=${renderSections}`;
					}
					if (el.name == 'id') {
						params += `&variant=${el.value}`;
					} else {
						const selectedOptionValues = Array.from(allSelectedOptions).map(({dataset}) => dataset.optionValueId);
						params += selectedOptionValues.length > 0
							? `&option_values=${selectedOptionValues.join(',')}`
							: '';
					}
					if (params) { fetchUrl = newProductUrl + `?${params}`; }
					fetch(fetchUrl)
						.then((response) => {
							if (!response.ok) {
								var error = new Error(response.status);
								throw error;
							}
							return response.text();
						})
						.then((text) => {
							if (isSameProduct) {
								var sections = JSON.parse(text),
									resultsMarkupForm = new DOMParser().parseFromString(sections[productFormTemplate], 'text/html');
							} else {
								var resultsMarkupForm = new DOMParser().parseFromString(text, 'text/html');
							}
							var selected_variant_id = resultsMarkupForm.querySelector('[data-current-variant]').dataset.currentVariant;
							if (!isSameProduct) {
								document.querySelector('head title').innerHTML = resultsMarkupForm.querySelector('head title').innerHTML;
								document.getElementById('content').innerHTML = resultsMarkupForm.querySelector('#content').innerHTML;
							} else {
								if (document.querySelector('.l4pr').dataset.variantImage) {
									productFormSection.querySelector('.l4pr-container').innerHTML = resultsMarkupForm.querySelector('.l4pr-container').innerHTML;
								}
								if (resultsMarkupForm.querySelector('.l4pr .label') != null) {
									productFormSection.querySelector('.l4pr .label').innerHTML = resultsMarkupForm.querySelector('.l4pr .label').innerHTML;
								}
								if (resultsMarkupForm.querySelector('.f8ps') != null && productFormSection.querySelector('.f8ps') != null && general.template == 'product' && (productFormSection == document.getElementById('shopify-section-' + productFormTemplate))) {
									productFormSection.querySelector('.f8ps').innerHTML = resultsMarkupForm.querySelector('.f8ps').innerHTML;
								}
								if (resultsMarkupForm.querySelector('[data-variant-id]') != null) {
									productFormSection.querySelector('[data-variant-id]').setAttribute('data-variant-id', selected_variant_id);
								}
								if (resultsMarkupForm.querySelector('.f8pr-pickup') != null) {
									Array.from(productFormSection.getElementsByClassName('f8pr-pickup')).forEach(function (el) {
										el.parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-pickup'), el);
									});
								}
								if (resultsMarkupForm.querySelector('.f8pr-stock') != null) {
									Array.from(productFormSection.getElementsByClassName('f8pr-stock')).forEach(function (el) {
										el.parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-stock'), el);
									});
								}
								if (resultsMarkupForm.querySelector('.f8pr-variant-selection') != null) {
									productFormSection.querySelector('.f8pr-variant-selection').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-variant-selection'), productFormSection.querySelector('.f8pr-variant-selection'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-selling-plan') != null) {
									Array.from(productFormSection.getElementsByClassName('f8pr-selling-plan')).forEach(function (el) {
										var newSellingPlanEl = resultsMarkupForm.querySelector('.f8pr-selling-plan[data-element="' + el.getAttribute('data-element') + '"]');
										newSellingPlanEl.classList = el.classList;
										el.parentNode.replaceChild(newSellingPlanEl, el);
									});
								}
								if (resultsMarkupForm.querySelector('.f8pr-codes') != null) {
									productFormSection.querySelector('.f8pr-codes').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-codes'), productFormSection.querySelector('.f8pr-codes'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-price') != null) {
									productFormSection.querySelector('.f8pr-price').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-price'), productFormSection.querySelector('.f8pr-price'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-product-form-installment') != null) {
									productFormSection.querySelector('.f8pr-product-form-installment').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-product-form-installment'), productFormSection.querySelector('.f8pr-product-form-installment'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-fallback-id-input') != null) {
									productFormSection.querySelector('.f8pr-fallback-id-input').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-fallback-id-input'), productFormSection.querySelector('.f8pr-fallback-id-input'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-buy-button') != null) {
									productFormSection.querySelector('.f8pr-buy-button').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-buy-button'), productFormSection.querySelector('.f8pr-buy-button'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-amount') != null) {
									productFormSection.querySelector('.f8pr-amount').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-amount'), productFormSection.querySelector('.f8pr-amount'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-preorder') != null) {
									productFormSection.querySelector('.f8pr-preorder').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-preorder'), productFormSection.querySelector('.f8pr-preorder'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-shipping-timer') != null && productFormSection.querySelector('.f8pr-shipping-timer') != null) {
									productFormSection.querySelector('.f8pr-shipping-timer').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-shipping-timer'), productFormSection.querySelector('.f8pr-shipping-timer'));
									countdownAsync();
								}
								if (resultsMarkupForm.querySelector('.f8pr-quantity-rules') != null) {
									productFormSection.querySelector('.f8pr-quantity-rules').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-quantity-rules'), productFormSection.querySelector('.f8pr-quantity-rules'));
								}
								if (resultsMarkupForm.querySelector('.f8pr-volume-pricing') != null) {
									productFormSection.querySelector('.f8pr-volume-pricing').parentNode.replaceChild(resultsMarkupForm.querySelector('.f8pr-volume-pricing'), productFormSection.querySelector('.f8pr-volume-pricing'));
								}
								if (hasSticky && (productFormTemplate.endsWith('main-product')) && (!isQuickshop)) {
									const stickyResultsMarkupForm = new DOMParser().parseFromString(sections['sticky-add-to-cart'], 'text/html');
									sticky.innerHTML = stickyResultsMarkupForm.getElementById('shopify-section-sticky-add-to-cart').innerHTML;
								}
								productFormSection.querySelector('form.f8pr').classList.remove('processing', 'unavailable');
								if (sticky) {
									sticky.classList.remove('processing', 'unavailable');
								}
							}
							if (isQuickshop) {
								if (document.querySelector('.l4pr').dataset.variantImage) {
									if (productFormSection.querySelector('.l4pr.no-thumbs-mobile')) {
										productFormSection.querySelector('.l4pr.no-thumbs-mobile').classList.add('no-thumbs-desktop');
									}
									if (productFormSection.querySelector('.l4pr.static')) {
										productFormSection.querySelector('.l4pr.static').classList.remove('static');
									}
									if (productFormSection.querySelector('.l4pr li.sticky')) {
										productFormSection.querySelector('.l4pr li.sticky').remove();
									}
									if (productFormSection.querySelector('.l4pr')) {
										productFormSection.querySelector('.l4pr').classList.remove('slider', 'slider-offset');
										productFormSection.querySelector('.l4pr').removeAttribute('data-spacing');
									}
								}
								if (productFormSection.querySelector('.f8pr-variant-selection') != null) {
									Array.from(productFormSection.querySelectorAll('.mobile-scroll')).forEach(function (el) {
										el.classList.remove('mobile-scroll');
									});
									productFormSection.querySelector('.f8pr-variant-selection').innerHTML = productFormSection.querySelector('.f8pr-variant-selection').innerHTML.replaceAll(productFormTemplate, `quickshop-${productFormTemplate}`).replaceAll(productFormId, `${productFormId}-quickshop`).replaceAll('quickshop-quickshop-', 'quickshop-');
									if (productFormSection.querySelector('.f8pr-variant-selection a[data-popup].initialized-popup')) {
										productFormSection.querySelector('.f8pr-variant-selection a[data-popup].initialized-popup').classList.remove('initialized-popup');
									}
								}
								const buyButton = productFormSection.querySelector('.f8pr-buy-button');
								if (buyButton && buyButton.getAttribute('id')) {
									let id = buyButton.getAttribute('id');
									if (!id.includes(`quickshop-${productFormTemplate}`))
										id = id.replaceAll(productFormTemplate, `quickshop-${productFormTemplate}`);
									if (!id.includes(`${productFormId}-quickshop`))
										id = id.replaceAll(productFormId, `${productFormId}-quickshop`);
									buyButton.id = id.replace(/(quickshop-)+/g, 'quickshop-').replace(/-$/, '');
								}
								if (productFormSection.querySelector('.f8pr-product-form-installment') != null) {
									productFormSection.querySelector('.f8pr-product-form-installment').innerHTML = productFormSection.querySelector('.f8pr-product-form-installment').innerHTML.replaceAll(productFormTemplate, `quickshop-${productFormTemplate}`).replaceAll(productFormId, `${productFormId}-quickshop`).replaceAll('quickshop-quickshop-', 'quickshop-');
								}
								if (productFormSection.querySelector('.f8pr-fallback-id-input') != null) {
									productFormSection.querySelector('.f8pr-fallback-id-input').innerHTML = productFormSection.querySelector('.f8pr-fallback-id-input').innerHTML.replaceAll(productFormTemplate, `quickshop-${productFormTemplate}`).replaceAll(productFormId, `${productFormId}-quickshop`);
								}
								if (productFormSection.querySelector('.pickup') != null) {
									Array.from(productFormSection.getElementsByClassName('pickup')).forEach(function (el) {
										el.remove();
									});
								}
								if (productFormSection.querySelector('.l4pr-container .m6tb')) {
									productFormSection.querySelector('.l4pr-container .m6tb').remove();
								}
							}
							if (resultsMarkupForm.querySelector('.l4pr').dataset.variantImage) {
								window.listProductSlider();
								updateSlidersAsync();
								fancyboxAsync();
							}
							if (resultsMarkupForm.querySelector('.l4pr').dataset.featured_media_position && resultsMarkupForm.querySelector('.l4pr').dataset.mediaSize > 1 && productFormSection.querySelector('.l4pr .swiper-outer') ) {
								var swiper = productFormSection.querySelector('.l4pr .swiper-outer').swiper;
								swiper.slideTo((resultsMarkupForm.querySelector('.l4pr').dataset.featured_media_position - 1), 500);
							}
							if (resultsMarkupForm.querySelector('.l4pr').dataset.featured_media_position > 0 && resultsMarkupForm.querySelector('.l4pr').classList.contains('static') && !html_tag.classList.contains('l4cl-cart-change')) {
								document.querySelector('#section-' + resultsMarkupForm.querySelector('.l4pr').id + '-'+resultsMarkupForm.querySelector('.l4pr').dataset.featured_media_position+'').scrollIntoView();
							}
							if (resultsMarkupForm.querySelector('#button-contactform #subject') != null) {
								document.querySelector('#button-contactform #subject').parentNode.replaceChild(resultsMarkupForm.querySelector('#button-contactform #subject'), document.querySelector('#button-contactform #subject'));
							}
							if (window.Shopify && Shopify.PaymentButton) {
								Shopify.PaymentButton.init();
							}
							productVariantsAsync()
							semanticSelectAsync()
							showHideDataElementAsync()
							sellingplansAsync()
							pickupAvailabilityAsync()
							modulePanelAsync()
							schemeTooltipAsync()
							popupsAsync()
							removeSDScss()
							semanticInputAsync()
							formZindex()
							dataChangeAscync()
							ratings()
							listProductSlider()
							listDropAsync()
							fancyboxAsync()
							rangeSliderAsync()
							recommendedProductsAsync()
							accordionAsync()
							countdownAsync()
							moduleTabsMobileAsync()
							recentlyViewedProducts()
							linkMoreAsync()
							window.formZindex();
							ajaxCart.init();
							if (hasSticky && (productFormTemplate.endsWith('main-product')) && (!isQuickshop) ) {
								stickyAddtoCartAsync();
							}
							window.sals();
							window.dispatchEvent(new CustomEvent("themeVariantUpdated"));
							if (general.template == 'product' && (productFormTemplate.endsWith('main-product')) && (!isQuickshop) ) {
								window.history.replaceState({}, '', `${newUrl}${selected_variant_id ? `?variant=${selected_variant_id}` : ''}`);
							}
						})
						.catch((error) => {
							console.log("Productform variant change error", error);
							throw error;
						});
				},1);
			});
		});
	} else if (product_card_add_to_cart.length) {
		productcardVariantsAsync();
	}
};
productVariantsAsync();

var stickyAddtoCartAsync = function () {
	var stickyAddToCart = document.querySelector('#sticky-add-to-cart');
	if (stickyAddToCart && stickyAddToCart.querySelector('#product_id_sticky:not(.listening)')) {
		asyncCSS();
		stickyAddToCart.querySelector('#product_id_sticky').classList.add('listening');
		stickyAddToCart.querySelector('#product_id_sticky').addEventListener('change', function(el) {
			setTimeout(function () {
				const select = document.querySelector('#main-product select[name="id"]');
				if (select) {
					select.value = el.target.value;
					select.dispatchEvent(changeEvent);
				} else {
					const inputs = document.querySelectorAll('#main-product input[type="radio"][name="id"]');
					Array.from(inputs).forEach(function (input) {
						if (input.value == el.target.value) {
							input.checked = true;
							input.dispatchEvent(changeEvent);
						} else {
							input.checked = false;
						}
					});
				}
				html_tag.classList.add('l4cl-cart-change');
				setTimeout(function () {
					html_tag.classList.remove('l4cl-cart-change');
				}, 500)
			},1);
		})
	}

	if (stickyAddToCart && stickyAddToCart.querySelector('#product_id_sticky')) {
		/* If product has variants, toggle */
		if(stickyAddToCart.querySelector('.open-variants button')) {
			stickyAddToCart.querySelector('.open-variants button').addEventListener('click', function(e) {
				e.preventDefault();
				this.style.opacity = '0';
				this.style.pointerEvents = 'none';
				stickyAddToCart.querySelector('.variant-wrap').style.display = '';
			});
		}

		/* Change product variant */
		stickyAddToCart.querySelector('#product_id_sticky').addEventListener('change', function(el) {
			setTimeout(function () {
				const select = document.querySelector('#main-product-content select[name="id"]');
				if (select) {
					select.value = el.target.value;
					select.dispatchEvent(changeEvent);
				} else {
					const inputs = document.querySelectorAll('#main-product-content input[type="radio"][name="id"]');
					Array.from(inputs).forEach(function (input) {
						if (input.value == el.target.value) {
							input.checked = true;
							input.dispatchEvent(changeEvent);
						} else {
							input.checked = false;
						}
					});
				}
				if(stickyAddToCart.querySelector('.open-variants button')) {
					setTimeout(function () {
						stickyAddToCart.querySelector('.open-variants button').style.opacity = '0';
						stickyAddToCart.querySelector('.open-variants button').style.pointerEvents = 'none';
						stickyAddToCart.querySelector('.variant-wrap').style.display = '';
					}, 500);
				}
			},1);
		})
	}
}
stickyAddtoCartAsync();

// Productpage selling plans
var sellingplansAsync = function () {
	var selling_plan_group_input = document.querySelectorAll('input[name="selling_plan_group"]');
	var selling_plan_input = document.querySelectorAll('input[name="selling_plan"]');
	if (selling_plan_group_input.length) {
		Array.from(selling_plan_group_input).forEach(function (el) {
			var productFormTemplate = el.dataset.template,
				productForm = document.querySelector('.m6pr-'+ productFormTemplate);
			el.addEventListener('change', function() {
				if (productForm.querySelector('input[id^="purchase_option_single"][name="selling_plan_group"]:checked') != null) {
					changeSellingPlanRequired(false, el.getAttribute('data-enable'));
				} else {
					changeSellingPlanRequired(true, el.getAttribute('data-enable'));
				}
			});
		});
		var changeSellingPlanRequired = function(addAttribute, container) {
			Array.from(selling_plan_input).forEach(function (el) {
				el.checked = false;
				el.removeAttribute('required');
				el.setAttribute('type', 'hidden');
				if (el.getAttribute('name')) {
					el.setAttribute('xname', el.getAttribute('name'));
					el.removeAttribute('name');
				}
				if (addAttribute && (el.closest('[data-element]').getAttribute('data-element') == container)) {
					el.setAttribute('required','required');
					el.setAttribute('type', 'radio');
					if (el.getAttribute('xname')) {
						el.setAttribute('name', el.getAttribute('xname'));
						el.removeAttribute('xname');
					}
				}
			});
		};
	}
};
sellingplansAsync();

// Productpage pickup availability
var pickupAvailabilityAsync = function() {
	var pickup_availability_anchor = document.querySelectorAll('[data-panel="pickup-availability"]');
	if (pickup_availability_anchor.length) {
		Array.from(pickup_availability_anchor).forEach(function (el) {
			el.addEventListener('click', function() {
				var selected_variant_id = el.dataset.id;
				fetch(window.Shopify.routes.root + 'variants/'+ selected_variant_id +'/?section_id=pickup-availability')
					.then((response) => {
						if (!response.ok) {
							var error = new Error(response.status);
							throw error;
						}
						return response.text();
					})
					.then((text) => {
						const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').getElementById('pickup-availability').innerHTML;
						var section = document.getElementById('pickup-availability');
						section.innerHTML = resultsMarkup;
						modulePanelAsync();
					})
					.catch((error) => {
						console.log("pickupAvailability error", error);
						throw error;
					});
			});
		});
	}
};
pickupAvailabilityAsync();

// Productpage recommended products
var recommendedProductsAsync = function() {
	var product_recommendations = document.querySelectorAll(".product-recommendations:not(.product-recommendations-initialized)");
	if (product_recommendations.length) {
		Array.from(product_recommendations).forEach(function (el) {
			el.classList.add('product-recommendations-initialized');
			var product_id = el.dataset.productId.split(','),
				limit = el.dataset.limit,
				template = el.dataset.template,
				intents = el.dataset.intent.split(','),
				count = 0,
				calls = intents.length * product_id.length;
			if (product_id === undefined) {
				document.getElementById('shopify-section-' + template).classList.remove('hidden');
				return;
			}
			if (el.classList.contains('cart-upsell')) {
				var cart_upsell = true;
			}
			var fetchRecommendedProducts = function(url, intent) {
				fetch(url)
					.then((response) => {
						if (!response.ok) {
							var error = new Error(response.status);
							throw error;
						}
						return response.text();
					})
					.then((text) => {
						count++;
						const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-' + template + ' .product-recommendations');
						if (calls == 1) {
							el.querySelector('article, .l4cl, .l4ca').innerHTML = resultsMarkup.querySelector('article, .l4cl, .l4ca').innerHTML;
						} else {
							Array.from(resultsMarkup.querySelector('article, .l4cl, .l4ca').children).forEach(function (em) {
								el.querySelector('article, .l4cl, .l4ca').appendChild(em);
							});
						}
						if (count == calls) {
							var seen = {};
							el.querySelectorAll('.l4ca > li[data-product-id]').forEach(function (el) {
								if (seen[el.dataset.productId]) {
									el.remove();
								} else {
									seen[el.dataset.productId] = true;
								}
							});
							if (el.querySelector('.l4cl, .l4ca') && el.querySelector('.l4cl, .l4ca').children.length == 0) {
								el.innerHTML = '';
								if (el.classList.contains('tab')) {
									el.closest('.m6tb').querySelector('nav ul li[data-index="'+ el.getAttribute('data-index') +'"]').remove();
									if (el.closest('.m6tb').querySelector('nav ul li a') != null) {
										el.closest('.m6tb').querySelector('nav ul li a').click();
									}
								}
								return;
							}
							if (resultsMarkup.getAttribute('data-hide') != null) {
								if (intent == 'related') {
									document.getElementById('shopify-section-' + template).innerHTML = ''; return;
								} else {
									el.innerHTML = '';
									return;
								}
							}
							if (resultsMarkup.querySelector('.l4cl[data-class]') != null) {
								el.querySelector('.l4cl[data-class]').classList.add(resultsMarkup.querySelector('.l4cl[data-class]').getAttribute('data-class'));
							}
							if (template && document.getElementById('shopify-section-' + template)) {
								document.getElementById('shopify-section-' + template).classList.remove('hidden');
							}
							el.classList.remove('hidden');
							if (el.querySelector('.l4cl').classList.contains('l4cl-hold')) {
								el.querySelector('.l4cl').classList.remove('l4cl-hold');
							}
							window.listProductSlider();
							window.listCollectionSlider();
							listScrollableAsync();
							window.formZindex();
							semanticInputAsync();
							window.ratings();
							schemeTooltipAsync();
							popupsAsync();
							semanticSelectAsync();
							productcardVariantsAsync();
              window.sals();
							window.checkLimit();
							ajaxCart.init();
							quickShop.init();
						}
					})
					.catch((error) => {
						console.log("recommendedProducts error", error);
						throw error;
					});
			};
			intents.forEach(function (intent) {
				if (el.classList.contains('cart-upsell') && intent == 'related') {
					limit = 4;
				}
				product_id.forEach(function (id) {
					var url = routes.product_recommendations_url + '?section_id=' + template + (limit ? '&limit=' + limit : '') + '&product_id=' + id + '&intent=' + intent;
					fetchRecommendedProducts(url, intent);
				});
			});
		});
	}
};
recommendedProductsAsync();

// Address page
var address_delete_button = document.getElementsByClassName("address-delete-button");
if (address_delete_button.length) {
	Array.from(address_delete_button).forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			if (confirm(el.dataset.confirmMessage)) {
				var form = document.createElement("form");
				form.setAttribute("method", 'post');
				form.setAttribute("action", el.dataset.target);
				var hiddenField = document.createElement("input");
				hiddenField.setAttribute("type", "hidden");
				hiddenField.setAttribute("name", '_method');
				hiddenField.setAttribute("value", 'delete');
				form.appendChild(hiddenField);
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}
		});
	});
}

// Product reviews button
var add_review_button = document.getElementsByClassName("spr-summary-actions-newreview");
if (add_review_button.length) {
	Array.from(add_review_button).forEach(function (el) {
		el.addEventListener('click', function (e) {
			Array.from(add_review_button).forEach(function (el) {
				el.remove();
			});
			setTimeout(function () {
				if (document.getElementsByClassName("new-review-form").length > 0) {
					document.getElementsByClassName("new-review-form")[0].scrollIntoView(true);
				}
			}, 10);
		});
	});
}

if (!enable_cart_drawer && document.querySelectorAll('.cart-count')) {
	fetch(window.Shopify.routes.root + 'cart.js')
		.then(response => response.json())
		.then(data => {
			Array.from(document.querySelectorAll('.cart-count')).forEach(function (el) {
				el.innerHTML = data.item_count;
			});
		})
		.catch((error) => {
			console.log("cartCount error", error);
		});
}

var address_form = document.getElementsByClassName('address-form');
if (address_form.length) {
	Array.from(address_form).forEach(function (el) {
		let countryInput = el.getElementsByClassName('address-country-option')[0],
			provinceInput = el.getElementsByClassName('address-province-option')[0],
			provinceInputContainer = el.getElementsByClassName('address-provinces')[0];
		let checkForProvinces = function(input) {
			let selected = input;
			setTimeout(function() {
				if (selected.options[selected.selectedIndex].dataset.provinces) {
					let provinces = JSON.parse(selected.options[selected.selectedIndex].dataset.provinces);
					if (provinces.length) {
						provinceInput.innerHTML = '';
						if (provinceInput.dataset.default) {
							var value = provinceInput.dataset.default;
						}
						Array.from(provinces).forEach(function (province) {
							if (value && (value == province[0] || value == province[1])) {
								provinceInput.innerHTML += '<option selected value="' + province[0] + '">' + province[1] + '</option>';
							} else {
								provinceInput.innerHTML += '<option value="' + province[0] + '">' + province[1] + '</option>';
							}
						});
						provinceInputContainer.style.display = '';
						if (provinceInputContainer.querySelector('.select-wrapper')) {
							provinceInputContainer.querySelector('.select-wrapper').parentNode.replaceChild(provinceInput, provinceInputContainer.querySelector('.select-wrapper'));
							provinceInput.classList.remove('semantic-select-initialized', 'select-init');
							provinceInput.removeAttribute('data-random');
							semanticSelectAsync();
						}
					} else {
						Array.from(provinceInput.querySelectorAll('options:not([value=""][disabled])')).forEach(function (el) {
							el.remove();
						});
						provinceInputContainer.style.display = 'none';
					}
				}
			}, 10);
		}
		if (countryInput.dataset.default) {
			var value = countryInput.dataset.default;
			for (var i = 0, count = countryInput.options.length; i < count; i++) {
				var option = countryInput.options[i];
				if (value == option.value || value == option.innerHTML) {
					option.setAttribute('selected', 'selected');
				}
			}
		}
		checkForProvinces(countryInput);
		countryInput.addEventListener("change", function() {
			checkForProvinces(this);
		});
	})
}

var checkbox_required = document.getElementsByClassName('checkbox-required');
if (checkbox_required.length) {
	Array.from(checkbox_required).forEach(function (form_el) {
		var inputs = form_el.getElementsByTagName('input');
		Array.from(inputs).forEach(function (input_el) {
			input_el.addEventListener('click', function (e) {
				checkIfChecked(form_el);
			});
		});
	});
	var checkIfChecked = function(form) {
		var checked = form.querySelector('input:checked');
		var inputs = form.getElementsByTagName('input');
		if (!checked) {
			if (inputs[0] != null) {
				inputs[0].setAttribute('required', '');
			}
		} else {
			if (inputs != null) {
				Array.from(inputs).forEach(function (el) {
					el.removeAttribute('required');
				});
			}
		}
	}
}

var module_maqruee = document.getElementsByClassName('m6kn');
if (module_maqruee.length) {
	new_css('css-marquee', a_css_marquee);
	loadRes(a_js_typewritter, function () {
		Array.from(module_maqruee).forEach(function (el) {
			var clone_me, clone_li, typewriter, alias = [],
				ul = el.children[0],
				li = ul.children,
				typing_delay = 'natural',
				div_by = 1;
			el.parentElement.classList.add('has-m6kn');
			if (!el.classList.contains('type')) {
				el.style.setProperty('--items', li.length);
				if (ul !== undefined && ul.clientWidth >= 0) {
					if (ul.clientWidth > 0) {
						div_by = ul.clientWidth;
					}
					for (var i = 0; i < Math.ceil(root_id.clientWidth / div_by) + 1; i++) {
						clone_me = el.children[0].cloneNode(true);
						el.appendChild(clone_me);
					}
					el.children[0].classList.add('clone');
				}
			} else {
				el.innerHTML = '<span class="inner">' + el.innerHTML + '</span>';
				for (var i = 0; i < li.length; i++) {
					alias.push(li[i].innerText);
				}
				if (el.classList.contains('fast')) {
					typing_delay = 50;
				}
				if (el.classList.contains('slow')) {
					typing_delay = 200;
				}
				if (el.hasAttribute('data-speed')) {
					typing_delay = parseFloat(el.getAttribute('data-speed'));
				}
				typewriter = new Typewriter(el.children[0], {
					loop: true,
					strings: alias,
					autoStart: true,
					delay: typing_delay
				});
			}
			el.classList.add('done');
		});
	});
}