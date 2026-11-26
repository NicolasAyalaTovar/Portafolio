/* Herramienta 05: árboles filogenéticos a partir de caracteres morfológicos.
   Método: máxima parsimonia (Fitch) con búsqueda exacta por ramificación y acotamiento
   (branch and bound). El primer taxón es el grupo externo y enraíza el árbol.
   Si hay varios árboles igual de parsimoniosos se muestra su consenso estricto.
   En cada rama se marcan las sinapomorfías: estados derivados compartidos solo por ese grupo.
   Límites: 12 taxones y 20 caracteres (la búsqueda exacta crece muy rápido). */
(function () {
  const raiz = document.getElementById("filo-app");
  if (!raiz) return;

  const MAX_T = 12, MAX_C = 20, TODOS = 0x3ff;
  const EJEMPLO = {
    titulo: "Relaciones entre algunos órdenes de insectos",
    caracteres: ["Alas en el adulto", "Alas que se pliegan sobre el abdomen", "Metamorfosis completa", "Boca en forma de pico chupador",
                 "Élitros", "Alas cubiertas de escamas", "Halterios", "Alas unidas por hamuli", "Patas traseras saltadoras", "Antenas muy cortas"],
    taxones: [["Zygentoma", "0000000000"], ["Odonata", "1000000001"], ["Orthoptera", "1100000010"], ["Hemiptera", "1101000000"],
              ["Coleoptera", "1110100000"], ["Lepidoptera", "1110010000"], ["Diptera", "1110001000"], ["Hymenoptera", "1110000100"]]
  };

  let caracteres = [], taxones = [], titulo = "";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  raiz.innerHTML = `
    <div class="tarjeta">
      <h3>1. Matriz de caracteres</h3>
      <p class="small muted">Cada fila es un taxón y cada columna un carácter. Escribe <strong>0</strong> para el estado ancestral, <strong>1</strong> (o 2, 3…) para los estados derivados y <strong>?</strong> si no lo sabes. La primera fila es el <strong>grupo externo</strong>: un pariente cercano que no pertenece al grupo estudiado y sirve para saber qué estado es el ancestral.</p>
      <div class="tabla-wrap"><table class="filo-matriz" data-matriz></table></div>
      <div class="acciones-tabla">
        <button type="button" class="btn chico" data-accion="taxon">+ Taxón</button>
        <button type="button" class="btn chico" data-accion="caracter">+ Carácter</button>
        <button type="button" class="btn chico oscuro" data-accion="ejemplo">Cargar ejemplo</button>
        <button type="button" class="btn chico oscuro" data-accion="vaciar">Empezar de cero</button>
      </div>
      <p class="estado small" data-estado role="status"></p>
    </div>
    <div class="tarjeta filo-resultado">
      <h3>2. Árbol filogenético</h3>
      <div class="campos filo-titulo"><div><label for="filo-titulo">Título del árbol</label><input id="filo-titulo" type="text" maxlength="60"></div></div>
      <button type="button" class="btn" data-accion="construir">Construir el árbol</button>
      <div data-info aria-live="polite"></div>
      <svg class="filo-lienzo" data-svg viewBox="0 0 760 200" role="img" aria-label="Árbol filogenético"></svg>
      <div class="acciones-tabla">
        <button type="button" class="btn chico" data-accion="png">Descargar PNG</button>
        <button type="button" class="btn chico" data-accion="jpg">Descargar JPG</button>
      </div>
    </div>`;
  const $ = s => raiz.querySelector(s);
  const svg = $("[data-svg]");
  const avisar = (m, ok) => { const e = $("[data-estado]"); e.textContent = m; e.className = "estado small " + (ok ? "ok" : "error"); };

  // ---------- Matriz editable ----------
  function pintarMatriz() {
    $("[data-matriz]").innerHTML = `
      <thead><tr><th>Taxón</th>${caracteres.map((c, j) => `<th class="filo-car"><span class="filo-num">${j + 1}</span>
        <input type="text" value="${esc(c)}" data-car="${j}" aria-label="Nombre del carácter ${j + 1}" maxlength="40">
        <button type="button" class="red-quitar" data-quitar-car="${j}" aria-label="Quitar carácter ${j + 1}">×</button></th>`).join("")}<th></th></tr></thead>
      <tbody>${taxones.map((t, i) => `<tr${i ? "" : ' class="filo-externo"'}>
        <td><input type="text" value="${esc(t.nombre)}" data-tax="${i}" aria-label="Nombre del taxón ${i + 1}" maxlength="24">${i ? "" : '<span class="small filo-etq">grupo externo</span>'}</td>
        ${caracteres.map((_, j) => `<td><input class="filo-celda" type="text" inputmode="numeric" maxlength="1" value="${esc(t.estados[j] ?? "0")}" data-celda="${i},${j}" aria-label="${esc(t.nombre)}, carácter ${j + 1}"></td>`).join("")}
        <td><button type="button" class="red-quitar" data-quitar-tax="${i}" aria-label="Quitar ${esc(t.nombre)}">×</button></td></tr>`).join("")}</tbody>`;
  }

  raiz.addEventListener("input", ev => {
    const t = ev.target;
    if (t.dataset.car !== undefined) caracteres[+t.dataset.car] = t.value;
    if (t.dataset.tax !== undefined) taxones[+t.dataset.tax].nombre = t.value;
    if (t.dataset.celda !== undefined) {
      const v = t.value.replace(/[^0-9?]/g, "").slice(-1); t.value = v;
      const [i, j] = t.dataset.celda.split(",").map(Number); taxones[i].estados[j] = v || "0";
      if (v) { const inputs = [...raiz.querySelectorAll(".filo-celda")], k = inputs.indexOf(t); if (inputs[k + 1]) inputs[k + 1].focus(); }
    }
    if (t.id === "filo-titulo") titulo = t.value.trim();
  });
  raiz.addEventListener("focusin", ev => { if (ev.target.classList.contains("filo-celda")) ev.target.select(); });

  raiz.addEventListener("click", ev => {
    const q = ev.target.closest("[data-quitar-car],[data-quitar-tax]");
    if (q) {
      if (q.dataset.quitarCar !== undefined) { const j = +q.dataset.quitarCar; caracteres.splice(j, 1); taxones.forEach(t => t.estados.splice(j, 1)); }
      else taxones.splice(+q.dataset.quitarTax, 1);
      pintarMatriz(); return;
    }
    const a = ev.target.closest("[data-accion]")?.dataset.accion;
    if (a === "taxon") { if (taxones.length >= MAX_T) return avisar(`Máximo ${MAX_T} taxones: la búsqueda exacta del mejor árbol crece muy rápido.`); taxones.push({ nombre: `Taxón ${taxones.length + 1}`, estados: caracteres.map(() => "0") }); pintarMatriz(); }
    if (a === "caracter") { if (caracteres.length >= MAX_C) return avisar(`Máximo ${MAX_C} caracteres.`); caracteres.push(`Carácter ${caracteres.length + 1}`); taxones.forEach(t => t.estados.push("0")); pintarMatriz(); }
    if (a === "ejemplo") cargar(EJEMPLO);
    if (a === "vaciar") { caracteres = ["Carácter 1", "Carácter 2"]; taxones = [1, 2, 3, 4].map(n => ({ nombre: n === 1 ? "Grupo externo" : `Taxón ${n}`, estados: ["0", "0"] })); titulo = ""; $("#filo-titulo").value = ""; pintarMatriz(); svg.innerHTML = ""; $("[data-info]").innerHTML = ""; avisar("", true); }
    if (a === "construir") construir();
    if (a === "png" || a === "jpg") { if (!svg.innerHTML) construir(); ExportarSVG(svg, nombreArchivo(titulo || "arbol_filogenetico"), a); }
  });

  // ---------- Parsimonia ----------
  const bits = c => c === "?" || c === "" ? TODOS : 1 << +c;

  function construir() {
    const n = taxones.length, m = caracteres.length;
    if (n < 3) return avisar("Se necesitan al menos tres taxones: el grupo externo y dos más.");
    if (!m) return avisar("Agrega al menos un carácter.");
    const nombres = taxones.map(t => t.nombre.trim() || "Sin nombre");
    if (new Set(nombres.map(x => x.toLowerCase())).size < n) return avisar("Hay taxones con el mismo nombre.");
    const D = taxones.map(t => caracteres.map((_, j) => bits(t.estados[j] ?? "0")));

    // Fitch: devuelve [conjuntos, pasos]
    function fitch(v) {
      if (!Array.isArray(v)) return [D[v], 0];
      const [a, la] = fitch(v[0]), [b, lb] = fitch(v[1]);
      const s = new Array(m); let l = la + lb;
      for (let j = 0; j < m; j++) { const x = a[j] & b[j]; if (x) s[j] = x; else { s[j] = a[j] | b[j]; l++; } }
      return [s, l];
    }
    const largo = X => fitch([0, X])[1];
    function insertar(v, k) {
      const r = [[v, k]];
      if (Array.isArray(v)) { insertar(v[0], k).forEach(t => r.push([t, v[1]])); insertar(v[1], k).forEach(t => r.push([v[0], t])); }
      return r;
    }
    // Cota inicial con adición paso a paso (greedy)
    let X = [1, 2];
    for (let k = 3; k < n; k++) X = insertar(X, k).reduce((b, t) => largo(t) < largo(b) ? t : b);
    let mejor = largo(X), arboles = [], total = 0, nodos = 0;
    const t0 = performance.now();
    (function buscar(T, k) {
      if (++nodos > 3e6) return;
      if (k === n) {
        const L = largo(T);
        if (L < mejor) { mejor = L; arboles = []; total = 0; }
        if (L === mejor) { total++; if (arboles.length < 3000) arboles.push(T); }
        return;
      }
      for (const t of insertar(T, k)) if (largo(t) <= mejor) buscar(t, k + 1);
    })([1, 2], 3);
    if (nodos > 3e6) avisar("La búsqueda fue muy larga y se detuvo antes de revisar todos los árboles; el resultado es aproximado.");
    else avisar(`Listo: se revisaron todos los árboles posibles en ${Math.round(performance.now() - t0)} ms.`, true);

    // Clados (máscaras de bits) y consenso estricto
    const clados = T => { const s = new Set(); (function r(v) { if (!Array.isArray(v)) return 1 << v; const b = r(v[0]) | r(v[1]); s.add(b); return b; })(T); return s; };
    let comunes = clados(arboles[0]);
    arboles.slice(1).forEach(T => { const c = clados(T); comunes = new Set([...comunes].filter(x => c.has(x))); });
    const pc = x => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };
    const lista = [...comunes].sort((a, b) => pc(b) - pc(a));   // de mayor a menor
    // Construir el árbol de consenso: cada clado cuelga del clado más pequeño que lo contiene
    const nodosC = lista.map(b => ({ b, hijos: [] }));
    nodosC.forEach((nd, i) => {
      for (let k = i - 1; k >= 0; k--) if ((nodosC[k].b & nd.b) === nd.b && nodosC[k].b !== nd.b) { nodosC[k].hijos.push(nd); return; }
    });
    for (let t = 1; t < n; t++) {
      let dueño = null; nodosC.forEach(nd => { if (nd.b & (1 << t)) dueño = nd; });   // el más pequeño (último)
      dueño.hijos.push({ hoja: t, b: 1 << t });
    }
    const arbol = { b: -1, hijos: [{ hoja: 0, b: 1 }, nodosC[0]], raiz: true };

    // Sinapomorfías: estado presente en todos los miembros de un clado y en ningún otro taxón
    const marcas = new Map(), homoplasias = [];
    const todosClados = [...nodosC.map(x => x.b), ...Array.from({ length: n - 1 }, (_, i) => 1 << (i + 1))];
    caracteres.forEach((_, j) => {
      const ext = taxones[0].estados[j];
      const estados = [...new Set(taxones.slice(1).map(t => t.estados[j]).filter(e => e !== "?" && e !== ext && e !== ""))];
      estados.forEach(e => {
        let con = 0; taxones.forEach((t, i) => { if (t.estados[j] === e) con |= 1 << i; });
        const desconocidos = taxones.reduce((s, t, i) => t.estados[j] === "?" ? s | (1 << i) : s, 0);
        const c = todosClados.filter(b => (b & con) === con).sort((a, b) => pc(a) - pc(b))[0];
        if (c !== undefined && (c & ~(con | desconocidos)) === 0) { if (!marcas.has(c)) marcas.set(c, []); marcas.get(c).push(`${j + 1}${e !== "1" ? `(${e})` : ""}`); }
        else homoplasias.push(j + 1);
      });
    });

    // Índice de consistencia
    let minimo = 0;
    caracteres.forEach((_, j) => { const s = new Set(taxones.map(t => t.estados[j]).filter(e => e !== "?" && e !== "")); minimo += Math.max(0, s.size - 1); });
    const ci = mejor ? minimo / mejor : 1;
    $("[data-info]").innerHTML = `<p class="filo-datos"><strong>Longitud:</strong> ${mejor} pasos · <strong>Árboles igual de parsimoniosos:</strong> ${total.toLocaleString("es-CO")} · <strong>Índice de consistencia (IC):</strong> ${ci.toLocaleString("es-CO", { maximumFractionDigits: 2 })}</p>
      <p class="small muted">${total > 1 ? "Como hay varios árboles con la misma longitud, se muestra su <strong>consenso estricto</strong>: solo los grupos que aparecen en todos. Donde salen más de dos ramas de un mismo nodo (una <strong>politomía</strong>), los caracteres no alcanzan para decidir el parentesco; prueba agregando más." : "Hay un único árbol más parsimonioso."}
      ${ci < 1 ? ` El IC menor que 1 indica <strong>homoplasia</strong>: algunos estados aparecieron más de una vez de forma independiente (convergencia) o se perdieron${homoplasias.length ? ` (caracteres ${[...new Set(homoplasias)].join(", ")})` : ""}.` : " Con IC = 1 no hay homoplasia: cada estado derivado apareció una sola vez."}</p>`;
    dibujar(arbol, nombres, marcas);
  }

  // ---------- Dibujo del cladograma ----------
  function dibujar(arbol, nombres, marcas) {
    const W = 760, SEP = 34, IZQ = 30, top = titulo ? 46 : 18;
    const hojas = []; (function r(v) { if (v.hoja !== undefined) hojas.push(v); else v.hijos.forEach(r); })(arbol);
    const prof = v => v.hoja !== undefined ? 0 : 1 + Math.max(...v.hijos.map(prof));
    const P = prof(arbol), anchoNombre = Math.min(260, 16 + 8.4 * Math.max(...nombres.map((s, i) => s.length + (i ? 0 : 17))));
    const paso = (W - IZQ - anchoNombre - 20) / P;
    let fila = 0;
    const lineas = [], textos = [], ticks = [];
    (function ubicar(v, d) {
      v.x = IZQ + d * paso;
      if (v.hoja !== undefined) { v.x = IZQ + P * paso; v.y = top + 12 + fila++ * SEP; return; }
      v.hijos.forEach(h => ubicar(h, d + 1));
      v.y = (v.hijos[0].y + v.hijos[v.hijos.length - 1].y) / 2;
    })(arbol, 0);
    (function trazar(v) {
      if (v.hoja !== undefined) { textos.push(`<text x="${v.x + 8}" y="${v.y + 5}" font-size="15" font-weight="${v.hoja ? 700 : 400}" font-style="italic" fill="#1d1712" font-family="Nunito Sans, Arial, sans-serif">${esc(nombres[v.hoja])}${v.hoja ? "" : " (grupo externo)"}</text>`); return; }
      const ys = v.hijos.map(h => h.y);
      lineas.push(`<line x1="${v.x}" y1="${Math.min(...ys)}" x2="${v.x}" y2="${Math.max(...ys)}"/>`);
      v.hijos.forEach(h => {
        lineas.push(`<line x1="${v.x}" y1="${h.y}" x2="${h.x}" y2="${h.y}"/>`);
        const mk = marcas.get(h.b);
        if (mk) {
          const xm = v.x + Math.min(36, (h.x - v.x) / 2);
          ticks.push(`<rect x="${xm - 3}" y="${h.y - 7}" width="6" height="14" fill="#c27c00"/>
            <text x="${xm}" y="${h.y - 11}" text-anchor="middle" font-size="12" font-weight="800" fill="#c27c00" font-family="Nunito Sans, Arial, sans-serif">${mk.join(", ")}</text>`);
        }
        trazar(h);
      });
    })(arbol);
    lineas.unshift(`<line x1="${IZQ - 18}" y1="${arbol.y}" x2="${IZQ}" y2="${arbol.y}"/>`);
    const yLey = top + 12 + fila * SEP + 10;
    const col = Math.ceil(caracteres.length / 2);
    const leyenda = caracteres.map((c, j) => `<text x="${IZQ + (j < col ? 0 : 370)}" y="${yLey + 24 + (j % col) * 18}" font-size="12" fill="#3a2e22" font-family="Nunito Sans, Arial, sans-serif"><tspan font-weight="800" fill="#c27c00">${j + 1}.</tspan> ${esc(c)}</text>`).join("");
    const alto = yLey + 30 + col * 18;
    svg.setAttribute("viewBox", `0 0 ${W} ${alto}`);
    svg.innerHTML = `<rect width="100%" height="100%" fill="#fffaf0"/>
      ${titulo ? `<text x="${W / 2}" y="26" text-anchor="middle" font-size="17" font-weight="800" fill="#1d1712" font-family="Fraunces, Georgia, serif">${esc(titulo)}</text>` : ""}
      <g stroke="#1d1712" stroke-width="2.4" stroke-linecap="round">${lineas.join("")}</g>${ticks.join("")}${textos.join("")}
      <line x1="${IZQ}" y1="${yLey}" x2="${W - 20}" y2="${yLey}" stroke="#ecd9a8"/>
      ${leyenda}
      <text x="${W - 20}" y="${yLey - 6}" text-anchor="end" font-size="11" fill="#6b5a45" font-family="Nunito Sans, Arial, sans-serif">▮ n = sinapomorfía (carácter derivado compartido)</text>`;
  }

  function cargar(d) {
    caracteres = [...d.caracteres];
    taxones = d.taxones.map(([nombre, s]) => ({ nombre, estados: s.split("") }));
    titulo = d.titulo; $("#filo-titulo").value = titulo;
    pintarMatriz(); construir();
  }
  cargar(EJEMPLO);
})();
