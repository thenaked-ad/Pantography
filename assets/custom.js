/* -------------------------------------------

	Name:		Theme+
	Date:		2021/11/01

---------------------------------------------  */

'use strict';

var html_tag = document.documentElement,

	a_js_animations = window.filepaths['a_js_animations'],
	a_css_animations = window.filepaths['a_css_animations'],

	readMoreText = window.translations['readmore_text'];

function isTouchDevice() {
	if (window.matchMedia("(pointer: coarse)").matches) {
		return true;
	} else {
		return false;
	}
}
const isMobile = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

/**
 * Close dropdown element
 * @param {HTMLElement} element Parent element that receives the aria-expanded attribute
 */
function toggle_dropdowns_simple(el) {
	if (el.classList.contains('toggle')) {
		el.classList.remove('toggle');
	} else {
		el.classList.add('toggle');
	}
}

function findClass(className, array) {
	var elementsArray = [].slice.call(array);
	for (var index = 0; index < elementsArray.length; index++) {
		var element = elementsArray[index];
		if (element.className.indexOf(className) !== -1) {
			return true;
			// return element; // If you wish to return the element instead of true (comment out previous line if this option is used)
		}
	}
	return false;
	// return null; // If you wish to return null instead of false (comment out previous line if this option is used)
}

function append_url(el, content, className, href, access) {
	if (!findClass(className, Array.from(el.children))) {
		var link = createElementWithClass('a', className);
		if (href) {
			link.href = href;
		} else {
			link.href = './';
			link.setAttribute('role', 'button');
		}
		if (access === true) {
			link.setAttribute('tabindex', -1);
			link.setAttribute('aria-hidden', true);
			link.setAttribute('focusable', false);
		}
		link.innerHTML += content;
		el.appendChild(link);
	}
}


function wrap(el, wrapper, className) {
	el.parentNode.insertBefore(wrapper, el);
	if (className) {
		wrapper.classList.add(className);
	}
	wrapper.appendChild(el);
}

function new_css(id, href, media) {
	if (!document.getElementById(id)) {
		var a = document.createElement('link'),
			b = document.querySelectorAll('link[id]');
		if (media === undefined) {
			media = 'screen';
		}
		a.setAttribute('id', id);
		a.setAttribute('rel', 'stylesheet');
		a.setAttribute('href', href);
		a.setAttribute('media', media);
		a.setAttribute('id', id);

		if (b.length) {
			Array.from(b).forEach(function (el) {
				el.after(a);
			});
		} else {
			document.head.appendChild(a);
		}
	}
}

function loadRes(u, c, i) {
	if (html_tag.classList.contains(i)) {
		c();
		return true;
	}
	var s = document.createElement('script');
	s.src = u;
	s.async = true;
	s.onload = c;
	document.body.appendChild(s);
	if (!html_tag.classList.contains(i)) {
		html_tag.classList.add(i);
	}
	return true;
}

window.darkMode = function() {
	if (Cookies.get('darkmode') == 'on' || (html_tag.classList.contains('day-switched') && Cookies.get('darkmode') != 'off')) {
		document.documentElement.classList.add('day-switched');
	} else if (Cookies.get('darkmode') == undefined) {
		var link_day_timer = document.querySelector('.link-day.timer');
		if (link_day_timer) {
			var now = new Date(),
				show_from = new Date(),
				show_until = new Date(),
				show_from_hours = parseInt(link_day_timer.getAttribute('data-show-from')),
				show_until_hours = parseInt(link_day_timer.getAttribute('data-show-until'));
			show_from.setHours(show_from_hours);
			show_from.setMinutes(0, 0, 0);
			show_until.setHours(show_until_hours);
			show_until.setMinutes(0, 0, 0);
			if (show_from > show_until && now > show_until) {
				// example: start time is 17:00 and end time is 09:00, the current time is 13:00. The end time should be the next day
				show_until.setDate(show_until.getDate() + 1);
			} else if (show_from > show_until && now < show_until) {
				// example: start time is 17:00 and end time is 16:00, the current time is 13:00. The start time should be the previous day
				show_from.setDate(show_from.getDate() - 1);
			}
			if (show_from < now && show_until > now) {
				document.documentElement.classList.add('day-switched');
			}
		}
	}
}
darkMode();

function create_slider(el, settings, minSlides) {
	var sliderElement = el,
		sliderFigure = el.closest('figure'),
		divContent,
		items,
		paginationClass,
		dots,
		dots_cont,
		dost_cont2,
		dost_cont3,
		//fr_cont,
		prev,
		next;

	if (el.children.length > 1) {
		if (el.tagName.toLowerCase() === "ul") {
			requestAnimationFrame(() => {
				el.setAttribute('role', 'none');
				Array.from(el.children).forEach(child => {
					child.setAttribute('role', 'none');
					child.classList.add('li');
				});
			});
		}

		items = sliderElement.children;

		if (!minSlides) {
			minSlides = 1;
		}
		if (items.length > parseFloat(minSlides)) {
			paginationClass = (settings && settings.pagination && settings.pagination.el) || ".swiper-pagination";
			paginationClass = paginationClass.replace(/\./g, " ").trim();

			dots = createElementWithClass('span', paginationClass);
			prev = createElementWithClass('a', 'swiper-button-prev');
			next = createElementWithClass('a', 'swiper-button-next');
			sliderElement.classList.add('s4wi');

			prev.classList.add('swiper-button-nav');
			next.classList.add('swiper-button-nav');
			prev.setAttribute('role', 'button');
			next.setAttribute('role', 'button');

			if (el.hasAttribute('style')) {
				const sl_dl = getComputedStyle(el).getPropertyValue('--nav_delay');
				if (sl_dl.trim() !== "") {
					prev.setAttribute('data-sal', 'fade');
					next.setAttribute('data-sal', 'fade');
					prev.setAttribute('data-sal-delay', sl_dl);
					next.setAttribute('data-sal-delay', sl_dl);
				}
			}
			Array.from(items).forEach(el => wrap(el, document.createElement('div'), 'swiper-slide'));

			//sliderElement.innerHTML = '<div class="swiper-outer"><div class="swiper-wrapper">' + sliderElement.innerHTML + '</div></div> <div class="swiper-custom-pagination"></div>';
			const oldChildren = Array.from(sliderElement.childNodes);
			const swiperOuter = document.createElement('div');
			swiperOuter.className = 'swiper-outer';
			const swiperWrapper = document.createElement('div');
			swiperWrapper.className = 'swiper-wrapper';
			oldChildren.forEach(child => {
				swiperWrapper.appendChild(child);
			});
			swiperOuter.appendChild(swiperWrapper);
			sliderElement.innerHTML = '';
			sliderElement.appendChild(swiperOuter);
			const pagination = document.createElement('div');
			pagination.className = 'swiper-custom-pagination';
			sliderElement.appendChild(pagination);

			dots_cont = sliderElement.getElementsByClassName('swiper-custom-pagination')[0];
			dost_cont2 = createElementWithClass('div', 'swiper-custom-bullets');
			// this fixed the bug that when adding the swiper in the top, the pagination for the main swiper wasn't being created
			if (settings && settings.pagination) {
				settings.pagination.el = settings.pagination.el || "." + paginationClass;
				dots_cont.appendChild(prev);
				dots_cont.appendChild(dost_cont2);
				dost_cont3 = sliderElement.getElementsByClassName('swiper-custom-bullets')[0];
				dost_cont3.appendChild(dots);
				append_url(dost_cont3, 'Play/Pause', 'play-pause');
				dots_cont.appendChild(createElementWithClass('span', 'swiper-custom-fraction'));
				dots_cont.appendChild(next);

			} else {
				sliderElement.appendChild(prev);
				sliderElement.appendChild(next);
			}

			const swiperInstance = new Swiper(sliderElement.children[0], settings);

			const paginationBullets = sliderElement.querySelectorAll('.swiper-pagination-bullet');
			paginationBullets.forEach(bullet => bullet.setAttribute('role', 'navigation'));

			return swiperInstance;
			//return new Swiper(sliderElement.children[0], settings);
		}
	}

	return null;
}

function clone_with_class(el, cl1, cl2) {
	var cln = el.cloneNode(true);
	cln.classList.add(cl1);
	el.after(cln);
	el.classList.add(cl2);
}

function randomize(el) {
	el.setAttribute('data-random', Math.floor(Math.random() * 10000) + 1);
}

function new_js(el) {
	var tag = document.createElement('script');
	tag.setAttribute('defer', true);
	tag.src = el;
	document.body.appendChild(tag);
}

function throttle(callback, delay) {
	let timeoutId;
	return function () {
		if (!timeoutId) {
			timeoutId = setTimeout(() => {
				callback();
				timeoutId = null;
			}, delay);
		}
	};
}

