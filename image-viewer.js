"use strict";
const viewer = document.createElement("dialog");
viewer.className = "image-viewer";
viewer.setAttribute("aria-label", "Expanded screenshot");
viewer.innerHTML = '<button type="button" class="image-viewer-close" aria-label="Close expanded screenshot">Close</button><img alt=""><p></p>';
document.body.append(viewer);
const expandedImage = viewer.querySelector("img");
const closeButton = viewer.querySelector("button");
closeButton.addEventListener("click", () => viewer.close());
viewer.addEventListener("close", () => { expandedImage.removeAttribute("src"); });
function expand(link) {
 const thumbnail = link.querySelector("img");
 expandedImage.src = link.href;
 expandedImage.alt = thumbnail.alt;
 viewer.querySelector("p").textContent = thumbnail.alt;
 viewer.showModal();
 closeButton.focus();
}
document.querySelectorAll("[data-stat-gallery], [data-commercial-gallery]").forEach(gallery => {
 const link = gallery.querySelector("[data-gallery-link]");
 link.addEventListener("click", event => { event.preventDefault(); expand(link); });
 const button = document.createElement("button");
 button.type = "button";
 button.className = "gallery-expand";
 button.textContent = "Expand image";
 button.addEventListener("click", () => expand(link));
 gallery.querySelector(".stat-gallery-controls, .commercial-gallery-status").append(button);
});
