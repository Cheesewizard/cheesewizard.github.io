(function () {
	'use strict';
	var gallery = document.querySelector('[data-stat-gallery]');
	if (!gallery) return;
	var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-item]'));
	var image = gallery.querySelector('[data-gallery-image]');
	var link = gallery.querySelector('[data-gallery-link]');
	var caption = gallery.querySelector('[data-gallery-caption]');
	var count = gallery.querySelector('[data-gallery-count]');
	var index = 0;

	function show(nextIndex) {
		index = (nextIndex + items.length) % items.length;
		var item = items[index];
		image.src = item.dataset.image;
		image.alt = item.dataset.alt;
		link.href = item.dataset.full;
		caption.textContent = item.dataset.caption;
		count.textContent = (index + 1) + ' / ' + items.length;
		items.forEach(function (button, buttonIndex) {
			button.classList.toggle('is-active', buttonIndex === index);
			button.setAttribute('aria-current', buttonIndex === index ? 'true' : 'false');
		});
	}

	items.forEach(function (item, itemIndex) {
		item.setAttribute('aria-label', item.dataset.alt);
		item.addEventListener('click', function () { show(itemIndex); });
	});
	gallery.querySelector('.stat-gallery-prev').addEventListener('click', function () { show(index - 1); });
	gallery.querySelector('.stat-gallery-next').addEventListener('click', function () { show(index + 1); });
	gallery.addEventListener('keydown', function (event) {
		if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
		if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
		if (event.key === 'Home') { event.preventDefault(); show(0); }
		if (event.key === 'End') { event.preventDefault(); show(items.length - 1); }
		if (event.key === 'Enter' && (event.target === gallery || event.target === image)) link.click();
	});
	gallery.tabIndex = 0;
	show(0);
}());