function checkIfImageExists(url, callback) {
	const img = new Image();
	img.src = url;

	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};

		img.onerror = () => {
			callback(false);
		};
	}
}

// Prepare the DOM
var root_styles = document.querySelector(':root'),
	header_id = document.getElementsByClassName('shopify-section-header')[0],
	header_main = document.getElementById('header'),
	header_outer = document.getElementById('header-outer'),
	logo_id = document.getElementById('logo'),
	nav_id = document.getElementById('nav'),
	nav_outer = document.getElementById('nav-outer'),
	nav_top_outer = document.getElementById('nav-top-outer'),
	nav_outer_clone,
	m6fr_is_first = document.getElementsByClassName('m6fr-is-first');

// get --nav_top_h conditionally
let isDelayedCssVars = false;

window.delayedCssVars = function () {
	if (isDelayedCssVars) return;
	isDelayedCssVars = true;

	if (nav_top_outer) {
		root_styles.style.setProperty('--nav_top_h', nav_top_outer.clientHeight + 'px');
	}
	if (header_outer) {
		const header_outer_height = document.getElementById('header-outer').clientHeight + 'px';
		root_styles.style.setProperty('--header_height_static', header_outer_height);
		if (nav_outer) {
			if (header_outer && !nav_outer.classList.contains('sticky')) {
				root_styles.style.setProperty('--header_height', header_outer_height);
			} else {
				root_styles.style.setProperty('--header_height', nav_outer.clientHeight + 'px');
			}
		}
	}
	if (header_id) {
		root_styles.style.setProperty('--header_height_full', header_id.clientHeight + 'px');
	}
	const announcementBar = document.querySelector('.shopify-section-announcement-bar');
	if (announcementBar) {
		root_styles.style.setProperty('--ann_height', announcementBar.clientHeight + 'px');
	}
}

window.addEventListener('resize', throttle(() => {
	isDelayedCssVars = false;
	delayedCssVars();
}, 500));

const HD_req = ['.m6fr, #logo.text-center'];

if (!isDelayedCssVars && HD_req.some(selector => document.querySelector(selector))) {
	delayedCssVars();
	isDelayedCssVars = true;
}

if (m6fr_is_first.length) {
	html_tag.classList.add('has-first-m6fr-wide');
}

// get scrollbar width
let scrollbarWidthCalculated = false;

function getScrollbarWidth() {
	if (!scrollbarWidthCalculated) {
		requestAnimationFrame(() => {
			const htmlWidth = html_tag.getBoundingClientRect().width;
			const scrollbarWidth = window.innerWidth - htmlWidth;
			root_styles.style.setProperty('--scrollbar_width', scrollbarWidth + 'px');
			scrollbarWidthCalculated = true;
		});
	}
}

// onload
const SB_req = [".m6bx.wide", ".m6fr.wide", ".m6pr.fullwidth", ".m6fr.fullwidth", ".l4ft.fullwidth", ".media-wide", ".media-wide-mobile"];
if (SB_req.some(selector => document.querySelector(selector))) {
	getScrollbarWidth();
}

// Set the max-height for the megamenu dropdown when header is sticky
let isCustomDropHeight = false;

function customDropHeight() {
	if (isCustomDropHeight) return;
	isCustomDropHeight = true;

	requestAnimationFrame(() => {
		if (header_outer) {
			const dropHeight = window.innerHeight - header_outer.clientHeight;
			root_styles.style.setProperty('--drop_nav_mah', dropHeight + 'px');
		}
	});
}
window.addEventListener('resize', throttle(() => {
	isCustomDropHeight = false;
	customDropHeight();
}, 500));

window.headerHeight = function() {
	header_outer = document.getElementById('header-outer');
	nav_outer = document.getElementById('nav-outer');
	if (!(header_outer && nav_outer && !nav_outer.classList.contains('sticky') && !header_outer.classList.contains('no-sticky'))) {
		html_tag.classList.add('is-no-sticky');
	}
	if (header_outer && header_outer.classList.contains('no-sticky')) {
		html_tag.classList.add('header-static');
	}
	if (header_outer) {
		if (header_outer.classList.contains('transparent')) {
			html_tag.classList.add('has-transparent-header');
		}
		if (header_outer.classList.contains('has-shadow')) {
			html_tag.classList.add('header-has-shadow');
		} else {
			html_tag.classList.remove('header-has-shadow');
		}
	}
	html_tag.classList.add('dm-ready');
}
headerHeight();


