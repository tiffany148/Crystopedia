// Crystopedia identifier: client-side property matching
(async function () {
  const data = await fetch("/assets/identify-data.json").then((r) => r.json());
  const form = document.getElementById("idform");
  const sel = { color: new Set(), hardness: null, luster: null, streak: null, trans: null, system: null, extra: new Set() };
  const W = { color: 2, hardness: 3, luster: 2.5, streak: 2.5, trans: 1, system: 1.5, mag: 3, fizz: 3 };

  form.querySelectorAll(".chips").forEach((group) => {
    const name = group.dataset.name, multi = !!group.dataset.multi;
    group.addEventListener("click", (ev) => {
      const b = ev.target.closest(".chip"); if (!b) return;
      const v = b.dataset.v;
      if (multi) { sel[name].has(v) ? sel[name].delete(v) : sel[name].add(v); b.classList.toggle("on"); }
      else {
        const was = sel[name] === v;
        group.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
        sel[name] = was ? null : v; if (!was) b.classList.add("on");
      }
      run();
    });
  });
  document.getElementById("reset").onclick = () => {
    form.querySelectorAll(".chip.on").forEach((x) => x.classList.remove("on"));
    sel.color.clear(); sel.extra.clear(); ["hardness", "luster", "streak", "trans", "system"].forEach((k) => (sel[k] = null)); run();
  };

  function score(r) {
    let s = 0, max = 0, known = 0, asked = 0;
    const crit = (w, has, ok, partial = false) => { max += w; asked++; if (!has) { s -= w * 0.15; return; } known++; s += ok ? w : partial ? w * 0.4 : -w * 0.6; };
    if (sel.color.size) {
      const hit = [...sel.color].some((c) => r.c.includes(c)); crit(W.color, r.c.length > 0, hit);
      if (hit && sel.color.has(r.c[0])) s += 0.6; // primary colour bonus (tie-breaker)
    }
    if (sel.hardness) {
      const [lo, hi] = sel.hardness.split("-").map(Number);
      const has = !!r.h; const ok = has && r.h[0] <= hi && r.h[1] >= lo;
      const near = has && r.h[0] <= hi + 0.5 && r.h[1] >= lo - 0.5;
      crit(W.hardness, has, ok, near);
    }
    if (sel.luster) crit(W.luster, r.l.length > 0, r.l.includes(sel.luster), sel.luster === "sm" && r.l.includes("m") || sel.luster === "m" && r.l.includes("sm"));
    if (sel.streak) crit(W.streak, r.s.length > 0, r.s.includes(sel.streak), sel.streak === "white" && r.s.includes("colorless"));
    if (sel.trans) crit(W.trans, r.t.length > 0, r.t.includes(sel.trans));
    if (sel.system) { const want = sel.system === "hextri" ? ["hexagonal", "trigonal"] : [sel.system]; crit(W.system, r.y.length > 0, r.y.some((y) => want.includes(y))); }
    for (const x of sel.extra) {
      // magnetism / acid reaction are only recorded for curated stones; absence there means "no"
      const has = r.p === 1 || r.f.length > 0;
      crit(W[x], has, r.f.includes(x), x === "fizz" && r.f.includes("fizzw"));
      if (!has) s -= W[x] * 0.35;
    }
    if (!asked) return null;
    if (r.p) s += 0.08 * max; // gentle boost for popular, well-documented stones
    return { pct: Math.max(0, Math.min(100, Math.round((s / max) * 100))), raw: s / max, known, asked };
  }

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function run() {
    const out = document.getElementById("matches"), sum = document.getElementById("summary");
    const ranked = data.map((r) => ({ r, sc: score(r) })).filter((x) => x.sc && x.sc.raw > 0)
      .sort((a, b) => b.sc.raw - a.sc.raw || b.sc.known - a.sc.known || b.r.p - a.r.p).slice(0, 24);
    if (!ranked.length) { out.innerHTML = ""; sum.textContent = (sel.color.size || sel.hardness || sel.luster || sel.streak || sel.trans || sel.system || sel.extra.size) ? "No good matches. Try removing a property." : "Pick at least one property above to see matches."; return; }
    sum.textContent = `Top ${ranked.length} of ${data.length.toLocaleString()} stones, ranked by how many of your observations they fit.`;
    out.innerHTML = ranked.map(({ r, sc }) => `
      <a class="card id-card" href="${r.u}" style="${esc(r.st)}">
        <div class="card-img">${r.th ? `<img loading="lazy" src="${esc(r.th)}" alt="${esc(r.n)}">` : '<span class="gem-ph">◆</span>'}<span class="match">${sc.pct}%</span></div>
        <div class="card-body"><strong>${esc(r.n)}</strong><span class="muted small">${esc(r.k)}${r.h ? ` · H ${r.h[0] === r.h[1] ? r.h[0] : r.h[0] + "–" + r.h[1]}` : ""}</span>
        <span class="small">${sc.known}/${sc.asked} properties on record</span></div>
      </a>`).join("");
  }
  const params = new URLSearchParams(location.search);
  if (params.get("color")) params.get("color").split(",").forEach((c) => form.querySelector(`[data-name=color] [data-v="${c}"]`)?.click());
})();
