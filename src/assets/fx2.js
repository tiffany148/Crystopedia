// Redesign FX: dense multi-size sparkles + bokeh, hero drift, cursor/touch sparkle trail, burst on press.
// One capped canvas; paused on hidden tab; disabled entirely under prefers-reduced-motion.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement, cs = getComputedStyle(document.body);
  const tints = ["--c1", "--c2", "--c3", "--stone"].map((v) => cs.getPropertyValue(v).trim()).filter(Boolean);
  if (!tints.length) tints.push("#c4b5fd", "#67e8f9", "#fde68a", "#f9a8d4");
  const cv = document.createElement("canvas"); cv.id = "fx2"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:45";
  document.body.appendChild(cv);
  const g = cv.getContext("2d"); let W, H, D, amb = [], bok = [], fly = [];
  const mobile = matchMedia("(max-width:700px)").matches;
  const MAXFLY = mobile ? 48 : 140, pick = () => tints[(Math.random() * tints.length) | 0];
  const size = () => { D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; g.setTransform(D, 0, 0, D, 0, 0);
    const dens = mobile ? 18000 : 9000;
    const n = Math.round(Math.min(mobile ? 55 : 140, Math.max(mobile ? 22 : 50, W * H / dens)));
    amb = Array.from({ length: n }, () => { const edge = Math.random() < .6; let x = Math.random() * W, y = Math.random() * H;
      if (edge) { const b = Math.min(120, W * .1); if (Math.random() < .5) x = Math.random() < .5 ? Math.random() * b : W - Math.random() * b; else y = Math.random() < .5 ? Math.random() * b : H - Math.random() * b; }
      return { x, y, r: .6 + Math.random() ** 2 * 3.4, ph: Math.random() * 6.3, sp: .6 + Math.random() * 1.8, c: Math.random() < .5 ? "#fff" : pick(), vx: (Math.random() - .5) * .12, vy: -.03 - Math.random() * .1 }; });
    bok = Array.from({ length: Math.round(n / (mobile ? 10 : 7)) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 14 + Math.random() * 40, c: pick(), ph: Math.random() * 6.3, vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .1 })); };
  size(); addEventListener("resize", size);
  const star = (x, y, r, a, c) => { g.globalAlpha = a; g.fillStyle = c; g.beginPath(); const k = r * 2.8;
    g.moveTo(x, y - k); g.quadraticCurveTo(x, y, x + k, y); g.quadraticCurveTo(x, y, x, y + k); g.quadraticCurveTo(x, y, x - k, y); g.quadraticCurveTo(x, y, x, y - k); g.fill();
    g.globalAlpha = a * .9; g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, r * .55, 0, 6.283); g.fill(); };
  const emit = (x, y, n, spd) => { for (let i = 0; i < n && fly.length < MAXFLY; i++) { const a = Math.random() * 6.283, s = spd * (.3 + Math.random());
    fly.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - spd * .3, r: .8 + Math.random() * 2.4, life: 1, c: Math.random() < .4 ? "#fff" : pick() }); } };
  let lx = -1, ly = -1;
  if (!mobile) addEventListener("pointermove", (e) => { if (lx >= 0 && Math.hypot(e.clientX - lx, e.clientY - ly) > 14) emit(e.clientX, e.clientY, e.pointerType === "touch" ? 2 : 1, .8); lx = e.clientX; ly = e.clientY; }, { passive: true });
  addEventListener("pointerdown", (e) => { const t = e.target.closest("a,button,.chip,label,input[type=submit]"); emit(e.clientX, e.clientY, t ? (mobile ? 10 : 26) : (mobile ? 3 : 8), t ? 3.2 : 1.6); }, { passive: true });
  // hero drift: extra sparkles streaming across the stone hero
  const hero = document.querySelector(".stone-hero, .hub .hero");
  let run = !document.hidden, last = 0;
  const frame = (t) => { if (!run) return; requestAnimationFrame(frame); if (t - last < 33) return; last = t;
    g.clearRect(0, 0, W, H); const dark = root.dataset.theme === "dark";
    g.globalCompositeOperation = dark ? "lighter" : "source-over";
    for (const b of bok) { b.x += b.vx; b.y += b.vy; if (b.x < -60) b.x = W + 60; if (b.x > W + 60) b.x = -60; if (b.y < -60) b.y = H + 60; if (b.y > H + 60) b.y = -60;
      const a = (.5 + .5 * Math.sin(t / 2600 + b.ph)) * (dark ? .16 : .12); const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      gr.addColorStop(0, b.c); gr.addColorStop(.7, b.c); gr.addColorStop(1, "transparent"); g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); }
    for (const p of amb) { p.x += p.vx; p.y += p.vy; if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
      const a = Math.max(0, Math.sin(t / 1000 * p.sp + p.ph)) ** 3; if (a > .03) star(p.x, p.y, p.r * (.6 + .6 * a), a * (dark ? 1 : .85), p.c); }
    if (hero && Math.random() < .35 && fly.length < MAXFLY) { const r = hero.getBoundingClientRect(); if (r.bottom > 0 && r.top < H) fly.push({ x: r.left + Math.random() * r.width, y: r.bottom - Math.random() * 40, vx: (Math.random() - .3) * .6, vy: -.4 - Math.random() * .8, r: .7 + Math.random() * 2, life: 1, c: Math.random() < .5 ? "#fff" : pick(), slow: 1 }); }
    for (let i = fly.length - 1; i >= 0; i--) { const p = fly[i]; p.x += p.vx; p.y += p.vy; if (!p.slow) { p.vy += .05; p.vx *= .97; } p.life -= p.slow ? .008 : .03;
      if (p.life <= 0) { fly.splice(i, 1); continue; } star(p.x, p.y, p.r, Math.min(1, p.life * 1.4), p.c); }
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; };
  requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => { run = !document.hidden; if (run) requestAnimationFrame(frame); });
  // second pattern layer parallax (deeper = slower, opposite drift)
  const p2 = document.getElementById("stone-pattern2"); let q = 0;
  if (p2) addEventListener("scroll", () => { if (q) return; q = requestAnimationFrame(() => { q = 0; p2.style.setProperty("--pat2-y", (scrollY * .03).toFixed(1) + "px"); }); }, { passive: true });
})();
