(async function () {
  const data = await fetch("/assets/pairings-data.json").then((r) => r.json());
  const by = new Map(data.map((d) => [d.n.toLowerCase(), d]));
  const sel = [];
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  $("combo-names").innerHTML = data.map((d) => `<option value="${esc(d.n)}">`).join("");
  const quick = ["Amethyst", "Rose Quartz", "Clear Quartz", "Citrine", "Black Tourmaline", "Labradorite", "Selenite", "Tiger's Eye", "Moonstone", "Carnelian"];
  $("combo-quick").innerHTML = quick.map((n) => `<button type="button" class="chip" data-n="${esc(n)}">${esc(n)}</button>`).join("");
  $("combo-quick").onclick = (e) => { const b = e.target.closest(".chip"); if (b) toggle(b.dataset.n); };
  $("combo-q").addEventListener("change", (e) => { const d = by.get(e.target.value.trim().toLowerCase()); if (d) { toggle(d.n); e.target.value = ""; } });
  function toggle(n) { const i = sel.indexOf(n); i >= 0 ? sel.splice(i, 1) : sel.push(n); render(); }
  const card = (d, reason, extra = "") => `<a class="pair-card" href="${d.u}" style="${esc(d.st)}"><span class="pair-img">${d.th ? `<img loading="lazy" src="${esc(d.th)}" alt="">` : "◆"}</span><span><strong>${esc(d.n)}</strong>${extra}<small>${esc(reason)}</small></span></a>`;
  function render() {
    document.querySelectorAll("#combo-quick .chip").forEach((b) => b.classList.toggle("on", sel.includes(b.dataset.n)));
    $("combo-selected").innerHTML = sel.map((n) => `<button type="button" class="chip on" data-n="${esc(n)}">${esc(n)} ✕</button>`).join("");
    $("combo-selected").onclick = (e) => { const b = e.target.closest(".chip"); if (b) toggle(b.dataset.n); };
    if (!sel.length) { $("combo-out").innerHTML = ""; return; }
    // tally partners across selected stones
    const tally = new Map();
    for (const n of sel) for (const [pn, reason] of by.get(n.toLowerCase()).p) {
      if (sel.includes(pn)) continue;
      const t = tally.get(pn) || { count: 0, with: [], reason };
      t.count++; t.with.push(n); tally.set(pn, t);
    }
    const shared = [...tally.entries()].filter(([, t]) => t.count > 1).sort((a, b) => b[1].count - a[1].count);
    const chakras = new Set(sel.flatMap((n) => by.get(n.toLowerCase()).ch));
    const all = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
    let html = `<p class="small"><strong>Chakras covered:</strong> ${all.map((c) => `<span class="chakra chakra-${c.toLowerCase().replace(/ /g, "-")}" style="opacity:${chakras.has(c) ? 1 : 0.25}">${c}</span>`).join(" ")}</p>`;
    // pairs inside the selection
    const inside = [];
    for (const n of sel) for (const [pn, r] of by.get(n.toLowerCase()).p) if (sel.includes(pn)) inside.push(`<li><strong>${esc(n)} + ${esc(pn)}</strong>: ${esc(r)}</li>`);
    if (inside.length) html += `<h3>✅ Already a traditional pair</h3><ul>${inside.join("")}</ul>`;
    if (shared.length) html += `<h3>⭐ Pairs with several of your stones</h3><div class="pair-grid">${shared.map(([pn, t]) => card(by.get(pn.toLowerCase()), t.reason, `<em class="small">pairs with ${t.with.map(esc).join(" & ")}</em>`)).join("")}</div>`;
    for (const n of sel) {
      const d = by.get(n.toLowerCase());
      html += `<h3>Partners for ${esc(d.n)}</h3><div class="pair-grid">${d.p.map(([pn, r]) => by.get(pn.toLowerCase()) ? card(by.get(pn.toLowerCase()), r) : "").join("")}</div>`;
    }
    $("combo-out").innerHTML = html;
  }
  const pre = new URLSearchParams(location.search).get("stones");
  if (pre) pre.split(",").forEach((n) => by.get(n.toLowerCase()) && toggle(by.get(n.toLowerCase()).n));
})();