if (!nav_outer) {
	nav_outer_clone = document.createElement('div');
	nav_outer_clone.innerHTML = '<nav id="nav"></nav>';
	nav_outer_clone.setAttribute('id', 'nav-outer');
	nav_outer_clone.classList.add('mobile-nav-container');
	if (header_outer) {
		header_outer.appendChild(nav_outer_clone);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	var header_id,
		header_inner,
		footer_id = document.getElementsByClassName('shopify-section-footer')[0],
		content_id = document.getElementById('content'),
		logo_id = document.getElementById('logo'),
		nav_main,
		nav_id = document.getElementById('nav'),
		search_id = document.getElementById('search'),
		top_bar = document.getElementsByClassName('shopify-section-announcement-bar'),
		top_bar_children,
		root_id = document.getElementById('root'),
		nav_top_id = document.getElementById('nav-top'),

		Default = {
			utils: {
				start: function () {
					html_tag.classList.add('js');
				},
				dom: function () {
					window.transparentHeader = function() {
						content_id = document.getElementById('content');
						header_outer = document.getElementById('header-outer');
						// See if "m6fr" is the first element in #content
						if (content_id && header_outer) {
              var ffa = content_id.children[0],
							ffc,
							ffd = false,
							ffe = false;

						  if (ffa !== undefined) {
                ffc = ffa.children[0];
                if (ffa.classList.contains('shopify-section') && header_outer.hasAttribute('data-transparent')) {
                  ffd = true;
                }
			  	if (ffc !== undefined && ffc.classList.contains('m6bx') && ffc.classList.contains('wide') || ffc !== undefined && ffc.classList.contains('m6fr') && ffc.classList.contains('wide')) {
                  ffe = true;
                }
				if (document.querySelectorAll('.shopify-section-header ~ [class*="shopify-section-announcement-bar"]').length) {
					ffd = false;
				}
                if (ffd === true && ffe === true && ffc.classList.contains('wide-transparent')) {
                  header_outer.classList.add('transparent');
									html_tag.classList.add('has-first-m6fr-wide');
									if (ffc.classList.contains('m6bx')) {
										html_tag.classList.add('has-first-m6bx-wide');
									} else {
										html_tag.classList.remove('has-first-m6bx-wide');
									}
                  if (ffc.classList.contains('flexible-section')) {
                    html_tag.classList.add('has-first-flexbile-wide');
                  } else {
					html_tag.classList.remove('has-first-flexbile-wide');
				  }
									html_tag.classList.remove('fixed-sticky');
									setTimeout(function () {
										html_tag.classList.remove('fixed-sticky');
									}, 1);
									ffc.classList.add('is-first-m6fr-wide');
									var firstSlide =  ffa.querySelectorAll('.swiper-slide-active article').length > 0 ? ffa.querySelectorAll('.swiper-slide-active article')[0] : ffa.querySelectorAll('article')[0];
                  var palette = firstSlide.getAttribute('data-color-palette')
                  if (palette != null) {
                    setTimeout(function(){
                      root_styles.style.setProperty('--transparent_header_fg', 'var(--' + palette.replace('_gradient', '') + '_fg)');
					  root_styles.style.setProperty('--transparent_header_fg_brightness', 'var(--' + palette + '_fg_brightness)');
					  var brightness = getComputedStyle(document.documentElement).getPropertyValue('--transparent_header_fg_brightness');
					  root_styles.style.setProperty('--transparent_header_fg_brightness', brightness);
                      root_styles.style.setProperty('--transparent_header_bg', 'var(--' + palette + '_bg)');
                      root_styles.style.setProperty('--transparent_header_btn_bg', 'var(--' + palette.replace('_gradient', '') + '_btn_bg)');
                      root_styles.style.setProperty('--transparent_header_btn_fg', 'var(--' + palette.replace('_gradient', '') + '_btn_fg)');
                    }, 0);
                  }
								} else {
									header_outer.classList.remove('transparent');
									html_tag.classList.remove('has-first-m6fr-wide');
									html_tag.classList.remove('m6fr-is-first');
                  html_tag.classList.remove('has-first-flexbile-wide');
								}
							}
						}
					}
					transparentHeader();
				},
				forms: function () {
					var form_children, select_tag = document.getElementsByTagName('select');
					window.formZindex = function () {

						// Assign z-indexes to form elements
						// :placeholder-like support for <select> element
						if (select_tag.length) {
							Array.from(select_tag).forEach(function (el) {
								el.parentNode.classList.add('has-select');
								if (el.closest('p') !== null) {
									el.closest('p').classList.add('has-select');
								}
								el.addEventListener('change', function () {
									el.classList.add('changed');
								});
							});
						}

						form_children = document.querySelectorAll('form > *, fieldset > *, .no-zindex, .no-zindex > *, .has-select, .f8pr > *, .l4cl form p, .f8pr-container > *');
						if (form_children.length) {
							Array.from(form_children).forEach(function (el, index) {
								el.style.zIndex = form_children.length - index;
							});
						}
					}
					window.formZindex();

					// :placeholder-like support for <select> element
					select_tag = document.getElementsByTagName('select');
					if (select_tag.length) {
						Array.from(select_tag).forEach(function (el) {
							el.addEventListener('change', function () {
								el.classList.add('changed');
							});
						});
					}

					window.checkLimit = function() {
						var check_limit = document.querySelectorAll('.check[data-limit]');
						if (check_limit.length) {
							Array.from(check_limit).forEach(function (el) {
								if (!el.classList.contains('check-limit-initialized')) {
									el.classList.add('check-limit-initialized');
									var tag_limit = 'span',
										limit,
										trigger,
										nextAll = false,
										last_desc;
									if (el.tagName.toLowerCase() === 'ul' || el.tagName.toLowerCase() === 'ol') {
										tag_limit = 'li';
									}
									limit = createElementWithClass(tag_limit, 'limit');
									trigger = el.children[el.dataset.limit - 1];

									if (trigger !== undefined) {
										nextAll = [].filter.call(trigger.parentNode.children, function (htmlElement) {
											return (htmlElement.previousElementSibling === trigger) ? nextAll = true : nextAll;
										});
										nextAll.forEach(function (em) {
											if (!em.classList.contains('hidden')) {
												em.classList.add('hidden-check');
											}
										});
										limit.innerText = '+' + Math.abs(el.querySelectorAll('li:not(.hidden, .tip-cont)').length - el.dataset.limit);
										el.append(limit);
										last_desc = el.querySelectorAll('li.hidden')[0];
										if (last_desc !== undefined) {
											el.appendChild(el.querySelectorAll('li.hidden')[0]);
										}
									}
								}
							});
						}
					};
					checkLimit();
				},
				top: function () {
					window.header = function() {
						header_main = document.getElementById('header');
						header_id = document.getElementsByClassName('shopify-section-header')[0];
						header_inner = document.getElementById('header-inner');
						header_outer = document.getElementById('header-outer');
						logo_id = document.getElementById('logo');
						nav_id = document.getElementById('nav');
						nav_outer = document.getElementById('nav-outer');

						if (logo_id) {
							var logo_text = logo_id.querySelectorAll('span');
							if (logo_text.length) {
								html_tag.classList.add('logo-is-text');
							}
							if (logo_id.classList.contains('text-center')) {
								html_tag.classList.add('logo-text-center');
							}
						}

						// Expandable nav
						if (nav_id) {
							if (nav_id.closest('#header-inner') !== null) {
								html_tag.classList.add('has-compact-nav');
							} else {
								html_tag.classList.remove('has-compact-nav');
							}
						}

						let hasJustify = false;
						if (nav_outer) {
							hasJustify = (nav_outer.classList.contains('have-text-justify') || nav_outer.classList.contains('text-justify')) && nav_outer.closest('#header-inner') !== null;
						}

						function countNavDist(el, em) {
							const d = el.dataset.copy;
							const f = nav_id.querySelector(`.show-all li[data-copy="${d}"]`);

							if (el.classList.contains('temp-hidden')) {
								el.classList.remove('temp-hidden');
								if (f) {
									f.classList.remove('temp-hidden');
								}
							}
							const nav_id_offset = (el.closest('#header-inner') !== null) ? nav_id.offsetLeft : 0;
							const jf = (el.closest('#nav-outer').classList.contains('text-justify') || el.closest('#nav-outer').classList.contains('have-text-justify')) ? 0 : el.clientWidth;
							const el_off = (html_tag.getAttribute('dir') === 'rtl') ? nav_id.clientWidth - el.offsetLeft - el.clientWidth - nav_id_offset : el.offsetLeft - nav_id_offset;
							let el_tr;
							if (el.parentElement.querySelectorAll('.temp-hidden:not(.show-all)').length > 0) {
								el_tr = 1.4;
							} else {
								el_tr = 0;
							}

							if (nav_id.getBoundingClientRect().width < el_off + el.getBoundingClientRect().width + jf + em * el_tr) {
								if (hasJustify) {
									if (el.previousElementSibling) {
										el.previousElementSibling.classList.add('temp-hidden');
									}
									if (f && f.previousElementSibling) {
										f.previousElementSibling.classList.add('temp-hidden');
									}
								} else {
									el.classList.add('temp-hidden');
									if (f) {
										f.classList.add('temp-hidden');
									}
								}
							} else {
								if (hasJustify) {
									if (el.previousElementSibling) {
										el.previousElementSibling.classList.remove('temp-hidden');
									}
									if (f && f.previousElementSibling) {
										f.previousElementSibling.classList.remove('temp-hidden');
									}
								} else {
									el.classList.remove('temp-hidden');
									if (f) {
										f.classList.remove('temp-hidden');
									}
								}
							}
						}

						function countNavDistF(el, em, en) {
							//enquire.register('screen and (min-width: 1001px)', function () {
							const mdm = Math.abs(parseFloat(getComputedStyle(el).getPropertyValue('margin-right')));
							const mdf = (nav_outer.classList.contains('text-justify') && !isNaN(mdm)) ? 0.5 * mdm : 0;

							const replaceTextClass = (originalClass, replacementClass) => {
								if (nav_outer.classList.contains(originalClass)) {
									nav_outer.classList.remove(originalClass);
									nav_outer.classList.add(replacementClass);
								}
							};

							if (el.clientWidth > nav_id.clientWidth + mdf) {
								html_tag.classList.add('has-long-nav');
								replaceTextClass('text-center', 'have-text-center');
								replaceTextClass('text-justify', 'have-text-justify');
								replaceTextClass('text-end', 'have-text-end');

								if (em.length) {
									en = em[0].clientWidth;
								}
								Array.from(el.children).forEach(function (eo) {
									countNavDist(eo, en);
									let resizeHandler = function () {
										if (!html_tag.classList.contains('search-compact-active') && html_tag.classList.contains('has-compact-nav')) {
											countNavDist(eo, en);
										}
									};
									//window.addEventListener('resize', resizeHandler);
									window.addEventListener('resize', throttle(resizeHandler, 200));
								});

							} else {
								html_tag.classList.remove('has-long-nav');
								replaceTextClass('have-text-center', 'text-center');
								replaceTextClass('have-text-justify', 'text-justify');
								replaceTextClass('have-text-end', 'text-end');
							}
							//});
						}

						if (nav_id) {
							var nmu = nav_id.querySelectorAll('[data-type]')[0],
								nml,
								nms = 0,
								nmt,
								all_submenu,
								logo_img;

							if (nmu) {
								nml = nmu.querySelectorAll('li.show-all');
								Array.from(nmu.children).forEach(function (el, index) {
									el.setAttribute('data-copy', nmu.children.length - index);
								});

								if (nml.length) {
									all_submenu = createElementWithClass('ul', 'show-all-submenu');
									nml[0].appendChild(all_submenu);
									nmt = nml[0].closest('ul').children;
									Array.from(nmt).forEach(function (el) {
										var clone_me = el.cloneNode(true);
										nml[0].querySelectorAll('.show-all-submenu')[0].appendChild(clone_me);
									});
									Array.from(nav_id.querySelectorAll('.show-all-submenu [class*="l4cl"]')).forEach(function (el) {
										el.setAttribute('data-class', el.getAttribute('class'));
										el.removeAttribute('class');
									});
									logo_img = logo_id.querySelector('img');

									function calcLogoOffset() {
										requestAnimationFrame(() => {
											if (header_main && logo_id && logo_id.classList.contains('text-center')) {
												root_styles.style.setProperty('--logo_offset', logo_id.offsetLeft / header_main.clientWidth * 100 + '%');
											}
										});
									}
									if (nav_outer.closest('#header-inner') !== null) {
										calcLogoOffset();
										setTimeout(function () {
											if (logo_img) {
												if (logo_img.complete) {
													calcLogoOffset();
													countNavDistF(nmu, nml, nms);
												}
												logo_img.addEventListener('load', function () {
													calcLogoOffset();
													countNavDistF(nmu, nml, nms);
												});
                        countNavDistF(nmu, nml, nms);
												header_outer.classList.add('ready');
												window.dispatchEvent(new Event('resize')); /* Force resize to calculate correct width */
											} else {
												const temp_hidden = nav_id.querySelectorAll('.temp-hidden');
												html_tag.classList.add('has-long-nav');
												if (temp_hidden.length > 0) {
													temp_hidden.forEach(el => el.classList.remove('temp-hidden'));
												}
												countNavDistF(nmu, nml, nms);
												header_outer.classList.add('ready');
											}
										}, 250);
									} else {
										countNavDistF(nmu, nml, nms);
										header_outer.classList.add('ready');
									}


									window.addEventListener('resize', throttle(() => {
										calcLogoOffset();
										var temp_hidden = nav_id.getElementsByClassName('temp-hidden');
										html_tag.classList.add('has-long-nav');
										header_outer.classList.remove('ready');
										Array.from(temp_hidden).forEach(function (el) {
											el.classList.remove('temp-hidden');
										});
										countNavDistF(nmu, nml, nms);
										header_outer.classList.add('ready');
									}, 200));

									function callback(mutationList, observer) {
										mutationList.forEach(function (mutation) {
											if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
												var temp_hidden = nav_id.getElementsByClassName('temp-hidden');
												nav_id.classList.add('tr');
												html_tag.classList.add('has-long-nav');
												Array.from(temp_hidden).forEach(function (el) {
													el.classList.remove('temp-hidden');
												});
												countNavDistF(nmu, nml, nms);
												nav_id.classList.remove('tr');
											}
										});
									}

									const observer = new MutationObserver(callback);
									observer.observe(nav_outer, {
										attributes: true
									});
								}
							}
							// Detect empty URLs
							Array.from(nav_id.querySelectorAll('li.sub > a[href="#"]')).forEach(function (el) {
								el.parentElement.classList.add('empty-url');
							});
							
							Array.from(nav_id.querySelectorAll('a > .s1bx')).forEach(function (el) {
								el.parentElement.classList.add('has-s1bx');
							});
						}
					}
					header();
				},
				footer: function () {
					window.footer = function() {
						footer_id = document.querySelector('.shopify-section-footer');
						// Togglable headers on mobile
						if (footer_id) {
							Array.from(footer_id.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(function (el) {
								append_url(el, 'Close', 'header-toggle');
								el.querySelector('a.header-toggle').addEventListener('click', function (e) {
									toggle_dropdowns_simple(el.parentElement);
									e.preventDefault();
								});
							});
						}
					}
					footer();
					window.background = function() {
						// Change the position of background element (just for security)
						if (document.querySelector('#background.done')) {
							document.querySelector('#background.done').remove();
						}
						var background_id = document.getElementById('background');
						if (background_id && header_outer && header_outer.classList.contains('transparent')) {
							html_tag.classList.add('has-background');
						}
						if (background_id && !background_id.classList.contains('static') && (background_id.parentNode.id === 'content' || background_id.parentNode.classList.contains('shopify-section'))) {
							document.getElementById('root').appendChild(background_id);
							background_id.classList.add('done');
						}
					}
					background();
				},
				mobile: function () {
					if (isMobile) {
						html_tag.classList.add('mobile');
					} else {
						html_tag.classList.add('no-mobile');
					}
				},
				done: function () {
					new_js(window.filepaths['a_js_custom_async']);
					if (Shopify.designMode) {
						new_js(window.filepaths['a_js_backend_listeners']);
					}
				},
				ratings: function () {
					window.ratings = function() {
						var rating_element = document.querySelectorAll('[data-val][data-of]:not(.rating-initialized)');
						if (rating_element.length) {
							Array.from(rating_element).forEach(function (el) {
								var reviewsElem = createElementWithClass('span', 'rating-label'),
									reviewsHead = createElementWithClass('span', 'rating-head'),
									reviewsHead_strong = el.querySelector('.strong'),
									reviews = el.innerHTML,
									rating = el.dataset.val,
									total = el.dataset.of;
								if (!el.classList.contains('s1ld')) {
									el.innerHTML = '';
									el.append(createRatingsHtmlElement(rating, total));
									reviewsElem.innerHTML = reviews;
								} else {
									reviewsElem.innerHTML = '<span class="bar" style="width: ' + rating / total * 100 + '%;"></span>';
								}
								el.appendChild(reviewsElem);
								if (reviewsHead_strong !== null) {
									reviewsHead.innerHTML = reviewsHead_strong.innerHTML;
								}
								el.prepend(reviewsHead);
								el.classList.add('rating-initialized');
							});
						}
					}
					ratings();
				},
				backgrounds: function () {
					var align_middle = document.getElementsByClassName('align-middle'),
						align_center = document.getElementsByClassName('align-center');
					if (align_middle.length) {
						Array.from(align_middle).forEach(function (el) {
							var em = el.parentNode,
								en = em.parentNode;
							if ((el.previousElementSibling === null && el.nextElementSibling === null && em.id === 'content') || (el.previousElementSibling === null && el.nextElementSibling === null && em.previousElementSibling === null && em.nextElementSibling === null && en.id === 'content')) {
								document.getElementById('content').classList.add('align-center');
							}
						});
					}
					if (align_center.length) {
						Array.from(align_center).forEach(function (el) {
							var em = el.parentNode,
								en = em.parentNode;
							if ((el.previousElementSibling === null && el.nextElementSibling === null && em.id === 'content') || (el.previousElementSibling === null && el.nextElementSibling === null && em.previousElementSibling === null && em.nextElementSibling === null && en.id === 'content')) {
								document.getElementById('content').classList.add('align-center-static');
							}
						});
					}
				},
				swipers: function () {
					var module_featured, list_panel_slider, list_testimonials, list_static, list_usp, popup_a, list_collection_slider, list_product_slider, data_update_product_slider, autoplay_top_int, media_flexible;

					var list_collection = document.getElementsByClassName('l4cl');
					if (list_collection.length) {
						Array.from(list_collection).forEach(function (el) {
							Array.from(el.querySelectorAll('li')).forEach(function (em) {
								if (em.querySelectorAll('picture ~ picture').length) {
									em.classList.add('has-picture-picture');
								}
							});
						});
					}

					window.moduleFeaturedSlider = function() {
						module_featured = document.querySelectorAll('.m6fr:not(.s4wi)');

						if (module_featured.length) {
							Array.from(module_featured).forEach(function (el) {
								var pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length,
									featuredSlider;
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay'))
									};
								}
								randomize(el);
								const randomId = el.getAttribute('data-random');

								if (el.children.length > 1 && el.classList.contains('wide')) {
									Array.from(el.children).forEach(function (em) {
										wrap(em, document.createElement('div'), 'article-container');
									});
								}
								featuredSlider = create_slider(el, {
									direction: 'horizontal',
									loop: true,
									autoHeight: true,
									autoplay: autoplay_int,
									threshold: 50,
									pagination: {
										el: '.swiper-pagination-' + randomId,
										clickable: true,
										type: pagination_type,
										renderBullet: function (index, className) {
											return '<span class="' + className + '">' + (index + 1) + "<span class='prg'></span></span>";
										}
									},
									navigation: {
										nextEl: `[data-random="${randomId}"] .swiper-button-next`,
										prevEl: `[data-random="${randomId}"] .swiper-button-prev`
									},
									on: {
										slideChangeTransitionStart: function (swiper) {
											var active_content = swiper.el.querySelectorAll('.swiper-slide[data-swiper-slide-index="' + swiper.realIndex + '"] article')[0];
											if (typeof active_content !== 'undefined') {
												el.setAttribute('data-active-content', active_content.getAttribute('class'));
											}
											if (swiper.realIndex > 0) {
												el.classList.add('changed');
											} else {
												el.classList.remove('changed');
											}
											if (swiper.realIndex + 1 === total_sl) {
												el.classList.add('last-slide-active');
											} else {
												el.classList.remove('last-slide-active');
											}
											if (el.classList.contains('is-first-m6fr-wide') && html_tag.classList.contains('has-first-m6fr-wide') && !html_tag.classList.contains('has-first-flexbile-wide')) {
												var palette = active_content.getAttribute('data-color-palette');
												root_styles.style.setProperty('--transparent_header_fg', 'var(--' + palette.replace('_gradient', '') + '_fg)');
												root_styles.style.setProperty('--transparent_header_fg_brightness', 'var(--' + palette + '_fg_brightness)');
												var brightness = getComputedStyle(document.documentElement).getPropertyValue('--transparent_header_fg_brightness');
												root_styles.style.setProperty('--transparent_header_fg_brightness', brightness);
												root_styles.style.setProperty('--transparent_header_bg', 'var(--' + palette + '_bg)');
												root_styles.style.setProperty('--transparent_header_btn_bg', 'var(--' + palette.replace('_gradient', '') + '_btn_bg)');
												root_styles.style.setProperty('--transparent_header_btn_fg', 'var(--' + palette.replace('_gradient', '') + '_btn_fg)');
											}
										},
										resize: function (swiper) {
											if (typeof Shopify !== 'undefined' && Shopify.designMode) {
												Array.from(featuredSlider.slides).forEach(function (slide) {
													featuredSlider.slideNext(0);
												});
											}
											setTimeout(function () {
												featuredSlider.updateAutoHeight();
											}, 500);
										}
									}
								});
								if (featuredSlider !== null && el.getAttribute('data-autoplay') && !el.classList.contains('no-controls')) {
									el.style.setProperty('--autoplay_duration', el.getAttribute('data-autoplay') + 'ms');
									el.getElementsByClassName('play-pause')[0].addEventListener('click', function (e) {
										if (el.classList.contains('paused')) {
											el.classList.remove('paused');
											featuredSlider.autoplay.start();
										} else {
											el.classList.add('paused');
											featuredSlider.autoplay.stop();
										}
										e.preventDefault();
									});
								}
								if (!isMobile && featuredSlider !== null && el.getAttribute('data-autoplay') && !el.classList.contains('paused')) {
									el.addEventListener('mouseleave', function () {
										el.classList.remove('paused');
										featuredSlider.autoplay.start();
									});
								}

								window.addEventListener('resize', throttle(function () {
									html_tag.classList.add('resized');
									if (featuredSlider !== null) {
										featuredSlider.updateAutoHeight();
									}
								}, 200), true);
								setTimeout(function () {
									if (featuredSlider !== null) {
										featuredSlider.updateAutoHeight();
									}
								}, 500);
							});

						}
					};
					moduleFeaturedSlider();

					window.topBar = function () {
						top_bar = document.querySelectorAll('.shopify-section-announcement-bar:not(.s4wi)');
						if (top_bar.length) {
							Array.from(top_bar).forEach(function (el) {
                top_bar_children = el.children[0];
								if (el !== null && el.children.length > 1) {
									autoplay_top_int = false;
									if (el.hasAttribute('data-autoplay')) {
										autoplay_top_int = {
											delay: parseFloat(el.getAttribute('data-autoplay')),
											pauseOnMouseEnter: true,
											disableOnInteraction: false
										};
									}
									if (el.getElementsByClassName('no-arrows').length) {
										el.classList.add('no-arrows');
									}
									if (el.getElementsByClassName('size-m').length) {
										el.classList.add('size-m');
									}
									if (el.getElementsByClassName('size-l').length) {
										el.classList.add('size-l');
									}
									if (el.getElementsByClassName('animated').length) {
										el.classList.add('animated');
									}
									randomize(el);
									create_slider(el, {
										direction: 'horizontal',
										loop: true,
										autoHeight: true,
										spaceBetween: window.innerWidth * 0.5,
										autoplay: autoplay_top_int,
										pagination: false,
										navigation: {
											nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
											prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
										}
									});
								}
							});
						}
					};
					topBar();

					window.listPanelSlider = function() {
						list_panel_slider = document.getElementsByClassName('l4ps');
						if (list_panel_slider.length) {
							Array.from(list_panel_slider).forEach(function (el) {
								var pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length;
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay')),
										pauseOnMouseEnter: true,
										disableOnInteraction: false
									};
								}
								randomize(el);
								create_slider(el, {
									direction: 'horizontal',
									loop: false,
									autoHeight: true,
									lazy: {
										loadPrevNext: true
									},
									autoplay: autoplay_int,
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										clickable: true,
										type: pagination_type
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									on: {
										slideChangeTransitionStart: function (swiper) {
											if (swiper.realIndex > 0) {
												swiper.$el[0].parentNode.classList.add('changed');
											} else {
												swiper.$el[0].parentNode.classList.remove('changed');
											}
											if (swiper.realIndex + 1 === total_sl) {
												swiper.$el[0].parentNode.classList.add('last-slide-active');
											} else {
												swiper.$el[0].parentNode.classList.remove('last-slide-active');
											}
										}
									}
								});
							});
						}
					};
					listPanelSlider();

					window.listTestimonialsSlider = function () {
						list_testimonials = document.querySelectorAll('.l4ts:not(.l4ts-initialized)');
						if (list_testimonials.length) {
							function removeClassByPrefix(el, prefix){
								for (var i = el.classList.length - 1; i >= 0; i--) {
									if (el.classList[i].startsWith(prefix)) {
										el.classList.remove(el.classList[i]);
									}
								}
							}
							Array.from(list_testimonials).forEach(function (el) {
								el.classList.add('l4ts-initialized');
								var items,
									pagination_type = 'bullets',
									autoplay_int = false,
									total_sl = el.children.length,
									loopme = false,
									mainSlider,
									options,
									hidden_el;
								if (el.classList.contains('width-25')) {
									items = [4, 2, 1];
								} else if (el.classList.contains('width-50')) {
									items = [2, 2, 1];
								} else if (el.classList.contains('width-100')) {
									items = [1, 1, 1];
								} else {
									items = [3, 2, 1];
								}
								if (el.classList.contains('slider-aside')) {
									items = [1, 1, 1];
									loopme = false;
								}
								if (el.getAttribute('data-autoplay')) {
									autoplay_int = {
										delay: parseFloat(el.getAttribute('data-autoplay')),
										pauseOnMouseEnter: true,
										disableOnInteraction: false
									};
								}
								randomize(el);
								options = {
									direction: 'horizontal',
									loop: loopme,
									autoHeight: true,
									spaceBetween: 32,
									slidesPerView: items[0],
									slidesPerGroup: items[0],
									autoplay: autoplay_int,
									pagination: {
										el: '.swiper-pagination-' + el.getAttribute('data-random'),
										clickable: true,
										type: pagination_type
									},
									navigation: {
										nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
										prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
									},
									on: {
										slideChangeTransitionStart: function (swiper) {
											if (swiper.realIndex > 0) {
												swiper.el.parentNode.classList.add('changed');
											} else {
												swiper.el.parentNode.classList.remove('changed');
											}
											if (swiper.realIndex + 1 === total_sl) {
												swiper.el.parentNode.classList.add('last-slide-active');
											} else {
												swiper.el.parentNode.classList.remove('last-slide-active');
											}
										},
										activeIndexChange: function (swiper) {
											var activeIndex = this.activeIndex,
												pt = swiper.el.parentNode.querySelectorAll('.l4ts-aside > li');
											Array.from(pt).forEach(function (em, index) {
												em.classList.remove('active');
												if (activeIndex === index) {
													em.classList.add('active');
												}
												removeClassByPrefix(em, 'palette-');
												if (index === activeIndex) {
												  if (el.getAttribute('data-color-palette') !== null) {
													em.setAttribute('class', el.getAttribute('data-color-palette') + ' ' + em.getAttribute('class'));
												  }
																		} else {
												  if (el.getAttribute('data-main-color-palette') !== null) {
													em.setAttribute('class', el.getAttribute('data-main-color-palette') + ' ' + em.getAttribute('class'));
												  }
												}
											});
										}
									},
									breakpoints: {
										0: {
											simulateTouch: false,
											allowTouchMove: false
										},
										761: {
											slidesPerView: items[1],
											slidesPerGroup: items[1],
											simulateTouch: true,
											allowTouchMove: true
										},
										1001: {
											slidesPerView: items[0],
											slidesPerGroup: items[0],
											simulateTouch: true,
											allowTouchMove: true
										}
									}
								};
								if (el.classList.contains('slider') && el.children.length > items[2]) {
									create_slider(el, options);
								}
								if (el.classList.contains('slider-aside') && el.children.length > 1) {
									mainSlider = create_slider(el, options);
									var sidebar_cont = document.querySelector('[data-random="' + el.getAttribute('data-random') + '"]');
									if (!sidebar_cont) return;

									var sidebar_nav = document.createElement('div');
									sidebar_nav.classList.add('l4ts-aside');
									sidebar_cont.prepend(sidebar_nav);

									Array.from(sidebar_cont.getElementsByTagName('li')).forEach(function (em, index) {
										em.classList.add('li');
										em.setAttribute('role', 'none');
										append_url(em, 'Go to slide', 'slider-aside-arrow');
										const clone_me = em.cloneNode(true);
										clone_me.removeAttribute('data-shopify-editor-block');
										if (!clone_me.getElementsByClassName('s1us').length) {
											clone_me.classList.add('hidden');
										}
										if (index > 0) {
											removeClassByPrefix(clone_me, 'palette-');
											if (el.getAttribute('data-main-color-palette') !== null) {
												clone_me.setAttribute('class', el.getAttribute('data-main-color-palette') + ' ' + clone_me.getAttribute('class'));
											}
										}
										sidebar_cont.getElementsByClassName('l4ts-aside')[0].appendChild(clone_me);
									});
									const l4tsFirst = sidebar_cont.querySelector('.l4ts-aside > .li:first-child');
									if (l4tsFirst) {
										l4tsFirst.classList.add('active');
									}
									if (el.hasAttribute('data-max')) {
										hidden_el = el.querySelectorAll('.l4ts-aside > .li:not(.hidden)');
										Array.from(hidden_el).forEach(function (em, index) {
											if (index > parseFloat(el.getAttribute('data-max')) - 1) {
												em.classList.add('hidden');
											}
										});
									}
									Array.from(sidebar_cont.getElementsByClassName('slider-aside-arrow')).forEach(function (em, i) {
										em.addEventListener('click', function (e) {
											mainSlider.slideTo(i);
											if (em.tagName.toLowerCase() === 'a') {
												e.preventDefault();
											}
										});
									});
								}
							});
						}
					};
					listTestimonialsSlider();

					window.listStaticSlider = function () {
						list_static = document.querySelectorAll('.l4st:not(.l4st-initialized)');
						if (list_static.length) {
							Array.from(list_static).forEach(function (el) {
								el.classList.add('l4st-initialized')
								if (!el.classList.contains('mobile-list')) {
									var pagination_type = 'bullets',
										autoplay_int = false,
										total_sl = el.children.length,
										cloned_mobile,
										firstFeatured,
										cln;
									if (el.getAttribute('data-autoplay')) {
										autoplay_int = {
											delay: parseFloat(el.getAttribute('data-autoplay')),
											pauseOnMouseEnter: true,
											disableOnInteraction: false
										};
									}
									randomize(el);
									clone_with_class(el, 'mobile-only', 'mobile-hide');
									cloned_mobile = el.nextElementSibling;
									firstFeatured = cloned_mobile.children[0];

									if (cloned_mobile.classList.contains('mobile-only')) {
										if (cloned_mobile.hasAttribute('id')) {
											cloned_mobile.removeAttribute('id');
										}
										if (firstFeatured !== undefined && firstFeatured.classList.contains('header')) {
											cln = firstFeatured.cloneNode(true);
											el.before(cln);
											firstFeatured.classList.add('mobile-hide');
											wrap(el.previousSibling, document.createElement('ul'), 'mobile-featured');
											el.previousSibling.classList.add('l4st', 'mobile-only');
											firstFeatured.remove();
										}
										create_slider(cloned_mobile, {
											direction: 'horizontal',
											loop: true,
											autoHeight: true,
											spaceBetween: 16,
											autoplay: autoplay_int,
											pagination: {
												el: '.swiper-pagination-' + el.getAttribute('data-random'),
												clickable: true,
												type: pagination_type
											},
											navigation: {
												nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
												prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
											},
											on: {
												slideChangeTransitionStart: function (swiper) {
													if (swiper.realIndex > 0) {
														swiper.el.parentNode.classList.add('changed');
													} else {
														swiper.el.parentNode.classList.remove('changed');
													}
													if (swiper.realIndex + 1 === total_sl) {
														swiper.el.parentNode.classList.add('last-slide-active');
													} else {
														swiper.el.parentNode.classList.remove('last-slide-active');
													}
												}
											}
										});
									}
								}
							});
						}
					}
					listStaticSlider();

					window.listUspSlider = function() {
						list_usp = document.querySelectorAll('.l4us:not(.l4us-initialized)');
						if (list_usp.length) {
							Array.from(list_usp).forEach(function (el, in1) {
								var options,
									autoplay_int = false,
									autowidth_int = 1,
									isSwiper,
									innerText;
								el.classList.add('l4us-initialized');
								Array.from(el.querySelectorAll('.swiper-button-prev, .swiper-button-next')).forEach(function (em) {
									em.remove();
								});

								Array.from(el.querySelectorAll('li')).forEach(function (em, in2) {
									if (el.closest('.shopify-section-header') !== null) {
										var innerText = em.innerHTML,
											linkable,
											linkedPopup,
											isSwiper;
										em.setAttribute('data-index', 'usp-' + in1 + in2);
										em.innerHTML = '<span class="outer"><span class="inner"><span class="nowrap">' + innerText + '</span></span> <a href="./" class="linked" data-popup="' + em.getAttribute('data-index') + '">' + readMoreText + '</a> <span class="inner-text">' + innerText + '</span></span>';
										em.setAttribute('data-index', 'usp-' + in1 + in2);
										Array.from(el.querySelectorAll('.inner-text a')).forEach(function (en) {
											en.setAttribute('tabindex', '-1');
										});
										em.classList.add('rendered');
										linkedPopup = document.createElement('div');
										var cls = em.className.split(' ');

										linkedPopup.classList.add('popup-a', 'made-by-l4us');
										linkedPopup.setAttribute('data-title', em.getAttribute('data-index'));
										linkedPopup.innerHTML = '<p class="' + cls.join(' ') + '">' + innerText + '</p>';
										root_id.appendChild(linkedPopup);
									}
									if (el.classList.contains('slider')) {
										append_url(em, 'Prev', 'swiper-button-prev');
										append_url(em, 'Next', 'swiper-button-next');
									}
								});
								if (el.children.length > 1 && el.classList.contains('slider') || el.classList.contains('slider-mobile')) {
									if (el.getAttribute('data-autoplay')) {
										autoplay_int = {
											delay: parseFloat(el.getAttribute('data-autoplay')),
											pauseOnMouseEnter: true,
											disableOnInteraction: false
										};
									}
									randomize(el);
									if (el.classList.contains('inline') && el.classList.contains('slider')) {
										autowidth_int = 'auto';
									}

									let space_between = 20;

									if (!(el.classList.contains('inline') && (el.classList.contains('slider') || el.closest('#nav-top-outer') !== null))) {
										space_between = window.innerWidth * 0.5;
									}
									autowidth_int = 'auto';
									options = {
										direction: 'horizontal',
										loop: true,
										loopedSlides: 4,
										pagination: false,
										autoplay: autoplay_int,
										slidesPerView: autowidth_int,
										autoHeight: true,
										spaceBetween: space_between,
										navigation: {
											nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
											prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
										},
										breakpoints: {
											0: {
												slidesPerView: 1,
												space_between: 20
											},
											761: {
												slidesPerView: autowidth_int,
												space_between: space_between
											}
										}
									};
									if (el.classList.contains('slider-mobile')) {
										clone_with_class(el, 'mobile-only', 'mobile-hide');
										el.nextElementSibling.removeAttribute('id');
										if (el.nextElementSibling.classList.contains('mobile-only')) {
											if (el.nextElementSibling.hasAttribute('id')) {
												el.nextElementSibling.removeAttribute('id');
											}
											Array.from(el.nextElementSibling.children).forEach(function (em) {
												var cln = em.cloneNode(true);
												el.nextElementSibling.appendChild(cln);
											});
											create_slider(el.nextElementSibling, options);
										}
									} else if (el.classList.contains('slider')) {
										Array.from(el.children).forEach(function (em) {
											var cln = em.cloneNode(true);
											el.appendChild(cln);
										});
										create_slider(el, options);
									}
								}
							});
						}
					}
					listUspSlider();

					popup_a = document.getElementsByClassName('popup-a');
					if (popup_a.length) {
						Array.from(popup_a).forEach(function (el) {
							Array.from(el.getElementsByClassName('l4cl')).forEach(function (el) {
								el.classList.add('in-popup');
							});
						});
					}

					window.listCollectionSlider = function() {
						list_collection_slider = document.querySelectorAll('.l4cl:not(.in-popup, .s4wi)');
						if (list_collection_slider.length) {
							Array.from(list_collection_slider).forEach(function (el) {
								var items, hasImg = false,
									autoHeight = true,
									loopMe = false,
									firstFeatured = el.children[0],
									spacing = 30,
									spacing_real = parseFloat(getComputedStyle(el).getPropertyValue('--cols_spacing')),
									cln,
									parent_li,
									collectionSlider;

								if (spacing_real > 0) {
									spacing = spacing_real;
								}
								if (firstFeatured !== undefined && firstFeatured.classList.contains('featured') ) {
									cln = firstFeatured.cloneNode(true);
									el.before(cln);
									firstFeatured.classList.add('mobile-hide');
									wrap(el.previousSibling, document.createElement('ul'), 'mobile-featured');
									el.previousSibling.classList.add('l4cl');
								}
								if (el.getAttribute('data-distance')) {
									spacing = parseFloat(el.getAttribute('data-distance'));
								}
								if (el.classList.contains('slider')) {
									if (typeof el.querySelectorAll('figure')[0] !== 'undefined' && !el.classList.contains('align-center')) {
										hasImg = true;
										el.querySelectorAll('figure')[0].classList.add('first-image');
									} else {
										el.classList.add('no-img');
									}
									if (el.classList.contains('text-justify')) {
										items = ['auto', 'auto', 'auto'];
										autoHeight = true;
									} else {
										if (el.classList.contains('width-5')) {
											items = [20, 6, 4];
										} else if (el.classList.contains('width-9')) {
											items = [11, 6, 4];
										} else if (el.classList.contains('width-10')) {
											items = [10, 6, 4];
										} else if (el.classList.contains('width-11')) {
											items = [9, 6, 4];
										} else if (el.classList.contains('width-12')) {
											items = [8, 6, 4];
										} else if (el.classList.contains('width-14')) {
											items = [7, 6, 4];
										} else if (el.classList.contains('width-16')) {
											items = [6, 5, 3];
										} else if (el.classList.contains('width-20')) {
											items = [5, 5, 3];
										} else if (el.classList.contains('width-25')) {
											items = [4, 4, 3];
										} else if (el.classList.contains('width-33')) {
											items = [3, 3, 3];
										} else if (el.classList.contains('width-50')) {
											items = [2, 2, 2];
										} else if (el.classList.contains('width-100')) {
											items = [1, 1, 1];
										} else {
											items = [4, 4, 3];
										}
									}
									randomize(el);
									const randomId = el.getAttribute('data-random');

									if (el.classList.contains('slider') && el.children.length > items[2]) {
										parent_li = el.closest('li.sub');
										collectionSlider = create_slider(el, {
											direction: 'horizontal',
											loop: loopMe,
											autoHeight: autoHeight,
											slidesPerView: items[0],
											spaceBetween: spacing,
											navigation: {
												nextEl: `[data-random="${randomId}"] .swiper-button-next`,
												prevEl: `[data-random="${randomId}"] .swiper-button-prev`
											},
											breakpoints: {
												0: {
													simulateTouch: false,
													allowTouchMove: false
												},
												761: {
													slidesPerView: items[2],
													simulateTouch: true,
													allowTouchMove: true
												},
												1001: {
													slidesPerView: items[1],
													simulateTouch: true,
													allowTouchMove: true
												},
												1101: {
													slidesPerView: items[0],
													simulateTouch: true,
													allowTouchMove: true
												}
											},
											on: {
												afterInit: function (swiper) {
													if (hasImg) {
														const f = swiper.el.querySelector('.first-image');
														if (f) {
															const h = f.clientHeight + 'px';
															swiper.navigation.prevEl.style.height = h;
															swiper.navigation.nextEl.style.height = h;
														}
													}
												},
												resize: function (swiper) {
													if (hasImg) {
														const f = swiper.el.querySelector('.first-image');
														if (f) {
															const h = f.clientHeight + 'px';
															swiper.navigation.prevEl.style.height = h;
															swiper.navigation.nextEl.style.height = h;
														}
													}
												},
												update: function (swiper) {
													if (hasImg) {
														const f = swiper.el.querySelector('.first-image');
														if (f) {
															const h = f.clientHeight + 'px';
															swiper.navigation.prevEl.style.height = h;
															swiper.navigation.nextEl.style.height = h;
														}
													}
												}
											}
										});
										if (parent_li !== undefined && parent_li !== null) {
											parent_li.addEventListener('mouseenter', function () {
												collectionSlider.update();
											});
										}
									}
								}
							});
						}
					};
					listCollectionSlider()
					window.listProductSlider = function() {
						list_product_slider = document.querySelectorAll('.l4pr:not(.list-product-initialized)');
						if (list_product_slider.length) {
							Array.from(list_product_slider).forEach(function (el) {
								el.classList.add('list-product-initialized');
								var mainSliderElement = el,
									children = mainSliderElement.children,
									qttChildren = children.length,
									qttChildCount,
									total_sl = el.children.length,
									spaceBetween_dist = 0,
									spaceBetween_real = parseFloat(getComputedStyle(el).getPropertyValue('--spacing')),
									mainSlider,
									slides,
									initial_slide = 0,
									slidesPerView = 1,
									firstModel = el.querySelectorAll('a > .model-3d:first-child model-viewer[poster]');

								if (children.length) {
									Array.from(children).forEach(function (el, index) {
										qttChildCount = qttChildren - index;
                    if (!el.classList.contains('has-anchor')) {
                      el.setAttribute('id', 'section-product-' + qttChildCount);
                    }
									});
								}

								Array.from(firstModel).forEach(function (em) {
									var staticPoster = document.createElement('img'),
										staticPosterWrapper = document.createElement('picture');
									staticPoster.setAttribute('src', em.getAttribute('poster'));
									staticPoster.setAttribute('data-src', em.getAttribute('poster'));
									staticPosterWrapper.prepend(staticPoster);
									staticPosterWrapper.classList.add('just-poster');
									if (em.hasAttribute('alt')) {
										staticPoster.setAttribute('alt', em.getAttribute('alt'));
									}
									em.closest('a').prepend(staticPosterWrapper);
								});
								// clone all slides before swiper uses them and change the DOM - used to create custom pagination
								slides = mainSliderElement.cloneNode(true).children;

								randomize(el);

								if (el.closest('.m6pn:not(.m6pr-wide)') !== null) {
									el.classList.add('in-m6pn');
								} else if (!el.classList.contains('slider') ) {
									clone_with_class(el, 'mobile-only', 'mobile-hide');
									mainSliderElement = el.nextElementSibling;
									if (el.hasAttribute('id')) {
										el.nextElementSibling.setAttribute('id', el.getAttribute('id'));
										el.setAttribute('id', el.getAttribute('id') + '-desktop');
									}
								}
								if (el.classList.contains('offset') && el.closest('.m6pn') === null) {
									slidesPerView = 'auto';
									spaceBetween_dist = el.dataset.spacing;
								}
								if (el.classList.contains('offset') && spaceBetween_real >= 0) {
									spaceBetween_dist = spaceBetween_real;
								}
								if (el.getAttribute('data-featured_media_position')) {
									initial_slide = parseFloat(el.getAttribute('data-featured_media_position')) - 1;
								}

								if (mainSliderElement.classList.contains('slider') || mainSliderElement.classList.contains('mobile-only') || mainSliderElement.classList.contains('in-m6pn')) {
									mainSlider = create_slider(mainSliderElement, {
										direction: 'horizontal',
										loop: false,
										autoHeight: true,
										preloadImages: false,
										initialSlide: initial_slide,
										spaceBetween: spaceBetween_dist,
										slidesPerView: slidesPerView,
										pagination: {
											el: '.swiper-pagination-' + el.getAttribute('data-random'),
											clickable: true,
											renderBullet: function (index, className) {
												if (slides[index] !== undefined) {
													var finalSpan = document.createElement("a"),
														img_type,
														add_class,
														img,
														divFlex,
														divNo,
														moreLink,
														icon,
														span,
														a_thumb,
														a_thumb_img,
														a_thumb_pic,
														a_thumb_pic_class;
													finalSpan.classList.add(className);
													if (slides[index].hasAttribute('class')) {
														add_class = slides[index].getAttribute('class');
														if (add_class.includes('portrait')) {
															finalSpan.classList.add('portrait');
														}
														if (add_class.includes('landscape')) {
															finalSpan.classList.add('landscape');
														}
														if (add_class.includes('auto')) {
															finalSpan.classList.add('auto');
															finalSpan.classList.remove('landscape', 'portrait');
														}
													}
													if (slides[index].querySelector("picture")) {
														img_type = 'picture';
													} else {
														img_type = 'img';
													}
													img = slides[index].querySelector(img_type);
													a_thumb = img.closest('a[data-gallery-thumb]');
													a_thumb_img = document.createElement('img');
													a_thumb_pic = document.createElement('picture');
	
													if (a_thumb !== null && img !== null) {
														a_thumb_img.setAttribute('src', a_thumb.getAttribute('data-gallery-thumb'));
														a_thumb_pic_class = a_thumb.querySelectorAll('picture[class]')[0];
														if (a_thumb_pic_class) {
															var classes = a_thumb_pic_class.getAttribute('class').split(' ');
                                                            Array.from(classes).forEach(function (str) {
                                                                a_thumb_pic.classList.add(str);
                                                            });
														}
														a_thumb_img.setAttribute('alt', 'Thumbnail');
														a_thumb_pic.appendChild(a_thumb_img);
														finalSpan.appendChild(a_thumb_pic);
													} else {
														if (img) {
															finalSpan.appendChild(img);
														}
													}
	
													divFlex = document.createElement("span");
													divNo = document.createElement("span");

													divNo.classList.add('crnt-no');
	
													icon = slides[index].querySelector("i[class^=icon-]");
													if (icon) {
														divFlex.appendChild(icon);
													}
	
													finalSpan.appendChild(divFlex);
													finalSpan.appendChild(divNo);

													return finalSpan.outerHTML;
												}
											}
										},
										navigation: {
											nextEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-next',
											prevEl: '[data-random="' + el.getAttribute('data-random') + '"] .swiper-button-prev'
										},
										breakpoints: {
											0: {
												spaceBetween: 0,
												slidesPerView: 1
											},
											761: {
												spaceBetween: spaceBetween_dist
											}
										},
										on: {
											afterInit: function (swiper) {
												const labels = swiper.el.getElementsByClassName('label');
												if (labels.length > 0) {
													swiper.el.parentNode.appendChild(labels[0]);
												}
											},
											activeIndexChange: function (swiper) {
												const crt = swiper.activeIndex + 1;
												const isCrtGreaterThanNine = crt > 9;
												Array.from(mainSliderElement.getElementsByClassName('crnt-no')).forEach(function (em) {
													em.innerText = crt;
													if (isCrtGreaterThanNine) {
														em.classList.add('high');
													} else {
														em.classList.remove('high');
													}
												});

												Array.from(swiper.el.querySelectorAll('video')).forEach(function (video) {
													video.pause();
												});
												const activeSlide = swiper.slides[swiper.activeIndex];
												if (activeSlide) {
													const video = activeSlide.querySelector('video');
													if (video) {
														video.play();
													}
												}
											}
										}
									});
								}
							});
						}
					};
					listProductSlider();

          window.mediaFlexible = function() {
            media_flexible = document.getElementsByClassName('media-flexible');
            if (media_flexible.length) {
              Array.from(media_flexible).forEach(function (el) {
			  if ((!el.parentElement.classList.contains('flexible-stack') && (el.classList.contains('slider-mobile') || el.parentElement.classList.contains('mobile-static'))) && (!el.classList.contains('media-flexible-initialized'))) {
				  var cloned_mobile, link, emc, pt = el.parentElement,
					  tag = document.createElement('div'),
				  		fl = pt.querySelectorAll('.media-flexible:not(.mobile-hide-media-flexible) > *:not(.mobile-hide-media-flexible)');
				  if (!el.parentElement.getElementsByClassName('media-flexible-mobile').length) {
					  tag.classList.add('media-flexible-mobile');
					  el.after(tag);
					  el.classList.add('mobile-hide');
					  cloned_mobile = pt.getElementsByClassName('media-flexible-mobile')[0];
					  Array.from(fl).forEach(function (em) {
						  // console.log(em)
						  emc = em.cloneNode(true);
						  cloned_mobile.appendChild(emc);
					  });
					  if (cloned_mobile.classList.contains('media-flexible-mobile')) {
						  cloned_mobile.classList.remove('media-flexible');
						  cloned_mobile.classList.remove('mobile-hide');
						  if (cloned_mobile.hasAttribute('id')) {
							  cloned_mobile.removeAttribute('id');
						  }

						  Array.from(cloned_mobile.children).forEach(function (el) {
							  if (el.classList.contains('mobile-hide')) {
                                  el.remove();
                              }
						  });
						  randomize(cloned_mobile);
						  if (!cloned_mobile.classList.contains('s4wi')) {
							  create_slider(cloned_mobile, {
								  direction: 'horizontal',
								  loop: true,
								  autoHeight: true,
								  pagination: {
									  el: '.swiper-pagination-' + cloned_mobile.getAttribute('data-random'),
									  clickable: true,
									  type: 'bullets',
									  renderBullet: function (index, className) {
										  return '<span class="' + className + '">' + (index + 1) + "<span class='prg'></span></span>";
									  }
								  },
								  on: {
									  slideChangeTransitionStart: function (swiper) {
										  var active_content = swiper.el.querySelectorAll('.swiper-slide[data-swiper-slide-index="' + swiper.realIndex + '"] > *')[0];
										  if (typeof active_content !== 'undefined') {
											  el.setAttribute('data-active-content', active_content.getAttribute('data-color-palette'));
										  }
									  }
								  }
							  });
						  }
					  }
				  }
                  el.classList.add('media-flexible-initialized');
                }
              });
            }
          }
          mediaFlexible();

				}
			}
		};

	Default.utils.start();
	Default.utils.dom();
	Default.utils.mobile();
	Default.utils.top();
	Default.utils.forms();
	Default.utils.footer();
	Default.utils.swipers();
	Default.utils.ratings();
	Default.utils.backgrounds();
	Default.utils.done();
});

