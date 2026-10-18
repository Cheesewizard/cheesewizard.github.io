(function () {
	'use strict';

	var galleries = document.querySelectorAll('[data-commercial-gallery]');

	galleries.forEach(function (gallery) {
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
			link.setAttribute('aria-label', 'View full-size image: ' + item.dataset.alt);
			caption.textContent = item.dataset.caption;
			count.textContent = (index + 1) + ' / ' + items.length;

			items.forEach(function (button, buttonIndex) {
				var isActive = buttonIndex === index;
				button.classList.toggle('is-active', isActive);
				button.setAttribute('aria-current', isActive ? 'true' : 'false');
			});
		}

		items.forEach(function (item, itemIndex) {
			item.addEventListener('click', function () {
				show(itemIndex);
			});
		});

		gallery.querySelector('[data-gallery-previous]').addEventListener('click', function () {
			show(index - 1);
		});

		gallery.querySelector('[data-gallery-next]').addEventListener('click', function () {
			show(index + 1);
		});

		gallery.addEventListener('keydown', function (event) {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				show(index - 1);
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				show(index + 1);
			}

			if (event.key === 'Home') {
				event.preventDefault();
				show(0);
			}

			if (event.key === 'End') {
				event.preventDefault();
				show(items.length - 1);
			}
		});

		show(0);
	});
}());

