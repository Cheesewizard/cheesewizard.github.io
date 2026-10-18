(function () {
	'use strict';

	function createUniqueId(base) {
		var id = base;
		var suffix = 1;

		while (document.getElementById(id)) {
			id = base + '-' + suffix;
			suffix += 1;
		}

		return id;
	}

	function isPlainPrimaryClick(event) {
		return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
	}

	var captionId = createUniqueId('expanded-image-caption');
	var viewer = document.createElement('dialog');
	viewer.className = 'image-viewer';
	viewer.setAttribute('aria-labelledby', captionId);
	viewer.innerHTML = '<button type="button" class="image-viewer-close" aria-label="Close expanded screenshot">Close</button><img alt=""><p id="' + captionId + '"></p>';
	document.body.append(viewer);

	var expandedImage = viewer.querySelector('img');
	var expandedCaption = viewer.querySelector('p');
	var closeButton = viewer.querySelector('.image-viewer-close');
	var activeTrigger = null;

	function closeViewer() {
		viewer.close();
	}

	function getCaption(link, image) {
		var figure = link.closest('figure');
		var caption = figure ? figure.querySelector('figcaption') : null;
		return caption && caption.textContent.trim() ? caption.textContent.trim() : image.alt;
	}

	function expand(link, trigger) {
		var image = link.querySelector('img');
		if (!image) return;

		activeTrigger = trigger || link;
		expandedImage.src = link.href;
		expandedImage.alt = image.alt;
		expandedCaption.textContent = getCaption(link, image);
		document.documentElement.classList.add('image-viewer-open');
		document.body.classList.add('image-viewer-open');
		viewer.showModal();
		closeButton.focus();
	}

	closeButton.addEventListener('click', closeViewer);
	viewer.addEventListener('click', function (event) {
		if (event.target === viewer) closeViewer();
	});
	viewer.addEventListener('close', function () {
		expandedImage.removeAttribute('src');
		document.documentElement.classList.remove('image-viewer-open');
		document.body.classList.remove('image-viewer-open');

		if (activeTrigger && activeTrigger.isConnected) activeTrigger.focus();
		activeTrigger = null;
	});

	var links = new Set();
	document.querySelectorAll('[data-gallery-link], .case-media a, .case-figure a').forEach(function (link) {
		if (link.querySelector('img') && (link.hasAttribute('data-gallery-link') || /\.(webp|png|jpe?g|gif|avif)(?:[?#]|$)/i.test(link.href))) links.add(link);
	});

	links.forEach(function (link) {
		link.addEventListener('click', function (event) {
			if (!isPlainPrimaryClick(event)) return;
			event.preventDefault();
			expand(link, link);
		});
	});

}());
