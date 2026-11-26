/* Herramienta 04: constructor de redes tróficas.
   Se agregan organismos (con su nivel trófico) y relaciones «quién es comido → quién lo come».
   Las flechas siguen la dirección del flujo de energía, de la presa al consumidor, y los
   organismos se dibujan en cajas por niveles (Hernández Serrato y González-Reyes, 2021).
   Las cajas se pueden arrastrar. La red se descarga como PNG o JPG. */
(function () {
  const raiz = document.getElementById("red-app");
  if (!raiz) return;

  const NIVELES = {
    terciario:     { nombre: "Consumidor terciario", color: "#2f6fae", fila: 0 },
    secundario:    { nombre: "Consumidor secundario", color: "#c25a1b", fila: 1 },
    primario:      { nombre: "Consumidor primario", color: "#c99700", fila: 2 },
    productor:     { nombre: "Productor", color: "#3f7d3a", fila: 3 },
    descomponedor: { nombre: "Descomponedor", color: "#7a5230", fila: 4 }
  };
  const W = 760, FILA = 96, ARRIBA = 72, CAJA = { w: 128, h: 46 };   // ARRIBA: espacio para el título

  const EJEMPLO = {
    titulo: "Red trófica de un humedal de Bogotá",
    org: [["Juncos", "productor"], ["Algas", "productor"], ["Pulgones", "primario"], ["Larvas de zancudo", "primario"],
          ["Ninfas de efímera", "primario"], ["Caracoles", "primario"], ["Mariquitas", "secundario"], ["Arañas", "secundario"],
          ["Ninfas de libélula", "secundario"], ["Garza", "terciario"], ["Hongos y bacterias", "descomponedor"]],
    rel: [["Juncos", "Pulgones"], ["Algas", "Larvas de zancudo"], ["Algas", "Ninfas de efímera"], ["Algas", "Caracoles"],
          ["Pulgones", "Mariquitas"], ["Pulgones", "Arañas"], ["Larvas de zancudo", "Ninfas de libélula"], ["Ninfas de efímera", "Ninfas de libélula"],
          ["Mariquitas", "Arañas"], ["Ninfas de libélula", "Garza"], ["Caracoles", "Garza"],
          ["Juncos", "Hongos y bacterias"], ["Algas", "Hongos y bacterias"]]
  };

  let org = [], rel = [], pos = {}, sig = 1, titulo = "";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const porId = id => org.find(o => o.id === id);

  raiz.innerHTML = `
    <div class="red-editor">
      <div class="tarjeta">
        <h3>1. Agrega organismos</h3>
        <form class="red-form" data-form="org">
          <div><label for="red-nombre">Nombre</label><input id="red-nombre" type="text" maxlength="28" placeholder="Ej.: Mariquita" required></div>
          <div><label for="red-nivel">Nivel trófico</label><select id="red-nivel">${Object.entries(NIVELES).map(([k, v]) => `<option value="${k}">${v.nombre}</option>`).join("")}</select></div>
          <button class="btn chico" type="submit">Agregar</button>
        </form>
        <ul class="red-lista" data-lista="org"></ul>
      </div>
      <div class="tarjeta">
        <h3>2. Agrega relaciones</h3>
        <p class="small muted">La flecha va de quien <strong>es comido</strong> hacia quien <strong>se lo come</strong>: así muestra hacia dónde fluye la energía.</p>
        <form class="red-form" data-form="rel">
          <div><label for="red-de">Es comido</label><select id="red-de"></select></div>
          <div><label for="red-a">Se lo come</label><select id="red-a"></select></div>
          <button class="btn chico" type="submit">Agregar flecha</button>
        </form>
        <ul class="red-lista" data-lista="rel"></ul>
      </div>
    </div>
    <div class="tarjeta red-lienzo-tarjeta">
      <div class="campos red-titulo"><div><label for="red-titulo">Título del diagrama</label><input id="red-titulo" type="text" maxlength="60" placeholder="Red trófica de…"></div></div>
      <p class="small muted">Arrastra las cajas para acomodar la red a tu gusto.</p>
      <svg class="red-lienzo" data-svg viewBox="0 0 ${W} 520" role="img" aria-label="Diagrama de la red trófica"></svg>
      <div class="red-analisis" data-analisis aria-live="polite"></div>
      <div class="acciones-tabla">
        <button type="button" class="btn chico" data-accion="png">Descargar PNG</button>
        <button type="button" class="btn chico" data-accion="jpg">Descargar JPG</button>
        <button type="button" class="btn chico oscuro" data-accion="ordenar">Reordenar por niveles</button>
        <button type="button" class="btn chico oscuro" data-accion="ejemplo">Cargar ejemplo</button>
        <button type="button" class="btn chico oscuro" data-accion="limpiar">Empezar de cero</button>
      </div>
    </div>`;
  const $ = s => raiz.querySelector(s);
  const svg = $("[data-svg]");

  // ---------- Disposición por niveles ----------
  function ordenar() {
    pos = {};
    Object.keys(NIVELES).forEach(n => {
      const fila = org.filter(o => o.nivel === n);
      fila.forEach((o, i) => { pos[o.id] = { x: (W / (fila.length + 1)) * (i + 1), y: ARRIBA + NIVELES[n].fila * FILA }; });
    });
  }
  function ubicarNuevo(o) {
    const fila = NIVELES[o.nivel].fila, y = ARRIBA + fila * FILA;
    const ocupados = org.filter(x => x.id !== o.id && pos[x.id] && Math.abs(pos[x.id].y - y) < 5).map(x => pos[x.id].x);
    let x = 80; while (ocupados.some(v => Math.abs(v - x) < CAJA.w + 8) && x < W - 70) x += 40;
    pos[o.id] = { x: Math.min(x, W - 70), y };
  }

  // ---------- Dibujo ----------
  function partir(t) {   // nombres largos en dos líneas
    if (t.length <= 15) return [t];
    const p = t.split(" "); let a = "";
    while (p.length && (a + " " + p[0]).trim().length <= 15) a = (a + " " + p.shift()).trim();
    return a ? [a, p.join(" ")] : [t.slice(0, 15), t.slice(15)];
  }
  function borde(p, q) {   // punto en el borde de la caja p, hacia q
    const dx = q.x - p.x, dy = q.y - p.y, sx = (CAJA.w / 2) / Math.abs(dx || 1e-9), sy = (CAJA.h / 2) / Math.abs(dy || 1e-9), s = Math.min(sx, sy);
    return { x: p.x + dx * s, y: p.y + dy * s };
  }
  function dibujar() {
    const alto = Math.max(540, ...Object.values(pos).map(p => p.y + 60));
    svg.setAttribute("viewBox", `0 0 ${W} ${alto + 36}`);
    const flechas = rel.map(r => {
      const p = pos[r.de], q = pos[r.a]; if (!p || !q) return "";
      const a = borde(p, q), b = borde(q, p);
      return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="#6b5a45" stroke-width="2" marker-end="url(#red-flecha)"/>`;
    }).join("");
    const cajas = org.map(o => {
      const p = pos[o.id], c = NIVELES[o.nivel].color, l = partir(o.nombre);
      return `<g class="red-caja" data-id="${o.id}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
        <rect x="${-CAJA.w / 2}" y="${-CAJA.h / 2}" width="${CAJA.w}" height="${CAJA.h}" rx="10" fill="#ffffff" stroke="${c}" stroke-width="3"/>
        <rect x="${-CAJA.w / 2}" y="${-CAJA.h / 2}" width="8" height="${CAJA.h}" rx="3" fill="${c}"/>
        ${l.map((t, i) => `<text x="4" y="${(i - (l.length - 1) / 2) * 15 + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#1d1712" font-family="Nunito Sans, Arial, sans-serif">${esc(t)}</text>`).join("")}
      </g>`;
    }).join("");
    const usados = Object.keys(NIVELES).filter(n => org.some(o => o.nivel === n));
    const leyenda = usados.map((n, i) => `<g transform="translate(${16 + i * 150} ${alto + 14})"><rect width="14" height="14" rx="3" fill="${NIVELES[n].color}"/><text x="20" y="12" font-size="12" fill="#3a2e22" font-family="Nunito Sans, Arial, sans-serif">${NIVELES[n].nombre}</text></g>`).join("");
    svg.innerHTML = `<defs><marker id="red-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#6b5a45"/></marker></defs>
      <rect width="100%" height="100%" fill="#fffaf0"/>
      ${titulo ? `<text x="${W / 2}" y="22" text-anchor="middle" font-size="17" font-weight="800" fill="#1d1712" font-family="Fraunces, Georgia, serif">${esc(titulo)}</text>` : ""}
      ${flechas}${cajas}${leyenda}
      ${org.length ? "" : `<text x="${W / 2}" y="250" text-anchor="middle" font-size="15" fill="#6b5a45" font-family="Nunito Sans, Arial, sans-serif">Agrega organismos o carga el ejemplo para empezar.</text>`}`;
    analizar();
  }

  // ---------- Listas y selectores ----------
  function pintarListas() {
    const opciones = org.map(o => `<option value="${o.id}">${esc(o.nombre)}</option>`).join("");
    const de = $("#red-de"), a = $("#red-a"), vd = de.value, va = a.value;
    de.innerHTML = opciones; a.innerHTML = opciones;
    if (porId(+vd)) de.value = vd; if (porId(+va)) a.value = va;
    $('[data-lista="org"]').innerHTML = org.map(o => `<li><i style="background:${NIVELES[o.nivel].color}"></i>${esc(o.nombre)} <span class="small muted">${NIVELES[o.nivel].nombre}</span>
      <button type="button" class="red-quitar" data-quitar-org="${o.id}" aria-label="Quitar ${esc(o.nombre)}">×</button></li>`).join("");
    $('[data-lista="rel"]').innerHTML = rel.map((r, i) => `<li>${esc(porId(r.de).nombre)} <span aria-label="es comido por">→</span> ${esc(porId(r.a).nombre)}
      <button type="button" class="red-quitar" data-quitar-rel="${i}" aria-label="Quitar relación">×</button></li>`).join("");
  }
  function actualizar() { pintarListas(); dibujar(); }

  // ---------- Análisis: cadenas y avisos ----------
  function analizar() {
    if (!org.length) { $("[data-analisis]").innerHTML = ""; return; }
    const sinDesc = rel.filter(r => porId(r.a).nivel !== "descomponedor");
    const comeA = id => sinDesc.filter(r => r.de === id).map(r => r.a);
    const comidoPor = id => sinDesc.filter(r => r.a === id).length;
    const bases = org.filter(o => o.nivel !== "descomponedor" && !comidoPor(o.id) && comeA(o.id).length);
    let cadenas = 0, larga = [];
    const recorrer = (id, camino, n) => {
      if (n > 5000) return;
      const sig = comeA(id).filter(x => !camino.includes(x));
      if (!sig.length) { cadenas++; if (camino.length > larga.length) larga = camino; return; }
      sig.forEach(x => recorrer(x, [...camino, x], n + 1));
    };
    bases.forEach(b => recorrer(b.id, [b.id], 0));
    const avisos = [];
    if (!org.some(o => o.nivel === "productor")) avisos.push("No hay productores: toda red necesita organismos que capten la energía del sol.");
    if (!org.some(o => o.nivel === "descomponedor")) avisos.push("No hay descomponedores. Hongos, bacterias y lombrices devuelven los nutrientes al suelo: sin ellos la red queda incompleta.");
    const sueltos = org.filter(o => !rel.some(r => r.de === o.id || r.a === o.id));
    if (sueltos.length) avisos.push(`Sin relaciones: ${sueltos.map(o => esc(o.nombre)).join(", ")}.`);
    const fila = id => NIVELES[porId(id).nivel].fila;
    const raras = rel.filter(r => porId(r.a).nivel !== "descomponedor" && porId(r.de).nivel !== "descomponedor" && fila(r.a) > fila(r.de));
    if (raras.length) avisos.push(`Revisa la dirección de ${raras.length === 1 ? "esta flecha" : "estas flechas"}: ${raras.map(r => `${esc(porId(r.de).nombre)} → ${esc(porId(r.a).nombre)}`).join("; ")}. Debe ir de quien es comido hacia quien come.`);
    if (org.some(o => o.nivel === "productor" && sinDesc.some(r => r.a === o.id))) avisos.push("Un productor aparece comiéndose a otro organismo: los productores fabrican su propio alimento.");
    $("[data-analisis]").innerHTML = `
      <p><strong>${org.length}</strong> organismos · <strong>${rel.length}</strong> relaciones · <strong>${cadenas}</strong> cadenas tróficas dentro de la red${larga.length > 1 ? `. La más larga tiene <strong>${larga.length}</strong> eslabones: ${larga.map(id => esc(porId(id).nombre)).join(" → ")}.` : "."}</p>
      ${avisos.length ? `<ul class="small red-avisos">${avisos.map(a => `<li>${a}</li>`).join("")}</ul>` : `<p class="small red-ok">La red tiene productores, consumidores y descomponedores conectados.</p>`}`;
  }

  // ---------- Eventos ----------
  $('[data-form="org"]').addEventListener("submit", ev => {
    ev.preventDefault();
    const nombre = $("#red-nombre").value.trim(); if (!nombre) return;
    if (org.some(o => o.nombre.toLowerCase() === nombre.toLowerCase())) { $("#red-nombre").select(); return; }
    const o = { id: sig++, nombre, nivel: $("#red-nivel").value };
    org.push(o); ubicarNuevo(o);
    $("#red-nombre").value = ""; $("#red-nombre").focus();
    actualizar();
  });
  $('[data-form="rel"]').addEventListener("submit", ev => {
    ev.preventDefault();
    const de = +$("#red-de").value, a = +$("#red-a").value;
    if (!de || !a || de === a || rel.some(r => r.de === de && r.a === a)) return;
    rel.push({ de, a }); actualizar();
  });
  raiz.addEventListener("click", ev => {
    const qo = ev.target.closest("[data-quitar-org]"), qr = ev.target.closest("[data-quitar-rel]");
    if (qo) { const id = +qo.dataset.quitarOrg; org = org.filter(o => o.id !== id); rel = rel.filter(r => r.de !== id && r.a !== id); delete pos[id]; actualizar(); }
    if (qr) { rel.splice(+qr.dataset.quitarRel, 1); actualizar(); }
    const acc = ev.target.closest("[data-accion]")?.dataset.accion;
    if (acc === "png" || acc === "jpg") ExportarSVG(svg, nombreArchivo(titulo || "red_trofica"), acc);
    if (acc === "ordenar") { ordenar(); dibujar(); }
    if (acc === "ejemplo") cargar(EJEMPLO);
    if (acc === "limpiar") { org = []; rel = []; pos = {}; titulo = ""; $("#red-titulo").value = ""; actualizar(); }
  });
  $("#red-titulo").addEventListener("input", e => { titulo = e.target.value.trim(); dibujar(); });

  // Arrastrar cajas (ratón, lápiz o dedo)
  let arrastre = null;
  const punto = ev => { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  svg.addEventListener("pointerdown", ev => {
    const g = ev.target.closest(".red-caja"); if (!g) return;
    const id = +g.dataset.id, p = punto(ev);
    arrastre = { id, dx: pos[id].x - p.x, dy: pos[id].y - p.y };
    svg.setPointerCapture(ev.pointerId); ev.preventDefault();
  });
  svg.addEventListener("pointermove", ev => {
    if (!arrastre) return;
    const p = punto(ev), vb = svg.viewBox.baseVal;
    pos[arrastre.id] = { x: Math.max(CAJA.w / 2, Math.min(W - CAJA.w / 2, p.x + arrastre.dx)), y: Math.max(CAJA.h / 2 + 40, Math.min(vb.height - 60, p.y + arrastre.dy)) };
    dibujar();
  });
  ["pointerup", "pointercancel"].forEach(t => svg.addEventListener(t, () => arrastre = null));

  function cargar(d) {
    org = []; rel = []; pos = {}; sig = 1;
    d.org.forEach(([nombre, nivel]) => org.push({ id: sig++, nombre, nivel }));
    const id = n => org.find(o => o.nombre === n).id;
    rel = d.rel.map(([a, b]) => ({ de: id(a), a: id(b) }));
    titulo = d.titulo; $("#red-titulo").value = titulo;
    ordenar(); actualizar();
  }
  cargar(EJEMPLO);
})();