/*!*/
window.sals = function() {
  // Animations .t1an
  // NOTE: this plugin will animate only the elements with the [data-sal] attribute defined.
  var data_sal = document.querySelectorAll('[data-sal]');
  if (data_sal.length) {
    loadRes(a_js_animations, function () {
      new_css('animations-css', a_css_animations);
      sal({
        threshold: 0.2,
        once: true
      });
    }, 'animations-loaded');
  }
}
sals();

function countPrefixSuffix() {
	var input_prefix, input_suffix;
	// Padding for ".input-prefix" element
	input_prefix = document.querySelectorAll('.input-prefix > span:first-child');
	if (input_prefix.length) {
		Array.from(input_prefix).forEach(function (el) {
			var c = el.nextElementSibling;
			if (html_tag.getAttribute('dir') === 'rtl') {
				c.style.paddingRight = el.offsetWidth + 'px';
			} else {
				c.style.paddingLeft = el.offsetWidth + 'px';
			}
		});
	}
	// Padding for ".input-suffix" element
	input_suffix = document.querySelectorAll('.input-suffix > span:first-child');
	if (input_suffix.length) {
		Array.from(input_suffix).forEach(function (el) {
			var c = el.nextElementSibling;
			if (html_tag.getAttribute('dir') === 'rtl') {
				c.style.paddingLeft = el.offsetWidth + 'px';
			} else {
				c.style.paddingRight = el.offsetWidth + 'px';
			}
		});
	}
}
setTimeout(function () {
	countPrefixSuffix();
}, 500);

