"use strict";

document.querySelectorAll(".lighting-demo").forEach(demo => {
	const frame = demo.querySelector(".lighting-demo-frame");
	const image = frame.querySelector("img");
	const canvas = frame.querySelector("canvas");
	const status = demo.querySelector(".lighting-demo-note");
	const azimuthInput = demo.querySelector("[data-lighting-azimuth]");
	const lengthInput = demo.querySelector("[data-lighting-length]");
	const azimuthOutput = demo.querySelector("[data-lighting-azimuth-output]");
	const lengthOutput = demo.querySelector("[data-lighting-length-output]");
	const foregroundImage = new Image();
	const shadowPixelsPerLength = (4345.52246 - 523.522461) / 192 * 2.26;
	const maskCanvas = document.createElement("canvas");
	const maskContext = maskCanvas.getContext("2d");
	let animationFrame = 0;
	let isReady = false;

	const render = () => {
		animationFrame = 0;
		azimuthOutput.value = `${azimuthInput.value}\u00b0`;
		lengthOutput.value = Number(lengthInput.value).toFixed(2);
		azimuthInput.setAttribute("aria-valuetext", `${azimuthInput.value} degrees`);
		lengthInput.setAttribute("aria-valuetext", `${lengthOutput.value} out of 3`);
		if (!isReady || !image.naturalWidth) return;

		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);

		const length = Number(lengthInput.value);
		if (length <= 0) return;

		const azimuth = Number(azimuthInput.value) * Math.PI / 180;
		const offsetX = -Math.cos(azimuth) * length * shadowPixelsPerLength;
		const offsetY = Math.sin(azimuth) * length * shadowPixelsPerLength;
		const steps = Math.max(1, Math.ceil(Math.hypot(offsetX, offsetY)));
		maskCanvas.width = canvas.width;
		maskCanvas.height = canvas.height;

		for (let step = 0; step <= steps; step += 1) {
			const progress = step / steps;
			maskContext.drawImage(foregroundImage, offsetX * progress, offsetY * progress, canvas.width, canvas.height);
		}
		maskContext.globalCompositeOperation = "source-in";
		maskContext.fillStyle = "#000";
		maskContext.fillRect(0, 0, canvas.width, canvas.height);

		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = "high";
		context.globalAlpha = 0.35;
		context.filter = "blur(1.5px)";
		context.drawImage(maskCanvas, 0, 0);
		context.filter = "none";
		context.globalCompositeOperation = "destination-out";
		context.globalAlpha = 1;
		context.drawImage(foregroundImage, 0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = "source-over";
	};

	const scheduleRender = () => {
		if (!animationFrame) animationFrame = requestAnimationFrame(render);
	};

	azimuthInput.addEventListener("input", scheduleRender);
	lengthInput.addEventListener("input", scheduleRender);
	image.addEventListener("load", scheduleRender);
	window.addEventListener("resize", scheduleRender);

	Promise.all([
		new Promise((resolve, reject) => {
			foregroundImage.onload = resolve;
			foregroundImage.onerror = reject;
			foregroundImage.src = "assets/worldgeneratorpro-lighting-foreground-mask.png?v=63188e4b22";
		}),
		image.decode()
	]).then(() => {
		isReady = true;
		scheduleRender();
	}).catch(error => {
		status.textContent = "Preview unavailable";
		azimuthInput.disabled = true;
		lengthInput.disabled = true;
		console.error("Lighting preview assets failed to load.", error);
	});

	scheduleRender();
});
