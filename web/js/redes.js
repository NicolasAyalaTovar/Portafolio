/* Juego bachillerato 04: La red trófica del humedal.
   Una red trófica sencilla de un humedal de Bogotá. En cada reto ocurre una perturbación;
   la persona predice el efecto sobre una especie y luego ve cómo el cambio se propaga
   por la red, paso a paso. Conceptos: cascada trófica (control de arriba hacia abajo),
   resurgimiento de plagas, eutrofización, pirámide de energía (regla del 10 %) y
   control de abajo hacia arriba. */
(function () {
  const raiz = document.getElementById("redes");
  if (!raiz) return;

  const W = 640, H = 430;
  const Y = { 4: 58, 3: 160, 2: 268, 1: 372 };
  const NODOS = {
    garza:       { n: ["Garza"], nivel: 4, x: 250, info: "Ave que caza en la orilla: come ninfas de libélula y caracoles." },
    pez:         { n: ["Pez", "exótico"], nivel: 4, x: 480, oculto: true, info: "Pez introducido por personas. No es parte natural del humedal." },
    mariquita:   { n: ["Mariquitas"], nivel: 3, x: 110, info: "Depredadoras de pulgones, tanto las larvas como los adultos." },
    libelula:    { n: ["Ninfas de", "libélula"], nivel: 3, x: 390, info: "Viven en el agua y cazan larvas de otros insectos." },
    pulgones:    { n: ["Pulgones"], nivel: 2, x: 70, info: "Chupan la savia de los juncos y se reproducen muy rápido." },
    zancudo:     { n: ["Larvas de", "zancudo"], nivel: 2, x: 195, info: "Filtran algas y partículas del agua." },
    efimera:     { n: ["Ninfas de", "efímera"], nivel: 2, x: 320, info: "Raspan algas de las piedras y plantas. Necesitan mucho oxígeno." },
    quironomido: { n: ["Larvas de", "quironómido"], nivel: 2, x: 445, info: "Comen algas y restos en el lodo. Toleran muy poco oxígeno." },
    caracol:     { n: ["Caracoles"], nivel: 2, x: 570, info: "Raspan las algas que crecen sobre las plantas." },
    juncos:      { n: ["Juncos y", "plantas"], nivel: 1, x: 150, info: "Productores: hacen fotosíntesis y dan refugio a muchos animales." },
    algas:       { n: ["Algas"], nivel: 1, x: 445, info: "Productores microscópicos del agua." }
  };
  // [presa, depredador]: la flecha va de quien es comido a quien se lo come (flujo de energía)
  const ENLACES = [["juncos", "pulgones"], ["algas", "zancudo"], ["algas", "efimera"], ["algas", "quironomido"], ["algas", "caracol"],
    ["pulgones", "mariquita"], ["zancudo", "libelula"], ["efimera", "libelula"], ["quironomido", "libelula"],
    ["libelula", "garza"], ["caracol", "garza"], ["libelula", "pez"]];

  const RETOS = [
    { titulo: "Reto 1 · Peces en el humedal", concepto: "Cascada trófica",
      texto: "Alguien suelta en el humedal unos peces exóticos que se comen las ninfas de libélula.",
      agrega: "pez", objetivo: "zancudo",
      pregunta: "Unos meses después, ¿qué pasa con las larvas de zancudo?",
      opciones: ["Aumentan", "Disminuyen", "No cambian, porque los peces no las comen"], correcta: 0,
      efectos: [["pez", "up", 0], ["libelula", "down", 1], ["zancudo", "up", 2], ["efimera", "up", 2], ["quironomido", "up", 2], ["garza", "down", 2], ["algas", "down", 3]],
      por: "Los peces no tocan a los zancudos, pero se comen a su depredador. Con menos ninfas de libélula, las larvas de zancudo se multiplican y comen más algas. Un cambio en la cima se propaga hacia abajo, nivel por nivel: es una <strong>cascada trófica</strong>." },
    { titulo: "Reto 2 · Insecticida contra los pulgones", concepto: "Resurgimiento de plagas",
      texto: "Para acabar con los pulgones de los juncos, alguien fumiga con insecticida. Mueren casi todos los pulgones… y también las mariquitas.",
      objetivo: "pulgones",
      pregunta: "Dos meses después, ¿cómo están los pulgones?",
      opciones: ["Hay más que antes de fumigar", "Casi desaparecieron", "Igual que antes de fumigar"], correcta: 0,
      efectos: [["pulgones", "down", 0], ["mariquita", "down", 0], ["pulgones", "up", 1], ["juncos", "down", 2]],
      por: "Los pulgones se reproducen en pocos días (las hembras tienen crías sin necesidad de machos), mientras que las mariquitas tardan semanas. Sin sus depredadores, los pulgones sobrevivientes regresan en mayor número: es el <strong>resurgimiento de plagas</strong>. Por eso el <strong>control biológico</strong> con mariquitas, crisopas y sírfidos suele funcionar mejor." },
    { titulo: "Reto 3 · El tubo de aguas negras", concepto: "Eutrofización",
      texto: "Un tubo descarga aguas negras con muchos nutrientes. Las algas crecen sin control y, cuando mueren, su descomposición gasta el oxígeno del agua.",
      objetivo: "efimera",
      pregunta: "¿Qué pasa con las ninfas de efímera?",
      opciones: ["Aumentan, porque tienen más algas para comer", "Disminuyen", "No cambian"], correcta: 1,
      efectos: [["algas", "up", 0], ["efimera", "down", 1], ["quironomido", "up", 1], ["zancudo", "up", 1], ["caracol", "up", 1]],
      por: "Más comida no siempre significa más consumidores. Las efímeras necesitan agua con mucho oxígeno, así que desaparecen aunque sobren algas; en cambio, las larvas rojas de quironómido y los zancudos resisten y se multiplican. Esa es la <strong>eutrofización</strong>, y por eso estos insectos sirven como bioindicadores (¡como en el Detective del humedal!)." },
    { titulo: "Reto 4 · La pirámide de energía", concepto: "Regla del 10 %", energia: true,
      texto: "Las plantas y algas del humedal captan 10 000 kilocalorías de energía del sol. Cada nivel trófico aprovecha solo cerca del 10 % de la energía del nivel anterior: el resto se gasta en respirar, moverse y crecer, y se pierde como calor.",
      objetivo: "garza",
      pregunta: "¿Cuánta energía le llega a la garza, que está en el cuarto nivel?",
      opciones: ["1 000 kcal", "100 kcal", "10 kcal", "1 kcal"], correcta: 2,
      efectos: [],
      por: "De 10 000 kcal en los productores pasan unas 1 000 a los herbívoros, 100 a las ninfas de libélula y solo <strong>10 kcal</strong> a la garza. Por eso hay muchas menos garzas que insectos y las redes tróficas rara vez tienen más de cuatro o cinco niveles." },
    { titulo: "Reto 5 · Rellenan el humedal", concepto: "Control de abajo hacia arriba",
      texto: "Para construir, rellenan y drenan parte del humedal. Desaparecen muchos juncos y plantas acuáticas.",
      objetivo: "mariquita",
      pregunta: "¿Qué pasa con las mariquitas?",
      opciones: ["Aumentan", "Disminuyen", "No cambian, porque no comen plantas"], correcta: 1,
      efectos: [["juncos", "down", 0], ["pulgones", "down", 1], ["libelula", "down", 1], ["mariquita", "down", 2], ["garza", "down", 2]],
      por: "Aunque las mariquitas no comen plantas, dependen de los pulgones, que sí las comen. Cuando faltan los productores, el efecto sube por la red hasta los depredadores: es el <strong>control de abajo hacia arriba</strong>. Las libélulas también sufren, porque ponen sus huevos dentro de las plantas acuáticas. Proteger el hábitat protege toda la red." }
  ];
  const ENERGIA = { 1: "10 000", 2: "1 000", 3: "100", 4: "10" };

  let reto, aciertos, respondido, timers = [];

  raiz.innerHTML = `
    <span class="etiqueta">Bachillerato · Juego 04 · La red trófica del humedal</span>
    <div class="marcador" data-marcador aria-hidden="true"></div>
    <p class="pregunta" data-titulo></p>
    <p class="muted small" data-texto></p>
    <figure class="red-figura">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Red trófica del humedal" data-svg></svg>
      <figcaption class="small muted">
        <span class="red-leyenda"><i class="nivel-1"></i>Productores <i class="nivel-2"></i>Herbívoros <i class="nivel-3"></i>Carnívoros <i class="nivel-4"></i>Superdepredadores</span>
        Las flechas van de quien es comido a quien se lo come: muestran hacia dónde fluye la energía.</figcaption>
    </figure>
    <p class="red-preg" data-preg></p>
    <div class="opciones" data-opciones></div>
    <p class="explicacion" data-explicacion aria-live="polite"></p>
    <button type="button" class="btn oscuro" data-siguiente hidden>Siguiente reto →</button>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);

  function dibujarRed(r) {
    const visible = id => !NODOS[id].oculto || (r && r.agrega === id);
    const pos = id => ({ x: NODOS[id].x, y: Y[NODOS[id].nivel] });
    const flechas = ENLACES.filter(([a, b]) => visible(a) && visible(b)).map(([a, b]) => {
      const p = pos(a), q = pos(b);
      const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy);
      const x1 = p.x + dx / L * 30, y1 = p.y - 25, x2 = q.x - dx / L * 30, y2 = q.y + 29;
      return `<line x1="${x1.toFixed(1)}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2}" class="red-flecha" marker-end="url(#red-punta)"/>`;
    }).join("");
    const nodos = Object.entries(NODOS).filter(([id]) => visible(id)).map(([id, d]) => {
      const p = pos(id), nuevo = r && r.agrega === id;
      return `<g class="red-nodo nivel-${d.nivel}${nuevo ? " nuevo" : ""}${r && r.objetivo === id ? " objetivo" : ""}" data-id="${id}" transform="translate(${p.x} ${p.y})">
        <title>${d.n.join(" ")}: ${d.info}</title>
        <g class="red-escala"><rect x="-58" y="-25" width="116" height="50" rx="14"/>
        ${d.n.map((t, i) => `<text y="${(i - (d.n.length - 1) / 2) * 17 + 5}" text-anchor="middle">${t}</text>`).join("")}</g>
        <g class="red-marca" transform="translate(52 -24)"><circle r="13"/><text y="5" text-anchor="middle"></text></g>
      </g>`;
    }).join("");
    $("svg").innerHTML = `<defs><marker id="red-punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z"/></marker></defs>
      ${flechas}${nodos}`;
  }

  function mostrar() {
    const r = RETOS[reto];
    respondido = false;
    timers.forEach(clearTimeout); timers = [];
    $("titulo").textContent = r.titulo;
    $("texto").textContent = r.texto;
    dibujarRed(r);
    $("preg").innerHTML = `<strong>${r.pregunta}</strong>`;
    $("opciones").innerHTML = r.opciones.map((o, i) => `<button type="button" class="btn" data-i="${i}">${o}</button>`).join("");
    $("explicacion").textContent = "";
    $("siguiente").hidden = true;
  }

  function propagar(r) {
    if (r.energia) {
      // Una etiqueta por nivel trófico, de los productores hacia arriba
      [1, 2, 3, 4].forEach(n => timers.push(setTimeout(() => {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("class", "red-kcal"); t.setAttribute("x", "8"); t.setAttribute("y", Y[n] + 44);
        t.textContent = `Nivel ${n}: ${ENERGIA[n]} kcal`;
        $("svg").append(t);
        raiz.querySelectorAll(`.red-nodo.nivel-${n}`).forEach(g => g.classList.add("energia"));
      }, 300 + (n - 1) * 650)));
      return;
    }
    r.efectos.forEach(([id, dir, paso]) => timers.push(setTimeout(() => {
      const g = raiz.querySelector(`.red-nodo[data-id="${id}"]`); if (!g) return;
      g.classList.remove("up", "down"); void g.getBBox(); g.classList.add(dir);
      g.querySelector(".red-marca text").textContent = dir === "up" ? "↑" : "↓";
    }, 300 + paso * 800)));
  }

  function responder(i) {
    if (respondido) return;
    respondido = true;
    const r = RETOS[reto], ok = i === r.correcta;
    if (ok) aciertos++;
    $("marcador").children[reto].className = ok ? "ok" : "mal";
    $("opciones").querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (+b.dataset.i === r.correcta) b.classList.add("correcta"); else if (+b.dataset.i === i) b.classList.add("incorrecta");
    });
    propagar(r);
    $("explicacion").innerHTML = `<strong>${ok ? "¡Correcto!" : "No es así."}</strong> <span class="red-concepto">${r.concepto}.</span> ${r.por}`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = reto < RETOS.length - 1 ? "Siguiente reto →" : "Ver resultado";
  }

  function final() {
    timers.forEach(clearTimeout);
    $("titulo").textContent = `Resolviste ${aciertos} de ${RETOS.length} retos`;
    $("texto").textContent = "";
    dibujarRed(null);
    $("preg").textContent = ""; $("opciones").innerHTML = "";
    $("explicacion").innerHTML = `En una red trófica todo está conectado: un cambio en una especie afecta a otras que ni siquiera se come ni la comen.
      <ul class="evo-resumen">
        <li><strong>De arriba hacia abajo:</strong> los depredadores regulan a sus presas (cascada trófica).</li>
        <li><strong>De abajo hacia arriba:</strong> los productores sostienen a toda la red.</li>
        <li><strong>Energía:</strong> solo cerca del 10 % pasa de un nivel al siguiente.</li>
        <li><strong>Factores limitantes:</strong> además de comida, los organismos necesitan oxígeno, refugio y lugares para reproducirse.</li>
      </ul>`;
    $("siguiente").textContent = "Jugar de nuevo";
  }

  function iniciar() {
    reto = 0; aciertos = 0;
    $("marcador").innerHTML = "<span></span>".repeat(RETOS.length);
    mostrar();
  }

  $("opciones").addEventListener("click", ev => { const b = ev.target.closest("button"); if (b && !b.disabled) responder(+b.dataset.i); });
  $("siguiente").addEventListener("click", () => {
    if (reto >= RETOS.length) return iniciar();
    reto++;
    if (reto < RETOS.length) mostrar(); else final();
  });
  iniciar();
})();
