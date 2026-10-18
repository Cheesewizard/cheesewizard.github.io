"use strict";
document.querySelectorAll(".ao-comparison").forEach(comparison => {
 const frame = comparison.querySelector(".ao-frame");
 const slider = comparison.querySelector("input");
 const update = () => {
  frame.style.setProperty("--split", `${slider.value}%`);
  slider.setAttribute("aria-valuetext", `${slider.value}% ambient occlusion on`);
 };
 const move = event => {
  const bounds = frame.getBoundingClientRect();
  slider.value = String(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))));
  update();
 };
 slider.addEventListener("input", update);
 frame.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  event.preventDefault();
  frame.setPointerCapture(event.pointerId);
  move(event);
 });
 frame.addEventListener("pointermove", event => {
  if (frame.hasPointerCapture(event.pointerId)) move(event);
 });
 frame.addEventListener("pointerup", event => {
  if (!frame.hasPointerCapture(event.pointerId)) return;
  move(event);
  frame.releasePointerCapture(event.pointerId);
 });
 frame.addEventListener("dragstart", event => event.preventDefault());
 update();
});