window.addEventListener("showAlert", function(event) {
	var messageText = event.detail.message,
		messageType = event.detail.type,
		messageHeader = event.detail.header ? event.detail.header : false,
		messageOrigin = event.detail.origin ? 'message-' + event.detail.origin : false,
		messageLocation = event.detail.location ? event.detail.location : 'footer',
		messageColor = '';
	switch(messageType) {
		case "success":
			messageColor = 'valid';
			if (!messageHeader) { messageHeader =  window.translations.general_alerts_success_text; }
			break;
		case "info":
			messageColor = 'alert';
			if (!messageHeader) { messageHeader = window.translations.general_alerts_info_text; }
			break;
		case "error":
			messageColor = 'error';
			if (!messageHeader) { messageHeader = window.translations.general_alerts_error_text; }
			break;
		default:
			messageColor = 'valid';
			if (!messageHeader) { messageHeader = ''; }
	}
	var message = '<li class="overlay-'+ messageColor +' '+ messageOrigin +'"><span>'+ messageText +'</span></li>';
	var list_alerts = document.querySelector('#root > .l4al:not(.inline)');

	if (list_alerts === null || messageLocation == 'cartpanel') {
		list_alerts = document.createElement("ul");
		list_alerts.classList.add('l4al');
		if (messageLocation == 'footer') {
			document.getElementById('root').appendChild(list_alerts);
		} else if (messageLocation == 'cartpanel' && document.getElementById('cart')) {
			list_alerts.setAttribute('data-delay', 2000);
			document.getElementById('cart').insertBefore(list_alerts, document.getElementById('cart').querySelector('.l4ca'));
		} else {
			document.getElementById('root').appendChild(list_alerts);
		}
	}
	if ((messageOrigin && list_alerts.getElementsByClassName(messageOrigin).length == 0) || !messageOrigin) { // Prevent double messages (multiple of the same forms are being triggered when posted in shopfiy)
		list_alerts.innerHTML += message;
	}
	if (typeof window.listAlertsAsync != 'undefined') { window.listAlertsAsync(); }
}, false);


window.lazyVideo = function () {
	var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));
	if ("IntersectionObserver" in window) {
		var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(video) {
				if (video.isIntersecting) {
					for (var source in video.target.children) {
						var videoSource = video.target.children[source];
						if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
							videoSource.src = videoSource.dataset.src;
						}
					}

					video.target.load();
					video.target.classList.remove("lazy");
					lazyVideoObserver.unobserve(video.target);
				}
			});
		});

		lazyVideos.forEach(function(lazyVideo) {
			lazyVideoObserver.observe(lazyVideo);
		});
	}
}
document.addEventListener("DOMContentLoaded", function() {
	lazyVideo();
});