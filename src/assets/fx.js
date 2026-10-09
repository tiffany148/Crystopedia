// Theme toggle (remembers choice; otherwise follows the system) + lightweight glitter particles.
(() => {
  const root = document.documentElement;
  const btn = document.querySelector(".theme-toggle");
  const icon = () => { if (btn) { btn.querySelector(".tt-icon").textContent = root.dataset.theme === "dark" ? "☀️" : "🌙"; btn.setAttribute("aria-pressed", root.dataset.theme === "dark"); } };
  icon();
  btn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    icon();
  });
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", (e) => {
    let saved = null; try { saved = localStorage.getItem("theme"); } catch (_) {}
    if (!saved) { root.dataset.theme = e.matches ? "dark" : "light"; icon(); }
  });

  // --- glitter: a few twinkling 4-point sparkles on a fixed canvas behind content ---
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.id = "glitter"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W, H, dpr, parts = [];
  const stone = getComputedStyle(document.body).getPropertyValue("--stone").trim();
  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(42, Math.max(16, (W * H) / 38000)));
    parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1.2 + Math.random() * 2.6,
      ph: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.4, dy: 0.04 + Math.random() * 0.12, tint: Math.random() < 0.35 }));
  };
  size(); addEventListener("resize", size);
  const star = (x, y, r, a, tint) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = tint && stone ? stone : "#ffffff";
    ctx.beginPath();
    ctx.moveTo(x, y - r * 2.4); ctx.quadraticCurveTo(x, y, x + r * 2.4, y); ctx.quadraticCurveTo(x, y, x, y + r * 2.4);
    ctx.quadraticCurveTo(x, y, x - r * 2.4, y); ctx.quadraticCurveTo(x, y, x, y - r * 2.4); ctx.fill();
    ctx.globalAlpha = a * 0.5; ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, 6.283); ctx.fillStyle = "#fff"; ctx.fill();
  };
  let last = 0, running = true;
  const frame = (t) => {
    if (!running) return;
    requestAnimationFrame(frame);
    if (t - last < 40) return; // ~25 fps is plenty for a twinkle
    last = t;
    ctx.clearRect(0, 0, W, H);
    const dark = root.dataset.theme === "dark";
    for (const p of parts) {
      p.y -= p.dy; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      const a = Math.max(0, Math.sin(t / 1000 * p.sp + p.ph)) ** 3 * (dark ? 0.9 : 0.75);
      if (a > 0.02) star(p.x, p.y, p.r, a, p.tint);
    }
    ctx.globalAlpha = 1;
  };
  requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
})();
