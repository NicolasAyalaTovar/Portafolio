/* Juego bachillerato 03: El laboratorio de las polillas (evolución).
   Retos 1–3: la persona es un pájaro que caza polillas sobre un fondo. Las polillas que
   sobreviven tienen crías parecidas a ellas (el color se hereda con pequeñas variaciones).
   Según el fondo, la población cambia por selección direccional, estabilizadora o disruptiva.
   Reto 4: deriva genética. Un rasgo neutro (manchas en las alas) cambia solo por azar,
   y el cambio es mucho mayor en poblaciones pequeñas (modelo de Wright-Fisher). */
(function () {
  const raiz = document.getElementById("evolucion");
  if (!raiz) return;

  const N = 24, CAZAR = 12, GENERACIONES = 4, W = 600, H = 330;
  const TIPOS = [
    { id: "direccional", nombre: "Selección direccional" },
    { id: "estabilizadora", nombre: "Selección estabilizadora" },
    { id: "disruptiva", nombre: "Selección disruptiva" },
    { id: "deriva", nombre: "Deriva genética" }
  ];
  const RETOS = [
    { tipo: "direccional", titulo: "Reto 1 · El bosque cubierto de hollín",
      contexto: "El humo de las fábricas oscureció la corteza de los árboles. Casi todas las polillas de la población son claras.",
      fondo: () => .82, inicio: () => clamp(.18 + gauss() * .12),
      por: "El fondo favoreció un extremo: las polillas oscuras sobrevivieron más y el promedio de la población se corrió hacia el color oscuro. Es lo que pasó con la polilla moteada <em>Biston betularia</em> en Inglaterra durante la Revolución Industrial." },
    { tipo: "estabilizadora", titulo: "Reto 2 · Los troncos grises con líquenes",
      contexto: "Hay polillas de todos los tonos, desde muy claras hasta muy oscuras, posadas sobre troncos de un gris medio.",
      fondo: () => .5, inicio: () => Math.random(),
      por: "Las polillas de los dos extremos, muy claras y muy oscuras, resaltaban y fueron cazadas. Sobrevivieron las intermedias: el promedio se mantuvo, pero la variación se redujo." },
    { tipo: "disruptiva", titulo: "Reto 3 · El bosque de abedules y robles",
      contexto: "Troncos blancos de abedul crecen junto a troncos oscuros de roble. Cada polilla prefiere posarse en el tronco que más se parece a ella.",
      fondo: x => (Math.floor(x / (W / 6)) % 2 ? .86 : .14), inicio: () => Math.random(), elige: true,
      por: "Las polillas intermedias se veían en los dos tipos de tronco y fueron cazadas; las claras y las oscuras se escondieron. La población se dividió en dos grupos: así puede empezar la formación de especies nuevas." }
  ];

  const clamp = v => Math.max(0, Math.min(1, v));
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const tono = t => { const a = [236, 230, 214], b = [40, 35, 30]; return `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(",")})`; };
  const mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let reto, gen, pobl, inicial, cazadas, aciertos, respondido, deriva;

  raiz.innerHTML = `
    <span class="etiqueta">Bachillerato · Juego 03 · El laboratorio de las polillas</span>
    <div class="marcador" data-marcador aria-hidden="true"></div>
    <p class="pregunta" data-titulo></p>
    <p class="muted small evo-contexto" data-contexto></p>
    <div data-escena></div>
    <div data-grafica></div>
    <p class="small evo-estado" data-estado aria-live="polite"></p>
    <div class="acciones-tabla evo-acciones" data-acciones></div>
    <div class="opciones evo-opciones" data-opciones></div>
    <p class="explicacion" data-explicacion aria-live="polite"></p>
    <button type="button" class="btn oscuro" data-siguiente hidden>Siguiente reto →</button>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);

  // ---------- Retos de selección ----------
  function posar(t, r) {
    // Busca un lugar libre; en el reto 3 la polilla prefiere un tronco parecido a ella
    for (let k = 0; k < 60; k++) {
      const x = 24 + Math.random() * (W - 48), y = 24 + Math.random() * (H - 48);
      if (r.elige && k < 50 && Math.random() < .85 && Math.abs(r.fondo(x) - t) > .4) continue;
      if (pobl.every(p => Math.hypot(p.x - x, p.y - y) > 40)) return { x, y };
    }
    return { x: 24 + Math.random() * (W - 48), y: 24 + Math.random() * (H - 48) };
  }

  function nuevaGeneracion(rasgos) {
    pobl = [];
    rasgos.forEach((t, i) => pobl.push({ i, t, ...posar(t, RETOS[reto]), viva: true }));
  }

  function fondoSVG(r) {
    let s = "", semilla = 7;
    const rnd = () => (semilla = (semilla * 9301 + 49297) % 233280) / 233280;
    for (let x = 0; x < W; x += W / 6) {
      const b = r.fondo(x + 1);
      s += `<rect x="${x}" y="0" width="${W / 6 + 1}" height="${H}" fill="${tono(b)}"/>`;
      for (let k = 0; k < 26; k++) {   // textura de corteza: vetas un poco más claras y más oscuras
        const vx = x + rnd() * (W / 6), vy = rnd() * H, d = (rnd() - .5) * .22;
        s += `<path d="M${vx.toFixed(1)} ${vy.toFixed(1)} q${(rnd() * 6 - 3).toFixed(1)} ${(14 + rnd() * 22).toFixed(1)} 0 ${(30 + rnd() * 40).toFixed(1)}" stroke="${tono(clamp(b + d))}" stroke-width="${(2 + rnd() * 5).toFixed(1)}" fill="none" stroke-linecap="round" opacity=".8"/>`;
      }
    }
    return s;
  }

  const POLILLA = t => `<path d="M0 -3 C-7 -12 -19 -12 -20 -2 C-19 7 -8 8 0 3 Z M0 -3 C7 -12 19 -12 20 -2 C19 7 8 8 0 3 Z" fill="${tono(t)}" stroke="${tono(clamp(t + .12))}" stroke-width=".8"/>
    <ellipse cx="0" cy="1" rx="2.6" ry="8" fill="${tono(clamp(t + .1))}"/>`;

  function pintarEscena() {
    const r = RETOS[reto];
    $("escena").innerHTML = `<svg class="evo-escena" viewBox="0 0 ${W} ${H}" role="img" aria-label="Población de polillas sobre la corteza. Toca las polillas para atraparlas.">
      ${fondoSVG(r)}
      ${pobl.filter(p => p.viva).map(p => `<g class="evo-polilla" data-i="${p.i}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.i * 47) % 360})">
        <circle r="20" fill="transparent"/>${POLILLA(p.t)}</g>`).join("")}
    </svg>`;
  }

  function histograma(series) {
    // series: [{ nombre, valores, clase }]
    const B = 5, cuenta = v => { const c = Array(B).fill(0); v.forEach(t => c[Math.min(B - 1, Math.floor(t * B))]++); return c; };
    const datos = series.map(s => ({ ...s, c: cuenta(s.valores) }));
    const max = Math.max(...datos.flatMap(d => d.c), 1);
    const etiquetas = ["Muy clara", "Clara", "Media", "Oscura", "Muy oscura"];
    const ancho = 100 / B;
    return `<div class="evo-histo" role="img" aria-label="Número de polillas por color: ${datos.map(d => `${d.nombre}: ${d.c.join(", ")}`).join("; ")}">
      ${etiquetas.map((e, b) => `<div class="evo-col" style="width:${ancho}%">
        <div class="evo-barras">${datos.map(d => `<span class="evo-barra ${d.clase}" style="height:${d.c[b] / max * 100}%;--t:${tono((b + .5) / B)}"><b>${d.c[b]}</b></span>`).join("")}</div>
        <span class="small">${e}</span></div>`).join("")}
    </div>
    <div class="evo-leyenda small">${datos.map(d => `<span><i class="evo-barra ${d.clase}" style="--t:${tono(.5)}"></i>${d.nombre}</span>`).join("")}</div>`;
  }

  function estado() {
    const vivas = pobl.filter(p => p.viva).length;
    $("estado").innerHTML = `Generación <strong>${gen + 1} de ${GENERACIONES}</strong> · Polillas atrapadas: <strong>${cazadas} de ${CAZAR}</strong> · Quedan ${vivas}`;
  }

  function mostrarReto() {
    const r = RETOS[reto];
    gen = 0; cazadas = 0; respondido = false;
    $("titulo").textContent = r.titulo;
    $("contexto").innerHTML = `${r.contexto} <strong>Eres un pájaro:</strong> atrapa ${CAZAR} polillas tocándolas, empezando por las que veas primero. Las demás sobrevivirán y tendrán crías.`;
    inicial = Array.from({ length: N }, r.inicio);
    nuevaGeneracion(inicial);
    pintarEscena();
    $("grafica").innerHTML = "";
    $("acciones").innerHTML = `<button type="button" class="btn chico oscuro" data-accion="auto">Que cacen los pájaros</button>`;
    $("opciones").innerHTML = ""; $("explicacion").textContent = ""; $("siguiente").hidden = true;
    estado();
  }

  function cazar(i) {
    const p = pobl.find(p => p.i === i);
    if (!p || !p.viva || cazadas >= CAZAR) return;
    p.viva = false; cazadas++;
    const g = $("escena").querySelector(`[data-i="${i}"]`);
    if (g) { g.classList.add("cazada"); setTimeout(() => g.remove(), 250); }
    estado();
    if (cazadas === CAZAR) setTimeout(reproducir, 450);
  }

  // Los pájaros cazan con más probabilidad las polillas que contrastan con su fondo
  function cazaAutomatica() {
    const r = RETOS[reto];
    while (cazadas < CAZAR) {
      const vivas = pobl.filter(p => p.viva);
      const pesos = vivas.map(p => .03 + Math.pow(Math.abs(p.t - r.fondo(p.x)), 1.6));
      let u = Math.random() * pesos.reduce((a, b) => a + b, 0), k = 0;
      while ((u -= pesos[k]) > 0) k++;
      vivas[k].viva = false; cazadas++;
    }
    reproducir();
  }

  function reproducir() {
    const vivas = pobl.filter(p => p.viva).map(p => p.t);
    const crias = mezclar(vivas.flatMap(t => [clamp(t + gauss() * .06), clamp(t + gauss() * .06)]));
    gen++; cazadas = 0;
    if (gen < GENERACIONES) {
      nuevaGeneracion(crias);
      pintarEscena(); estado();
      $("grafica").innerHTML = histograma([{ nombre: "Población inicial", valores: inicial, clase: "ini" }, { nombre: `Generación ${gen + 1}`, valores: crias, clase: "act" }]);
    } else {
      pobl = crias.map((t, i) => ({ i, t, viva: true, x: 0, y: 0 }));
      terminarSeleccion(crias);
    }
  }

  function terminarSeleccion(final) {
    $("escena").innerHTML = "";
    $("acciones").innerHTML = "";
    $("estado").innerHTML = `Después de ${GENERACIONES} generaciones, así cambió el color de la población:`;
    $("grafica").innerHTML = histograma([{ nombre: "Población inicial", valores: inicial, clase: "ini" }, { nombre: "Población final", valores: final, clase: "act" }]);
    preguntar();
  }

  // ---------- Reto 4: deriva genética ----------
  function mostrarDeriva() {
    respondido = false;
    deriva = { corridas: {} };
    $("titulo").textContent = "Reto 4 · Las polillas de la isla";
    $("contexto").innerHTML = "En una isla viven polillas con y sin <strong>manchas en las alas</strong>. Las manchas no ayudan ni perjudican: los pájaros no las notan. Al empezar, la mitad de las polillas tiene manchas. Cada generación, las crías salen de padres elegidos al azar. Simula cinco islas pequeñas y cinco islas grandes.";
    $("escena").innerHTML = ""; $("opciones").innerHTML = ""; $("explicacion").textContent = ""; $("siguiente").hidden = true;
    $("acciones").innerHTML = `<button type="button" class="btn chico" data-accion="deriva" data-n="10">Islas pequeñas (10 polillas)</button>
      <button type="button" class="btn chico" data-accion="deriva" data-n="200">Islas grandes (200 polillas)</button>`;
    $("estado").textContent = "Toca un botón para simular 30 generaciones.";
    graficaDeriva();
  }

  function simular(n) {
    return Array.from({ length: 5 }, () => {
      let p = .5; const serie = [p];
      for (let g = 0; g < 30; g++) { let k = 0; for (let j = 0; j < n; j++) if (Math.random() < p) k++; p = k / n; serie.push(p); }
      return serie;
    });
  }

  function graficaDeriva() {
    const M = { l: 44, r: 12, t: 12, b: 34 }, w = W - M.l - M.r, h = 260 - M.t - M.b;
    const X = g => M.l + g / 30 * w, Y = p => M.t + h - p * h;
    const lineas = (n, cls) => (deriva.corridas[n] || []).map(s => `<path class="evo-linea ${cls}" d="${s.map((p, g) => `${g ? "L" : "M"}${X(g).toFixed(1)},${Y(p).toFixed(1)}`).join("")}"/>`).join("");
    $("grafica").innerHTML = `<svg class="evo-deriva" viewBox="0 0 ${W} 260" role="img" aria-label="Frecuencia de polillas con manchas a lo largo de 30 generaciones">
      ${[0, .25, .5, .75, 1].map(p => `<line x1="${M.l}" x2="${M.l + w}" y1="${Y(p)}" y2="${Y(p)}" class="evo-grid"/><text x="${M.l - 6}" y="${Y(p) + 4}" text-anchor="end">${p * 100}%</text>`).join("")}
      ${[0, 10, 20, 30].map(g => `<text x="${X(g)}" y="${M.t + h + 18}" text-anchor="middle">${g}</text>`).join("")}
      <text x="${M.l + w / 2}" y="256" text-anchor="middle" class="evo-eje">Generación</text>
      ${lineas(200, "grande")}${lineas(10, "pequena")}
    </svg>
    <div class="evo-leyenda small"><span><i class="evo-linea-ico pequena"></i>Islas pequeñas (10)</span><span><i class="evo-linea-ico grande"></i>Islas grandes (200)</span></div>`;
  }

  function correrDeriva(n) {
    deriva.corridas[n] = simular(n);
    graficaDeriva();
    const fijadas = deriva.corridas[10] ? deriva.corridas[10].filter(s => s[30] === 0 || s[30] === 1).length : 0;
    $("estado").innerHTML = deriva.corridas[10] && deriva.corridas[200]
      ? `En ${fijadas} de 5 islas pequeñas las manchas desaparecieron o llegaron al 100 %. En las grandes, la frecuencia se quedó cerca del 50 %.`
      : "Ahora simula el otro tamaño de isla para comparar.";
    if (deriva.corridas[10] && deriva.corridas[200] && !$("opciones").innerHTML) preguntar();
  }

  // ---------- Pregunta y cierre ----------
  function preguntar() {
    $("opciones").innerHTML = `<p class="small evo-preg"><strong>¿Qué proceso evolutivo ocurrió?</strong></p>` +
      mezclar(TIPOS).map(t => `<button type="button" class="btn" data-t="${t.id}">${t.nombre}</button>`).join("");
  }

  function responder(t) {
    if (respondido) return;
    respondido = true;
    const correcto = reto < RETOS.length ? RETOS[reto].tipo : "deriva", ok = t === correcto;
    if (ok) aciertos++;
    $("marcador").children[reto].className = ok ? "ok" : "mal";
    $("opciones").querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (b.dataset.t === correcto) b.classList.add("correcta"); else if (b.dataset.t === t) b.classList.add("incorrecta");
    });
    const por = reto < RETOS.length ? RETOS[reto].por
      : "Las manchas no daban ninguna ventaja, pero su frecuencia cambió por puro azar: unas polillas tuvieron más crías que otras por suerte. En las islas pequeñas el azar pesa mucho y las manchas pueden desaparecer o quedarse en todas; en las grandes, los cambios casi se cancelan. A diferencia de la selección natural, la deriva no adapta a los organismos a su ambiente.";
    $("explicacion").innerHTML = `<strong>${ok ? "¡Correcto!" : "No era ese."}</strong> Fue <strong>${TIPOS.find(x => x.id === correcto).nombre.toLowerCase()}</strong>. ${por}`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = reto < RETOS.length ? "Siguiente reto →" : "Ver resultado";
  }

  function final() {
    $("titulo").textContent = `Identificaste ${aciertos} de 4 procesos`;
    ["contexto", "escena", "grafica", "estado", "acciones", "opciones"].forEach(k => $(k).innerHTML = "");
    $("explicacion").innerHTML = `<ul class="evo-resumen">
        <li><strong>Selección direccional:</strong> se favorece un extremo y el promedio de la población se desplaza.</li>
        <li><strong>Selección estabilizadora:</strong> se favorecen los intermedios; se pierde variación en los extremos.</li>
        <li><strong>Selección disruptiva:</strong> se favorecen los dos extremos y la población se divide.</li>
        <li><strong>Deriva genética:</strong> la frecuencia de un rasgo cambia por azar, con más fuerza en poblaciones pequeñas.</li>
      </ul>
      La selección natural necesita tres ingredientes: <strong>variación</strong> entre individuos, que esa variación sea <strong>heredable</strong> y que afecte a la <strong>supervivencia o la reproducción</strong>.`;
    $("siguiente").textContent = "Jugar de nuevo";
  }

  function mostrar() { if (reto < RETOS.length) mostrarReto(); else mostrarDeriva(); }
  function iniciar() {
    reto = 0; aciertos = 0;
    $("marcador").innerHTML = "<span></span>".repeat(4);
    mostrar();
  }

  $("escena").addEventListener("click", ev => { const g = ev.target.closest(".evo-polilla"); if (g) cazar(+g.dataset.i); });
  $("acciones").addEventListener("click", ev => {
    const b = ev.target.closest("[data-accion]"); if (!b) return;
    if (b.dataset.accion === "auto") cazaAutomatica();
    if (b.dataset.accion === "deriva") correrDeriva(+b.dataset.n);
  });
  $("opciones").addEventListener("click", ev => { const b = ev.target.closest("button[data-t]"); if (b && !b.disabled) responder(b.dataset.t); });
  $("siguiente").addEventListener("click", () => {
    if (reto >= 4) return iniciar();
    reto++;
    if (reto < 4) mostrar(); else final();
  });
  iniciar();
})();
