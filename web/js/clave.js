/* =========================================================
   Clave dicotómica interactiva de órdenes de insectos (adultos)
   Cada paso tiene dos opciones; cada opción lleva a otro paso (ir)
   o a un orden (orden). Para ampliar la clave, edita PASOS y ORDENES.
   ========================================================= */
(function () {
  const PASOS = {
    1: { a: { t: "Sin alas.", ir: 2 },
         b: { t: "Con alas (uno o dos pares).", ir: 6 } },
    2: { a: { t: "Cuerpo aplanado de lado, como una moneda vista de canto. Patas traseras largas para saltar.", orden: "Siphonaptera" },
         b: { t: "Cuerpo de otra forma.", ir: 3 } },
    3: { a: { t: "Cuerpo cubierto de escamas plateadas y tres “colitas” (filamentos) al final del abdomen.", orden: "Zygentoma" },
         b: { t: "Sin escamas ni tres filamentos.", ir: 4 } },
    4: { a: { t: "Cuerpo aplanado de arriba abajo, patas con garras para agarrarse al pelo. Vive sobre un animal.", orden: "Phthiraptera" },
         b: { t: "Vida libre. Antenas dobladas como un codo y cintura muy estrecha entre el tórax y el abdomen.", orden: "Hymenoptera" } },
    6: { a: { t: "Un solo par de alas. El segundo par está reducido a dos “balancines” (halterios).", orden: "Diptera" },
         b: { t: "Dos pares de alas.", ir: 7 } },
    7: { a: { t: "Boca en forma de pico articulado que nace debajo de la cabeza y se dirige hacia atrás, para chupar.", orden: "Hemiptera" },
         b: { t: "Boca de otro tipo: mandíbulas o una trompa enrollada.", ir: 8 } },
    8: { a: { t: "Alas delanteras duras o como de cuero, que protegen a las traseras.", ir: 9 },
         b: { t: "Los dos pares de alas son delgados (membranosos) o están cubiertos de escamas.", ir: 11 } },
    9: { a: { t: "Alas delanteras muy cortas y unas pinzas al final del abdomen.", orden: "Dermaptera" },
         b: { t: "Sin pinzas al final del abdomen.", ir: 10 } },
    10: { a: { t: "Patas traseras largas y gruesas para saltar. Alas delanteras alargadas y como de cuero.", orden: "Orthoptera" },
          b: { t: "Alas delanteras duras como un estuche (élitros) que se juntan en una línea recta sobre la espalda.", orden: "Coleoptera" } },
    11: { a: { t: "Alas cubiertas de escamas que se quedan en los dedos como polvo. Trompa enrollada en espiral.", orden: "Lepidoptera" },
          b: { t: "Alas sin escamas.", ir: 12 } },
    12: { a: { t: "Insecto diminuto (1 a 2 mm), con alas muy delgadas bordeadas de flecos de pelos.", orden: "Thysanoptera" },
          b: { t: "Alas sin flecos de pelos.", ir: 13 } },
    13: { a: { t: "Ojos enormes, antenas muy cortas y abdomen largo y delgado. Alas con muchas venas que no se doblan sobre el cuerpo.", orden: "Odonata" },
          b: { t: "Ojos y antenas de otra forma.", ir: 14 } },
    14: { a: { t: "Alas traseras más pequeñas que las delanteras. Muchas veces con una cintura estrecha.", orden: "Hymenoptera" },
          b: { t: "Alas de tamaño parecido, con muchas venas que forman una red, dobladas como un tejado sobre el cuerpo.", orden: "Neuroptera" } }
  };

  const ORDENES = {
    Hymenoptera:  { comun: "Abejas, avispas y hormigas", raiz: "hymen (membrana) + pteron (ala)", sig: "alas membranosas" },
    Lepidoptera:  { comun: "Mariposas y polillas", raiz: "lepis (escama) + pteron (ala)", sig: "alas con escamas" },
    Coleoptera:   { comun: "Escarabajos", raiz: "koleos (estuche) + pteron (ala)", sig: "alas en estuche" },
    Orthoptera:   { comun: "Saltamontes, grillos y esperanzas", raiz: "orthos (recto) + pteron (ala)", sig: "alas rectas" },
    Hemiptera:    { comun: "Chinches, pulgones, chicharritas y escamas", raiz: "hemi (mitad) + pteron (ala)", sig: "media ala" },
    Thysanoptera: { comun: "Trips", raiz: "thysanos (fleco) + pteron (ala)", sig: "alas con flecos" },
    Neuroptera:   { comun: "Crisopas", raiz: "neuron (nervio, vena) + pteron (ala)", sig: "alas con venas" },
    Diptera:      { comun: "Moscas y zancudos", raiz: "di (dos) + pteron (ala)", sig: "dos alas" },
    Odonata:      { comun: "Libélulas y caballitos del diablo", raiz: "odous, odontos (diente)", sig: "con dientes (por sus fuertes mandíbulas)" },
    Siphonaptera: { comun: "Pulgas", raiz: "siphon (tubo) + a (sin) + pteron (ala)", sig: "tubo sin alas" },
    Phthiraptera: { comun: "Piojos", raiz: "phtheir (piojo) + a (sin) + pteron (ala)", sig: "piojo sin alas" },
    Dermaptera:   { comun: "Tijeretas", raiz: "derma (piel) + pteron (ala)", sig: "alas de piel o cuero" },
    Zygentoma:    { comun: "Pececillos de plata", raiz: "zygon (yugo, unión) + entomon (insecto)", sig: "insecto del yugo" }
  };

  const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const $ = id => document.getElementById(id);
  let ruta = [];   // pasos recorridos: [{ paso, eleccion }]

  function pintarRuta() {
    $("clave-ruta").innerHTML = ruta.length
      ? ruta.map((r, i) => `<li><button type="button" data-volver="${i}" title="Volver a este paso">${r.paso}${r.eleccion}</button></li>`).join("")
      : `<li class="muted small">Aún no has elegido nada.</li>`;
    $("clave-atras").disabled = !ruta.length;
  }

  function mostrarPaso(n) {
    const p = PASOS[n];
    $("clave-cuerpo").innerHTML = `
      <p class="clave-num">Paso ${n}</p>
      <p class="clave-pregunta">¿Cuál de estas dos descripciones se parece más a tu insecto?</p>
      <div class="clave-opciones">
        ${["a", "b"].map(k => `
          <button type="button" class="clave-opcion" data-paso="${n}" data-k="${k}">
            <span class="clave-letra" aria-hidden="true">${n}${k}</span>
            <span>${p[k].t}</span>
            <span class="clave-destino small">${p[k].orden ? "→ Resultado" : "→ Paso " + p[k].ir}</span>
          </button>`).join("")}
      </div>`;
    pintarRuta();
  }

  function mostrarOrden(o) {
    const d = ORDENES[o], ej = (window.ESPECIES || []).filter(e => e.orden === o);
    const emoji = window.LEYENDA?.ordenes[o]?.emoji || "🐛";
    $("clave-cuerpo").innerHTML = `
      <div class="clave-resultado">
        <span class="hex-icon" aria-hidden="true">${emoji}</span>
        <div>
          <p class="clave-num">Tu insecto pertenece al orden</p>
          <h3>${o}</h3>
          <p><strong>${d.comun}.</strong> Su nombre viene del griego <em>${d.raiz}</em>: “${d.sig}”.</p>
        </div>
      </div>
      ${ej.length ? `<p class="small"><strong>En el álbum de Bogotá:</strong> ${ej.map(e =>
        `<a href="entomofauna.html#${slug(e.cientifico)}">${e.nombre}</a>`).join(", ")}.</p>` : ""}
      <button type="button" class="btn" id="clave-otra">Identificar otro insecto</button>`;
    $("clave-otra").addEventListener("click", reiniciar);
    pintarRuta();
  }

  function ir(destino) { destino.orden ? mostrarOrden(destino.orden) : mostrarPaso(destino.ir); }
  function reiniciar() { ruta = []; mostrarPaso(1); }
  function volverA(i) {          // deshace las elecciones desde la posición i
    const paso = ruta[i].paso; ruta = ruta.slice(0, i); mostrarPaso(paso);
  }

  $("clave-cuerpo").addEventListener("click", ev => {
    const b = ev.target.closest(".clave-opcion"); if (!b) return;
    ruta.push({ paso: +b.dataset.paso, eleccion: b.dataset.k });
    ir(PASOS[b.dataset.paso][b.dataset.k]);
    $("clave").scrollIntoView({ block: "nearest" });
  });
  $("clave-ruta").addEventListener("click", ev => { const b = ev.target.closest("[data-volver]"); if (b) volverA(+b.dataset.volver); });
  $("clave-atras").addEventListener("click", () => ruta.length && volverA(ruta.length - 1));
  $("clave-reiniciar").addEventListener("click", reiniciar);
  reiniciar();
})();
