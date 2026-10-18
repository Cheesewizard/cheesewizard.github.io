(function () {
	'use strict';

	var gallery = document.querySelector('[data-screenshot-gallery]');
	if (!gallery) return;

	var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-item]'));
	var image = gallery.querySelector('[data-gallery-image]');
	var link = gallery.querySelector('[data-gallery-link]');
	var caption = gallery.querySelector('[data-gallery-caption]');
	var count = gallery.querySelector('[data-gallery-count]');
	var index = 0;

	caption.setAttribute('aria-live', 'polite');

	function show(nextIndex, shouldFocus) {
		index = (nextIndex + items.length) % items.length;
		var item = items[index];
		image.src = item.dataset.image;
		image.alt = item.dataset.alt;
		link.href = item.dataset.full;
		link.setAttribute('aria-label', 'View full-size image: ' + item.dataset.alt);
		caption.textContent = item.dataset.caption;
		count.textContent = (index + 1) + ' / ' + items.length;

		items.forEach(function (button, buttonIndex) {
			var isActive = buttonIndex === index;
			button.classList.toggle('is-active', isActive);
			button.removeAttribute('aria-current');
			button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});

		if (shouldFocus) items[index].focus();
	}

	function handleThumbnailKey(event, itemIndex) {
		var nextIndex = itemIndex;

		if (event.key === 'ArrowLeft') nextIndex = itemIndex - 1;
		else if (event.key === 'ArrowRight') nextIndex = itemIndex + 1;
		else if (event.key === 'Home') nextIndex = 0;
		else if (event.key === 'End') nextIndex = items.length - 1;
		else return;

		event.preventDefault();
		show(nextIndex, true);
	}

	items.forEach(function (item, itemIndex) {
		item.setAttribute('aria-label', item.dataset.alt);
		item.addEventListener('click', function () {
			show(itemIndex, false);
		});
		item.addEventListener('keydown', function (event) {
			handleThumbnailKey(event, itemIndex);
		});
	});

	gallery.querySelector('.screenshot-gallery-prev').addEventListener('click', function () {
		show(index - 1, false);
	});
	gallery.querySelector('.screenshot-gallery-next').addEventListener('click', function () {
		show(index + 1, false);
	});
	gallery.addEventListener('keydown', function (event) {
		if (event.target !== gallery) return;

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			show(index - 1, false);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			show(index + 1, false);
		} else if (event.key === 'Home') {
			event.preventDefault();
			show(0, false);
		} else if (event.key === 'End') {
			event.preventDefault();
			show(items.length - 1, false);
		}
	});

	gallery.tabIndex = 0;
	show(0, false);
}());
