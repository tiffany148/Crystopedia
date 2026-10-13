// Daylight ↔ UV crossfade toggle on stone pages (when both photos exist)
(() => {
  document.querySelectorAll(".uv-toggle").forEach((root) => {
    const btn = root.querySelector("[data-uv-btn]");
    const stage = root.querySelector(".uv-stage");
    if (!btn || !stage) return;
    btn.addEventListener("click", () => {
      const on = stage.classList.toggle("show-uv");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "✺ Showing UV — tap for daylight" : "☀ Showing daylight — tap for UV";
    });
  });
})();
