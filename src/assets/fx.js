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

  // --- holo: sheen follows pointer / scroll / device tilt (CSS reads --hx/--hy) ---
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.body.classList.contains("holo") && !reduce) {
    const set = (x, y) => { document.body.style.setProperty("--hx", (x * 100).toFixed(1) + "%"); document.body.style.setProperty("--hy", (y * 100).toFixed(1) + "%"); };
    addEventListener("pointermove", (e) => set(e.clientX / innerWidth, e.clientY / innerHeight), { passive: true });
    addEventListener("scroll", () => set(0.5, 0.2 + 0.6 * (scrollY / Math.max(1, document.body.scrollHeight - innerHeight))), { passive: true });
    addEventListener("deviceorientation", (e) => { if (e.gamma != null) set(0.5 + e.gamma / 90, 0.5 + (e.beta - 45) / 90); }, { passive: true });
  }
  // --- sparkle frame: twinkles concentrated along the viewport edges, tinted with the stone's colours ---
  if (!reduce) {
    const fc = document.createElement("canvas"); fc.id = "sparkle-frame"; fc.setAttribute("aria-hidden", "true"); document.body.appendChild(fc);
    const fx = fc.getContext("2d"); let FW, FH, fd, fp = [];
    const cs = getComputedStyle(document.body);
    const tints = ["--c1", "--c2", "--c3", "--stone"].map((v) => cs.getPropertyValue(v).trim()).filter(Boolean);
    if (!tints.length) tints.push("#c9a7ff", "#7fd8ff", "#ffd36a");
    const band = () => Math.min(56, Math.max(26, innerWidth * 0.035));
    const place = (p) => { const b = band(), e = Math.floor(Math.random() * 4), d = Math.random() ** 1.8 * b;
      if (e === 0) { p.x = Math.random() * FW; p.y = d; } else if (e === 1) { p.x = Math.random() * FW; p.y = FH - d; }
      else if (e === 2) { p.x = d; p.y = Math.random() * FH; } else { p.x = FW - d; p.y = Math.random() * FH; } };
    const fsize = () => { fd = Math.min(devicePixelRatio || 1, 2); FW = innerWidth; FH = innerHeight; fc.width = FW * fd; fc.height = FH * fd; fx.setTransform(fd, 0, 0, fd, 0, 0);
      const n = Math.round(Math.min(90, Math.max(36, (FW + FH) / 28)));
      fp = Array.from({ length: n }, () => { const p = { r: 0.8 + Math.random() * 2.2, ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 1.6, c: tints[Math.floor(Math.random() * tints.length)], life: 0 }; place(p); return p; }); };
    fsize(); addEventListener("resize", fsize);
    let fl = 0, frun = !document.hidden;
    const draw = (t) => { if (!frun) return; requestAnimationFrame(draw); if (t - fl < 45) return; fl = t; fx.clearRect(0, 0, FW, FH);
      const dark = root.dataset.theme === "dark", b = band();
      // faint shimmering frame line
      const g = fx.createLinearGradient(0, 0, FW, FH); tints.forEach((c, i) => g.addColorStop(i / Math.max(1, tints.length - 1), c));
      fx.globalAlpha = (dark ? 0.22 : 0.16) + 0.06 * Math.sin(t / 1400); fx.strokeStyle = g; fx.lineWidth = 2; fx.strokeRect(3, 3, FW - 6, FH - 6);
      for (const p of fp) { const a = Math.max(0, Math.sin(t / 1000 * p.sp + p.ph)) ** 4;
        if (a < 0.02) { if (Math.random() < 0.01) place(p); continue; }
        fx.globalAlpha = a * (dark ? 0.95 : 0.8); fx.fillStyle = p.c; const r = p.r * (0.7 + a);
        fx.beginPath(); fx.moveTo(p.x, p.y - r * 2.6); fx.quadraticCurveTo(p.x, p.y, p.x + r * 2.6, p.y); fx.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 2.6);
        fx.quadraticCurveTo(p.x, p.y, p.x - r * 2.6, p.y); fx.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 2.6); fx.fill();
        fx.globalAlpha = a * 0.7; fx.fillStyle = "#fff"; fx.beginPath(); fx.arc(p.x, p.y, r * 0.6, 0, 6.283); fx.fill(); }
      fx.globalAlpha = 1; };
    requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", () => { frun = !document.hidden; if (frun) requestAnimationFrame(draw); });
  }
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
