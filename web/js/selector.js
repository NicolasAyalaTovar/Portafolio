/* Carrusel selector: una fila desplazable de tarjetas; al elegir una, se despliega
   solo su contenido y los demás se ocultan. Se usa en juegos.html y proyectos.html.

   Marcado:
     <div class="selector" aria-label="...">
       <div class="selector-barra"></div>            (opcional: si falta, se crea al inicio)
       <div class="selector-panel" id="..." data-sel-titulo="..." data-sel-etiqueta="..."
            data-sel-resumen="..." data-sel-foto="img/...">…</div>
       …
     </div>
   Si la dirección termina en #id-de-un-panel, se abre ese panel. */
(function () {
  function crear(raiz) {
    const paneles = [...raiz.querySelectorAll(".selector-panel")];
    if (!paneles.length) return;
    let barra = raiz.querySelector(".selector-barra");
    if (!barra) { barra = document.createElement("div"); barra.className = "selector-barra"; raiz.prepend(barra); }

    const nombre = raiz.getAttribute("aria-label") || "Opciones";
    barra.innerHTML = `
      <button type="button" class="btn chico oscuro selector-flecha" data-dir="-1" aria-label="Anterior">←</button>
      <div class="selector-pista" role="tablist" aria-label="${nombre}">
        ${paneles.map((p, i) => {
          const d = p.dataset, foto = d.selFoto;
          return `<button type="button" role="tab" class="selector-item${foto ? " con-foto" : ""}" id="sel-${p.id}" aria-controls="${p.id}" data-i="${i}">
            ${foto ? `<img src="${encodeURI(foto)}" alt="" loading="lazy" decoding="async">` : `<span class="selector-hex" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>`}
            <span class="selector-texto">
              ${d.selEtiqueta ? `<span class="selector-etiqueta">${d.selEtiqueta}</span>` : ""}
              <strong>${d.selTitulo}</strong>
              ${d.selResumen ? `<span class="small">${d.selResumen}</span>` : ""}
            </span>
          </button>`;
        }).join("")}
      </div>
      <button type="button" class="btn chico oscuro selector-flecha" data-dir="1" aria-label="Siguiente">→</button>`;
    if (paneles.length < 2) barra.querySelectorAll(".selector-flecha").forEach(b => b.hidden = true);

    const pista = barra.querySelector(".selector-pista");
    const items = [...pista.children];
    paneles.forEach(p => { p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", "sel-" + p.id); });
    let actual = -1;

    function elegir(i, { enfocar = false, recordar = false } = {}) {
      actual = (i + paneles.length) % paneles.length;
      items.forEach((b, j) => { b.setAttribute("aria-selected", j === actual); b.tabIndex = j === actual ? 0 : -1; });
      paneles.forEach((p, j) => p.hidden = j !== actual);
      const b = items[actual];
      pista.scrollTo({ left: b.offsetLeft - (pista.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
      if (enfocar) b.focus({ preventScroll: true });
      if (recordar) history.replaceState(null, "", "#" + paneles[actual].id);
    }

    pista.addEventListener("click", ev => { const b = ev.target.closest(".selector-item"); if (b) elegir(+b.dataset.i, { recordar: true }); });
    barra.querySelectorAll(".selector-flecha").forEach(b =>
      b.addEventListener("click", () => elegir(actual + +b.dataset.dir, { recordar: true })));
    pista.addEventListener("keydown", ev => {
      const d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
      if (d) { ev.preventDefault(); elegir(actual + d, { enfocar: true, recordar: true }); }
    });

    const desdeHash = () => paneles.findIndex(p => "#" + p.id === location.hash);
    elegir(Math.max(0, desdeHash()));
    addEventListener("hashchange", () => { const i = desdeHash(); if (i >= 0) elegir(i); });
  }

  document.querySelectorAll(".selector").forEach(crear);
})();
