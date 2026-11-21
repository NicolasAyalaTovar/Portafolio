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
         b: { t: "Vida libre. Antenas dobladas como un codo y cintura muy estrecha entre el tórax y el abdomen.", orden: "Hymenoptera", ejemplo: "Pheidole sp." } },
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
    Hymenoptera:  { comun: "Abejas, avispas y hormigas", raiz: "hymen (membrana) + pteron (ala)", sig: "alas membranosas",
      ejemplo: "Bombus atratus",
      nota: "Dos pares de alas membranosas; las traseras son más pequeñas y se enganchan a las delanteras con una fila de ganchitos llamados <em>hamuli</em>, de modo que ambas baten como una sola. En avispas, abejas y hormigas el primer segmento del abdomen está fusionado al tórax (propodeo) y le sigue una cintura estrecha o pecíolo; las avispas sierra, como la del sauce, no la tienen. Piezas bucales masticadoras, que en las abejas se combinan con una lengua para lamer néctar. En muchas hembras el ovipositor se transformó en aguijón. Metamorfosis completa." },
    Lepidoptera:  { comun: "Mariposas y polillas", raiz: "lepis (escama) + pteron (ala)", sig: "alas con escamas",
      ejemplo: "Vanessa carye",
      nota: "Alas, y casi todo el cuerpo, cubiertas de escamas: pelos aplanados que forman los colores y se desprenden como polvo. La boca es una espiritrompa, un tubo formado por dos piezas (las gáleas) que se enrolla en espiral bajo la cabeza cuando no está en uso. Las mariposas diurnas tienen antenas terminadas en maza; muchas polillas las tienen plumosas o filiformes. Sus larvas, las orugas, tienen falsas patas en el abdomen. Metamorfosis completa." },
    Coleoptera:   { comun: "Escarabajos", raiz: "koleos (estuche) + pteron (ala)", sig: "alas en estuche",
      ejemplo: "Cycloneda sanguinea",
      nota: "Las alas delanteras se endurecieron en élitros, que no sirven para volar: protegen el cuerpo y se juntan en una línea recta a lo largo de la espalda (sutura). Las alas traseras, membranosas, se pliegan a lo largo y a lo ancho para caber bajo los élitros, siguiendo líneas de plegado de la venación; en algunos grupos se reconoce una celda oblonga (<em>oblongum</em>). Protórax grande y móvil, y piezas bucales masticadoras. Es el orden con más especies descritas. Metamorfosis completa." },
    Orthoptera:   { comun: "Saltamontes, grillos y esperanzas", raiz: "orthos (recto) + pteron (ala)", sig: "alas rectas",
      ejemplo: "Agesander ruficornis",
      nota: "Patas traseras saltadoras, con el fémur muy engrosado por los músculos del salto. Las alas delanteras son tegminas: alargadas, coriáceas y más angostas que las traseras, que se pliegan en abanico debajo. Pronoto grande en forma de silla de montar y piezas bucales masticadoras. Muchos producen sonido frotando partes del cuerpo (estridulación) y lo escuchan con tímpanos: en el abdomen en los saltamontes y en las patas delanteras en grillos y esperanzas. Metamorfosis incompleta." },
    Hemiptera:    { comun: "Chinches, pulgones, chicharritas y escamas", raiz: "hemi (mitad) + pteron (ala)", sig: "media ala",
      ejemplo: "Monalonion velezangeli",
      nota: "Su rasgo clave es la boca: un pico (rostro) formado por el labio, que guarda en su interior cuatro estiletes para perforar y chupar savia o, en algunos, otros animales. En las chinches (Heteroptera) las alas delanteras son hemélitros: duras en la base y membranosas en la punta, y suele verse un escutelo triangular en el dorso. En chicharritas, membrácidos y pulgones las alas son uniformes y se pliegan como un tejado. Metamorfosis incompleta." },
    Thysanoptera: { comun: "Trips", raiz: "thysanos (fleco) + pteron (ala)", sig: "alas con flecos",
      ejemplo: "Heliothrips haemorrhoidalis",
      nota: "Insectos diminutos, de medio a tres milímetros, con alas angostas bordeadas de largos flecos de pelos. Sus piezas bucales son asimétricas: solo tienen desarrollada la mandíbula izquierda, con la que perforan las células de las plantas para sorber su contenido. En la punta de las patas tienen una vesícula que se infla y les ayuda a adherirse. Su desarrollo es intermedio: tienen etapas inactivas parecidas a una pupa." },
    Neuroptera:   { comun: "Crisopas", raiz: "neuron (nervio, vena) + pteron (ala)", sig: "alas con venas",
      ejemplo: "Chrysoperla sp.",
      nota: "Dos pares de alas membranosas de tamaño parecido, con una red densa de venas y muchas venas transversales que se bifurcan en el borde del ala. En reposo las pliegan como un tejado sobre el cuerpo. Antenas largas y, en las crisopas, ojos dorados o verdes metálicos. Los adultos tienen boca masticadora, mientras que las larvas tienen mandíbulas en forma de pinza con un canal para succionar a sus presas. Metamorfosis completa." },
    Diptera:      { comun: "Moscas y zancudos", raiz: "di (dos) + pteron (ala)", sig: "dos alas",
      ejemplo: "Syrphus sp.",
      nota: "Solo usan un par de alas para volar, las del mesotórax. El segundo par se redujo a dos halterios o balancines, pequeños bastoncillos que vibran y funcionan como giróscopos para mantener el equilibrio en vuelo; por eso el mesotórax es muy grande. Las piezas bucales cambian mucho: esponjosas para lamer en la mosca doméstica, en forma de aguja para picar en los zancudos. Metamorfosis completa." },
    Odonata:      { comun: "Libélulas y caballitos del diablo", raiz: "odous, odontos (diente)", sig: "con dientes (por sus fuertes mandíbulas)",
      ejemplo: "Rhionaeschna marchali",
      nota: "Ojos compuestos enormes que ocupan casi toda la cabeza y antenas muy cortas en forma de cerda. Dos pares de alas alargadas con muchas venas, un nodo en el borde delantero y una mancha llamada pterostigma cerca de la punta; no pueden plegarse planas sobre el abdomen. Las patas se dirigen hacia adelante y forman una canasta para atrapar presas en vuelo. Las ninfas acuáticas cazan con un labio extensible llamado máscara. Metamorfosis incompleta." },
    Siphonaptera: { comun: "Pulgas", raiz: "siphon (tubo) + a (sin) + pteron (ala)", sig: "tubo sin alas",
      ejemplo: "Ctenocephalides canis",
      nota: "Insectos sin alas, con el cuerpo aplanado de lado para moverse entre el pelo. Las patas traseras son saltadoras y almacenan energía en una almohadilla elástica de resilina. Muchas tienen peines de espinas (ctenidios) en la cabeza y el tórax que les ayudan a sujetarse. Boca perforadora y chupadora. A diferencia de los piojos, tienen metamorfosis completa: sus larvas viven fuera del hospedero." },
    Phthiraptera: { comun: "Piojos", raiz: "phtheir (piojo) + a (sin) + pteron (ala)", sig: "piojo sin alas",
      ejemplo: "Pediculus humanus",
      nota: "Insectos sin alas y aplanados de arriba abajo, con ojos muy reducidos o ausentes. Cada pata termina en una sola uña grande que se cierra contra una prolongación de la tibia, como una pinza para agarrar pelos o plumas. Pasan toda su vida sobre el hospedero y pegan sus huevos (liendres) a los pelos. Los piojos chupadores, como el humano, tienen piezas bucales en forma de estilete. Metamorfosis incompleta." },
    Dermaptera:   { comun: "Tijeretas", raiz: "derma (piel) + pteron (ala)", sig: "alas de piel o cuero",
      ejemplo: "Forficula auricularia",
      nota: "Al final del abdomen tienen cercos en forma de pinzas, más curvos en los machos, que usan para defenderse y en el cortejo. Las alas delanteras son tegminas muy cortas que dejan el abdomen al descubierto; debajo guardan unas alas traseras semicirculares, plegadas en abanico y luego dobladas varias veces. Cuerpo alargado y aplanado y boca masticadora. Metamorfosis incompleta." },
    Zygentoma:    { comun: "Pececillos de plata", raiz: "zygon (yugo, unión) + entomon (insecto)", sig: "insecto del yugo",
      ejemplo: "Lepisma saccharina",
      nota: "Insectos primitivos que nunca tuvieron alas. Cuerpo aplanado y cubierto de escamas, antenas largas y tres filamentos al final del abdomen: dos cercos a los lados y un filamento central. Su mandíbula se articula con la cabeza en dos puntos, un rasgo que comparten con los insectos alados. No tienen metamorfosis y siguen mudando de piel durante toda su vida adulta." }
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

  function mostrarOrden(o, ejemplo) {
    const d = ORDENES[o], ej = (window.ESPECIES || []).filter(e => e.orden === o);
    const emoji = window.simboloOrden ? simboloOrden(o) : "🐛";
    const foto = ej.find(e => e.cientifico === (ejemplo || d.ejemplo)) || ej[0];
    $("clave-cuerpo").innerHTML = `
      <div class="clave-resultado">
        <span class="hex-icon" aria-hidden="true">${emoji}</span>
        <div>
          <p class="clave-num">Tu insecto pertenece al orden</p>
          <h3>${o}</h3>
          <p><strong>${d.comun}.</strong> Su nombre viene del griego <em>${d.raiz}</em>: “${d.sig}”.</p>
        </div>
      </div>
      ${foto ? `<figure class="clave-foto">
        <div class="foto-especie"><img src="${encodeURI(foto.foto)}" alt="${foto.nombre} (${foto.cientifico}), ejemplo del orden ${o}"></div>
        <figcaption class="small muted">Ejemplo: ${foto.nombre} (<em>${foto.cientifico}</em>)</figcaption>
      </figure>` : ""}
      <div class="nota clave-nota"><strong>Nota.</strong> ${d.nota}</div>
      ${ej.length ? `<p class="small"><strong>En el álbum de Bogotá:</strong> ${ej.map(e =>
        `<a href="entomofauna.html#${slug(e.cientifico)}">${e.nombre}</a>`).join(", ")}.</p>` : ""}
      <button type="button" class="btn" id="clave-otra">Identificar otro insecto</button>`;
    $("clave-otra").addEventListener("click", reiniciar);
    pintarRuta();
  }

  function ir(destino) { destino.orden ? mostrarOrden(destino.orden, destino.ejemplo) : mostrarPaso(destino.ir); }
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
