// "Where it's found" map: loads Leaflet + OpenStreetMap tiles only when the map scrolls into view.
(() => {
  const el = document.querySelector(".stone-map");
  if (!el) return;
  const pts = JSON.parse(el.dataset.points || "[]");
  if (!pts.length) { el.closest(".where-found")?.querySelector(".stone-map")?.remove(); return; }
  const kinds = new Set(pts.map((p) => p.k));
  document.querySelectorAll(".map-legend li").forEach((li) => { if (!kinds.has(li.dataset.k)) li.remove(); });
  const LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist/";
  const load = () => new Promise((res, rej) => {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = LEAFLET + "leaflet.css";
    css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="; css.crossOrigin = "";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = LEAFLET + "leaflet.js"; js.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="; js.crossOrigin = "";
    js.onload = res; js.onerror = rej; document.head.appendChild(js);
  });
  const stone = getComputedStyle(document.body).getPropertyValue("--stone").trim() || "#8e44ad";
  const draw = () => {
    const L = window.L;
    const map = L.map(el, { scrollWheelZoom: false, worldCopyJump: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 12,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const label = { t: "Type locality", n: "Notable source", o: "Country of origin" };
    const markers = pts.map((p) => {
      const icon = L.divIcon({ className: "", html: `<span class="mk mk-${p.k}" style="--mk:${stone}"></span>`, iconSize: [18, 18], iconAnchor: [9, 9] });
      return L.marker([p.la, p.lo], { icon, title: p.n, zIndexOffset: p.k === "t" ? 1000 : 0 })
        .bindPopup(`<strong>${esc(p.n)}</strong><br><small>${label[p.k]}</small>`);
    });
    const group = L.featureGroup(markers).addTo(map);
    if (pts.length === 1) map.setView([pts[0].la, pts[0].lo], 4);
    else map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 5 });
  };
  const start = () => load().then(draw).catch(() => { el.textContent = "Map could not be loaded."; });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: "200px" });
    io.observe(el);
  } else start();
})();
