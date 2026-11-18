/* Juego bachillerato: Detective del humedal.
   En cada punto de muestreo hay macroinvertebrados acuáticos. Cada familia
   tiene un puntaje de sensibilidad a la contaminación (BMWP/Col, Roldán 2003):
   10 = muy sensible, 1 = muy tolerante. El promedio de los puntajes (ASPT)
   indica la calidad del agua. Umbrales simplificados para el juego. */
(function () {
  const raiz = document.getElementById("humedal");
  if (!raiz) return;

  const FAMILIAS = {
    Perlidae:        { nombre: "Mosca de las piedras", grupo: "Plecoptera (ninfa)", p: 10, por: "Necesita agua fría, rápida y con mucho oxígeno. Si la encuentras, el agua está muy limpia." },
    Leptophlebiidae: { nombre: "Efímera branquiada", grupo: "Ephemeroptera (ninfa)", p: 9, por: "Respira con branquias en el abdomen y es muy sensible a la contaminación." },
    Simuliidae:      { nombre: "Larva de jején", grupo: "Diptera (larva)", p: 8, por: "Se fija a las piedras en aguas corrientes y filtra su alimento." },
    Baetidae:        { nombre: "Efímera nadadora", grupo: "Ephemeroptera (ninfa)", p: 7, por: "Pequeña y ágil. Tolera un poco de contaminación, pero prefiere aguas limpias." },
    Hydropsychidae:  { nombre: "Tricóptero tejedor", grupo: "Trichoptera (larva)", p: 7, por: "Teje una red de seda para atrapar comida que trae la corriente." },
    Elmidae:         { nombre: "Escarabajo de los rápidos", grupo: "Coleoptera", p: 6, por: "Escarabajo diminuto que vive pegado a las piedras toda su vida y respira el oxígeno del agua." },
    Coenagrionidae:  { nombre: "Ninfa de caballito del diablo", grupo: "Odonata (ninfa)", p: 7, por: "Caza entre las plantas acuáticas, como la ninfa de Mesamphiagrion laterale del álbum." },
    Hyalellidae:     { nombre: "Anfípodo", grupo: "Crustacea (no es insecto)", p: 7, por: "Pequeño crustáceo que come restos de plantas. Abunda en humedales con vegetación sana." },
    Notonectidae:    { nombre: "Chinche nadadora de espalda", grupo: "Hemiptera", p: 7, por: "Nada boca arriba y toma aire de la superficie para respirar." },
    Aeshnidae:       { nombre: "Ninfa de libélula", grupo: "Odonata (ninfa)", p: 6, por: "Gran depredadora del fondo, como la ninfa de Rhionaeschna marchali del álbum." },
    Belostomatidae:  { nombre: "Chinche gigante de agua", grupo: "Hemiptera", p: 5, por: "Respira aire con un tubo en la punta del abdomen. El macho carga los huevos en la espalda." },
    Physidae:        { nombre: "Caracol físido", grupo: "Gastropoda (no es insecto)", p: 3, por: "Respira aire, así que resiste aguas con muy poco oxígeno." },
    Glossiphoniidae: { nombre: "Sanguijuela", grupo: "Hirudinea (no es insecto)", p: 3, por: "Se alimenta de caracoles y otros invertebrados. Tolera bastante contaminación." },
    Chironomidae:    { nombre: "Larva roja de quironómido", grupo: "Diptera (larva)", p: 2, por: "Su sangre tiene hemoglobina, que le permite vivir en lodo con casi nada de oxígeno." },
    Syrphidae:       { nombre: "Larva cola de rata", grupo: "Diptera (larva)", p: 2, por: "Pariente de los sírfidos del álbum. Respira por un tubo largo, como un esnórquel." },
    Culicidae:       { nombre: "Larva de zancudo", grupo: "Diptera (larva)", p: 2, por: "Respira aire en la superficie, así que la falta de oxígeno en el agua no la afecta." },
    Tubificidae:     { nombre: "Gusano del lodo", grupo: "Oligochaeta (no es insecto)", p: 1, por: "Vive enterrado en el lodo donde hay mucha materia orgánica y casi no hay oxígeno." }
  };

  const CASOS = [
    { titulo: "Punto A · Quebrada que entra al humedal",
      contexto: "Agua fría y rápida que baja de los cerros orientales, con piedras y hojas en el fondo.",
      familias: ["Perlidae", "Leptophlebiidae", "Baetidae", "Hydropsychidae", "Elmidae", "Simuliidae"] },
    { titulo: "Punto B · Zona de juncos",
      contexto: "Agua quieta, rodeada de juncos y buchón, en el espejo de agua del humedal.",
      familias: ["Coenagrionidae", "Aeshnidae", "Hyalellidae", "Notonectidae", "Belostomatidae", "Physidae", "Chironomidae"] },
    { titulo: "Punto C · Cerca de un tubo de desagüe",
      contexto: "Agua turbia y con mal olor junto a una tubería que trae aguas residuales del barrio.",
      familias: ["Chironomidae", "Tubificidae", "Syrphidae", "Culicidae", "Glossiphoniidae", "Physidae"] }
  ];

  const CALIDAD = [
    { id: "buena", nombre: "Buena", min: 6.5, por: "dominan las familias sensibles, que solo viven donde hay mucho oxígeno" },
    { id: "regular", nombre: "Regular", min: 4.5, por: "conviven familias sensibles y tolerantes: el agua tiene algo de contaminación" },
    { id: "mala", nombre: "Mala", min: 0, por: "solo sobreviven organismos tolerantes, capaces de vivir con muy poco oxígeno" }
  ];
  const clase = prom => CALIDAD.find(c => prom >= c.min);

  let caso, revisadas, aciertos, respondido;

  raiz.innerHTML = `
    <span class="etiqueta">Bachillerato · Juego 01 · Detective del humedal</span>
    <p class="pregunta" data-titulo></p>
    <p class="muted small humedal-contexto" data-contexto></p>
    <div class="marcador" data-marcador aria-hidden="true"></div>
    <p class="small humedal-instruccion">Examina cada organismo de la muestra con la lupa. Cuando los hayas revisado todos, decide la calidad del agua.</p>
    <div class="humedal-muestra" data-muestra></div>
    <p class="humedal-indice" data-indice aria-live="polite"></p>
    <div class="opciones" data-opciones></div>
    <p class="explicacion" data-explicacion aria-live="polite"></p>
    <button type="button" class="btn oscuro" data-siguiente hidden>Siguiente punto →</button>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);

  function promedio(ids) { return ids.reduce((s, f) => s + FAMILIAS[f].p, 0) / ids.length; }

  function pintarIndice() {
    const c = CASOS[caso], vistas = c.familias.filter((_, i) => revisadas.has(i));
    $("indice").innerHTML = vistas.length
      ? `Familias revisadas: <strong>${vistas.length} de ${c.familias.length}</strong> · Suma de puntajes: <strong>${vistas.reduce((s, f) => s + FAMILIAS[f].p, 0)}</strong> · Promedio: <strong>${promedio(vistas).toFixed(1)}</strong>`
      : "Aún no has examinado ningún organismo.";
    const listo = vistas.length === c.familias.length;
    $("opciones").querySelectorAll("button").forEach(b => b.disabled = !listo || respondido);
  }

  function mostrarCaso() {
    const c = CASOS[caso];
    revisadas = new Set(); respondido = false;
    $("titulo").textContent = c.titulo;
    $("contexto").textContent = c.contexto;
    $("muestra").innerHTML = c.familias.map((f, i) => `
      <button type="button" class="humedal-bicho" data-i="${i}" aria-label="Organismo ${i + 1}, sin examinar">
        <span class="humedal-lupa" aria-hidden="true">?</span><span class="small">Organismo ${i + 1}</span>
      </button>`).join("");
    $("opciones").innerHTML = CALIDAD.map(q => `<button type="button" class="btn ${q.id === "mala" ? "oscuro" : ""}" data-q="${q.id}">Calidad ${q.nombre.toLowerCase()}</button>`).join("");
    $("explicacion").textContent = "";
    $("siguiente").hidden = true;
    pintarIndice();
  }

  function revelar(b) {
    const i = +b.dataset.i, f = CASOS[caso].familias[i], d = FAMILIAS[f];
    if (revisadas.has(i)) return;
    revisadas.add(i);
    b.classList.add("revisado");
    b.style.setProperty("--s", d.p);
    b.setAttribute("aria-label", `${d.nombre}, familia ${f}, puntaje ${d.p}`);
    b.innerHTML = `<span class="humedal-puntaje" title="Puntaje BMWP/Col">${d.p}</span>
      <strong>${d.nombre}</strong><span class="small"><em>${f}</em> · ${d.grupo}</span><span class="small humedal-dato">${d.por}</span>`;
    pintarIndice();
  }

  function responder(q) {
    if (respondido) return;
    respondido = true;
    const c = CASOS[caso], prom = promedio(c.familias), real = clase(prom), ok = q === real.id;
    if (ok) aciertos++;
    $("marcador").children[caso].className = ok ? "ok" : "mal";
    $("opciones").querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (b.dataset.q === real.id) b.classList.add("correcta");
      else if (b.dataset.q === q) b.classList.add("incorrecta");
    });
    $("explicacion").innerHTML = `<strong>${ok ? "¡Bien resuelto!" : "No era esa."}</strong> El promedio es <strong>${prom.toFixed(1)}</strong>, así que la calidad es <strong>${real.nombre.toLowerCase()}</strong>: ${real.por}.`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = caso < CASOS.length - 1 ? "Siguiente punto →" : "Ver el informe final";
  }

  function final() {
    $("titulo").textContent = `Resolviste ${aciertos} de ${CASOS.length} casos`;
    $("contexto").textContent = "";
    $("muestra").innerHTML = ""; $("indice").textContent = ""; $("opciones").innerHTML = "";
    raiz.querySelector(".humedal-instruccion").hidden = true;
    $("explicacion").innerHTML = `Los <strong>bioindicadores</strong> son organismos cuya presencia o ausencia nos cuenta cómo está el ambiente.
      Las ninfas de plecópteros y efímeras solo viven en aguas limpias, mientras que los gusanos del lodo y las larvas rojas de quironómidos
      aguantan casi cualquier cosa. Por eso, sin aparatos de laboratorio, una muestra de bichos revela la salud de un humedal.
      <span class="small muted" style="display:block;margin-top:8px">Puntajes del índice BMWP/Col (Roldán, 2003). Los rangos de calidad del juego son una simplificación basada en el promedio por familia (ASPT).</span>`;
    $("siguiente").textContent = "Jugar de nuevo";
  }

  function iniciar() {
    caso = 0; aciertos = 0;
    raiz.querySelector(".humedal-instruccion").hidden = false;
    $("marcador").innerHTML = CASOS.map(() => "<span></span>").join("");
    mostrarCaso();
  }

  $("muestra").addEventListener("click", ev => { const b = ev.target.closest(".humedal-bicho"); if (b) revelar(b); });
  $("opciones").addEventListener("click", ev => { const b = ev.target.closest("button"); if (b && !b.disabled) responder(b.dataset.q); });
  $("siguiente").addEventListener("click", () => {
    if (caso >= CASOS.length) return iniciar();
    caso++;
    if (caso < CASOS.length) mostrarCaso(); else final();
  });
  iniciar();
})();
