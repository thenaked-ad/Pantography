/* -------------------------------------------

	Name:		Theme+
	Date:		2021/11/01

---------------------------------------------  */
/*global document */
/* //jshint esversion: 6 */

var theme_picker = document.getElementsByClassName('theme-picker');

if (theme_picker.length) {
	Array.from(theme_picker).forEach(function (el) {
		"use strict";
		el.getElementsByClassName('btn-toggle')[0].addEventListener('click', function (e) {
			el.classList.toggle('toggle');
			e.preventDefault();
		});
		el.getElementsByClassName('btn-close')[0].addEventListener('click', function (e) {
			el.classList.toggle('hidden');
			e.preventDefault();
		});
	});
}
