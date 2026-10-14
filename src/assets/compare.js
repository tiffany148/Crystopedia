// Side-by-side crystal compare tool (/compare/)
(() => {
  const out = document.getElementById("cmp-out");
  const aIn = document.getElementById("cmp-a");
  const bIn = document.getElementById("cmp-b");
  const list = document.getElementById("cmp-names");
  const quick = document.getElementById("cmp-quick");
  if (!out || !aIn || !bIn) return;

  let data = [];
  const byTitle = () => {
    const m = new Map();
    for (const s of data) m.set(s.title.toLowerCase(), s);
    return m;
  };

  const row = (label, va, vb, same) =>
    `<tr class="${same ? "same" : "diff"}"><th>${label}</th><td>${va || "—"}</td><td>${vb || "—"}</td></tr>`;

  const render = () => {
    const map = byTitle();
    const A = map.get(aIn.value.trim().toLowerCase());
    const B = map.get(bIn.value.trim().toLowerCase());
    if (!A || !B) {
      out.innerHTML = `<p class="muted">${!A && aIn.value ? "Stone A not found in the compare list. " : ""}${!B && bIn.value ? "Stone B not found in the compare list." : ""}${!aIn.value || !bIn.value ? "Choose two stones to compare." : ""}</p>`;
      return;
    }
    if (A.title === B.title) {
      out.innerHTML = `<p class="muted">Pick two different stones.</p>`;
      return;
    }
    const join = (a) => (a && a.length ? a.join(", ") : "—");
    const tip = (s) => (s.tip ? `<p class="cmp-tip"><strong>Collector note:</strong> ${s.tip}</p>` : "");
    out.innerHTML = `
      <div class="cmp-heads">
        <a class="cmp-head" href="${A.url}" style="${A.style}"><span class="cmp-img">${A.thumb ? `<img src="${A.thumb}" alt="">` : "◆"}</span><strong>${A.title}</strong></a>
        <span class="cmp-vs">vs</span>
        <a class="cmp-head" href="${B.url}" style="${B.style}"><span class="cmp-img">${B.thumb ? `<img src="${B.thumb}" alt="">` : "◆"}</span><strong>${B.title}</strong></a>
      </div>
      <table class="props cmp-table">
        ${row("Type", A.typeLabel, B.typeLabel, A.typeLabel === B.typeLabel)}
        ${row("Formula", A.formula, B.formula, A.formula === B.formula)}
        ${row("Mohs hardness", A.mohs, B.mohs, A.mohs === B.mohs)}
        ${row("Density", A.density ? A.density + " g/cm³" : null, B.density ? B.density + " g/cm³" : null, A.density === B.density)}
        ${row("Crystal system", join(A.systems), join(B.systems), join(A.systems) === join(B.systems))}
        ${row("Colour", join(A.colors), join(B.colors), false)}
        ${row("Parent / variety of", join(A.parents), join(B.parents), join(A.parents) === join(B.parents))}
        ${row("UV reactive", A.uv ? "Yes" : "No", B.uv ? "Yes" : "No", A.uv === B.uv)}
        ${row("Handle with care", A.hazard || "—", B.hazard || "—", A.hazard === B.hazard)}
      </table>
      <div class="cmp-notes">${tip(A)}${tip(B)}</div>
      <p class="muted small"><a href="/lookalikes/">Browse look-alike guides</a> if these stones are often confused.</p>`;
  };

  const presets = [
    ["Amethyst", "Citrine"],
    ["Turquoise", "Howlite"],
    ["Moonstone", "Labradorite"],
    ["Lapis lazuli", "Sodalite"],
    ["Hemimorphite", "Smithsonite"],
    ["Opal", "Opalite"],
  ];

  fetch("/assets/compare-data.json")
    .then((r) => r.json())
    .then((j) => {
      data = j;
      list.innerHTML = data.map((s) => `<option value="${s.title}">`).join("");
      quick.innerHTML = presets
        .map(([a, b]) => `<button type="button" class="chip" data-a="${a}" data-b="${b}">${a} vs ${b}</button>`)
        .join("");
      quick.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-a]");
        if (!btn) return;
        aIn.value = btn.dataset.a;
        bIn.value = btn.dataset.b;
        render();
      });
      aIn.addEventListener("change", render);
      bIn.addEventListener("change", render);
      aIn.addEventListener("input", () => { if (byTitle().has(aIn.value.trim().toLowerCase()) && byTitle().has(bIn.value.trim().toLowerCase())) render(); });
      bIn.addEventListener("input", () => { if (byTitle().has(aIn.value.trim().toLowerCase()) && byTitle().has(bIn.value.trim().toLowerCase())) render(); });
      const params = new URLSearchParams(location.search);
      if (params.get("a")) aIn.value = params.get("a");
      if (params.get("b")) bIn.value = params.get("b");
      if (aIn.value && bIn.value) render();
    })
    .catch(() => { out.innerHTML = `<p class="muted">Could not load compare data.</p>`; });
})();
