"use strict";

document.querySelectorAll(".lighting-demo").forEach(demo => {
	const frame = demo.querySelector(".lighting-demo-frame");
	const image = frame.querySelector("img");
	const canvas = frame.querySelector("canvas");
	const status = frame.querySelector(".lighting-demo-status");
	const azimuthInput = demo.querySelector("[data-lighting-azimuth]");
	const lengthInput = demo.querySelector("[data-lighting-length]");
	const azimuthOutput = demo.querySelector("[data-lighting-azimuth-output]");
	const lengthOutput = demo.querySelector("[data-lighting-length-output]");
	const casterImage = new Image();
	const interiorImage = new Image();
	const maskScale = 4;
	const maskSize = 192;
	const shadowLengthMultiplier = 2.26;
	const cropLeft = 650;
	const cropTop = 80;
	const worldLeft = 523.522461 - cropLeft;
	const worldTop = 1274 - 3786.57666 - cropTop;
	const worldSize = 4345.52246 - 523.522461;
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = maskSize * maskScale;
	maskCanvas.height = maskSize * maskScale;
	const maskContext = maskCanvas.getContext("2d");
	maskContext.imageSmoothingEnabled = false;
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
		const offsetX = -Math.cos(azimuth) * length * shadowLengthMultiplier * maskScale;
		const offsetY = Math.sin(azimuth) * length * shadowLengthMultiplier * maskScale;
		const steps = Math.max(1, Math.min(64, Math.ceil(Math.hypot(offsetX, offsetY))));
		const scaledMaskSize = maskSize * maskScale;
		maskContext.globalCompositeOperation = "source-over";
		maskContext.clearRect(0, 0, scaledMaskSize, scaledMaskSize);

		for (let step = 0; step <= steps; step += 1) {
			const progress = step / steps;
			maskContext.drawImage(casterImage, offsetX * progress, offsetY * progress, scaledMaskSize, scaledMaskSize);
		}

		maskContext.globalCompositeOperation = "destination-out";
		maskContext.drawImage(casterImage, 0, 0, scaledMaskSize, scaledMaskSize);
		maskContext.drawImage(interiorImage, 0, 0, scaledMaskSize, scaledMaskSize);
		context.imageSmoothingEnabled = false;
		context.globalAlpha = 0.35;
		context.drawImage(maskCanvas, worldLeft, worldTop, worldSize, worldSize);
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
			casterImage.onload = resolve;
			casterImage.onerror = reject;
			casterImage.src = "assets/worldgeneratorpro-lighting-caster-mask.png";
		}),
		new Promise((resolve, reject) => {
			interiorImage.onload = resolve;
			interiorImage.onerror = reject;
			interiorImage.src = "assets/worldgeneratorpro-lighting-interior-mask.png";
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
