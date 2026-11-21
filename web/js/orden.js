/* Juego bachillerato: ¿De qué orden soy?
   Muestra la foto de un insecto del álbum (especies.js) y cuatro órdenes posibles.
   Al responder, explica el rasgo que distingue a ese orden. */
(function () {
  const raiz = document.getElementById("orden");
  if (!raiz || !window.ESPECIES || !window.LEYENDA) return;

  const RONDAS = 10;
  const RASGOS = {
    Hymenoptera:  "Dos pares de alas membranosas que vuelan unidas gracias a unos ganchitos (hamuli). Muchas tienen una «cintura» delgada entre el tórax y el abdomen.",
    Lepidoptera:  "Alas cubiertas de escamas diminutas, como polvo de colores, y una boca en forma de trompa enrollada (espiritrompa).",
    Coleoptera:   "El primer par de alas es duro (élitros) y forma un estuche que protege las alas membranosas, plegadas debajo.",
    Orthoptera:   "Patas traseras grandes y musculosas para saltar, y alas delanteras con textura de cuero (tegminas).",
    Hemiptera:    "Boca en forma de pico chupador (rostro) con el que perforan plantas o presas para succionar jugos.",
    Thysanoptera: "Diminutos, con alas en forma de pluma: una tira angosta rodeada de flecos de pelos.",
    Neuroptera:   "Cuatro alas transparentes con una red densa de venas, que pliegan como un techo sobre el cuerpo.",
    Diptera:      "Un solo par de alas para volar. El segundo par se transformó en halterios, unas pequeñas «pesas» que les dan equilibrio.",
    Odonata:      "Ojos enormes, antenas muy cortas y cuatro alas largas que mueven de forma independiente.",
    Siphonaptera: "Sin alas, con el cuerpo aplanado de lado para moverse entre el pelo y patas traseras de gran salto.",
    Phthiraptera: "Sin alas, con el cuerpo aplanado de arriba abajo y patas con garras para sujetarse al pelo.",
    Dermaptera:   "Pinzas (cercos) en la punta del abdomen y alas delanteras muy cortas.",
    Zygentoma:    "Sin alas, con el cuerpo cubierto de escamas plateadas y tres filamentos largos al final del abdomen."
  };
  const ORDENES = Object.keys(LEYENDA.ordenes).filter(o => RASGOS[o]);
  const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let rondas, ronda, aciertos, respondido;

  raiz.innerHTML = `
    <span class="etiqueta">Bachillerato · Juego 02 · ¿De qué orden soy?</span>
    <div class="marcador" data-marcador aria-hidden="true"></div>
    <p class="pregunta" data-pregunta></p>
    <figure class="foto-especie orden-foto" data-figura><img data-foto alt=""></figure>
    <div class="opciones orden-opciones" data-opciones></div>
    <p class="explicacion" data-explicacion aria-live="polite"></p>
    <button type="button" class="btn oscuro" data-siguiente hidden>Siguiente →</button>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);

  // Rondas variadas: como máximo dos insectos del mismo orden
  function elegirRondas() {
    const cuenta = {}, lista = [];
    for (const e of mezclar(ESPECIES)) {
      if (!RASGOS[e.orden] || (cuenta[e.orden] || 0) >= 2) continue;
      cuenta[e.orden] = (cuenta[e.orden] || 0) + 1;
      lista.push(e);
      if (lista.length === RONDAS) break;
    }
    return lista;
  }

  function mostrar() {
    const e = rondas[ronda];
    respondido = false;
    $("pregunta").textContent = `Insecto ${ronda + 1} de ${rondas.length}: ¿a qué orden pertenezco?`;
    $("figura").hidden = false;
    $("foto").src = encodeURI(e.foto);
    $("foto").alt = "Fotografía de un insecto del álbum. Su nombre se revela al responder.";
    const opciones = mezclar([e.orden, ...mezclar(ORDENES.filter(o => o !== e.orden)).slice(0, 3)]);
    $("opciones").innerHTML = opciones.map(o =>
      `<button type="button" class="btn" data-o="${o}">${o}</button>`).join("");
    $("explicacion").textContent = "";
    $("siguiente").hidden = true;
  }

  function responder(o) {
    if (respondido) return;
    respondido = true;
    const e = rondas[ronda], ok = o === e.orden;
    if (ok) aciertos++;
    $("marcador").children[ronda].className = ok ? "ok" : "mal";
    $("opciones").querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (b.dataset.o === e.orden) b.classList.add("correcta");
      else if (b.dataset.o === o) b.classList.add("incorrecta");
    });
    $("foto").alt = `${e.nombre} (${e.cientifico})`;
    $("explicacion").innerHTML = `<strong>${ok ? "¡Correcto!" : "No es ese."}</strong>
      Soy <strong>${e.nombre}</strong> (<em>${e.cientifico}</em>), del orden <strong>${e.orden}</strong>.
      <span class="orden-rasgo">${RASGOS[e.orden]}</span>
      <a href="entomofauna.html#${slug(e.cientifico)}">Ver mi lámina en el álbum →</a>`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = ronda < rondas.length - 1 ? "Siguiente →" : "Ver resultado";
  }

  function final() {
    $("pregunta").textContent = `Identificaste ${aciertos} de ${rondas.length} insectos`;
    $("figura").hidden = true;
    $("opciones").innerHTML = "";
    $("explicacion").innerHTML = (aciertos >= 8 ? "¡Tienes ojo de entomólogo! " : aciertos >= 5 ? "¡Buen trabajo! " : "¡Sigue practicando! ") +
      `Para reconocer un orden fíjate en las alas (cuántas son y de qué están hechas), la forma de la boca y las patas.
      Si dudas, la <a href="clave.html">clave dicotómica</a> te lleva paso a paso.`;
    $("siguiente").textContent = "Jugar de nuevo";
  }

  function iniciar() {
    rondas = elegirRondas(); ronda = 0; aciertos = 0;
    $("marcador").innerHTML = rondas.map(() => "<span></span>").join("");
    mostrar();
  }

  $("opciones").addEventListener("click", ev => { const b = ev.target.closest("button"); if (b && !b.disabled) responder(b.dataset.o); });
  $("siguiente").addEventListener("click", () => {
    if (ronda >= rondas.length) return iniciar();
    ronda++;
    if (ronda < rondas.length) mostrar(); else final();
  });
  iniciar();
})();
