/* Juego 02 (primaria): Arma el ciclo de vida de una mariposa (holometábolo).
   Toca una etapa para ponerla en el siguiente espacio vacío del ciclo;
   toca un espacio lleno para devolver la etapa. */
(function () {
  const raiz = document.getElementById("ciclo");
  if (!raiz) return;

  const CRISALIDA = `<svg viewBox="0 0 40 60" aria-hidden="true"><path d="M20 1v9" stroke="#6b4f2a" stroke-width="2.5"/>
    <path d="M20 9c9 4 12 16 9 28-2 9-6 16-9 21-3-5-7-12-9-21-3-12 0-24 9-28z" fill="#7cb85a" stroke="#2f5f22" stroke-width="2"/>
    <path d="M13 24c4 2 10 2 14 0M12 32c5 2 11 2 16 0M14 40c4 2 8 2 12 0" stroke="#2f5f22" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="17" r="2.2" fill="#ffd23f"/></svg>`;

  // En orden correcto: cada etapa lleva a la siguiente y la última vuelve a la primera
  const ETAPAS = [
    { id: "huevo", nombre: "Huevo", dibujo: "🥚", por: "La mariposa pone sus huevos en la planta que comerá su oruga." },
    { id: "oruga", nombre: "Oruga (larva)", dibujo: "🐛", por: "Sale del huevo y come hojas sin parar. Cambia de piel varias veces mientras crece." },
    { id: "crisalida", nombre: "Crisálida (pupa)", dibujo: CRISALIDA, por: "La oruga se cuelga y forma una cubierta dura. Adentro, todo su cuerpo se transforma." },
    { id: "mariposa", nombre: "Mariposa (adulto)", dibujo: "🦋", por: "Sale con alas, toma néctar de las flores y pone nuevos huevos. ¡El ciclo vuelve a empezar!" }
  ];
  const N = ETAPAS.length;
  const porId = id => ETAPAS.find(e => e.id === id);
  const siguiente = id => ETAPAS[(ETAPAS.findIndex(e => e.id === id) + 1) % N].id;

  raiz.innerHTML = `
    <span class="etiqueta">Primaria · Juego 02 · Arma el ciclo de vida</span>
    <p class="pregunta">¿En qué orden se transforma una mariposa?</p>
    <p class="muted small ciclo-instruccion">Toca cada etapa para ponerla en el ciclo, siguiendo las flechas. Si te equivocas, toca la etapa en el ciclo para devolverla.</p>
    <div class="ciclo-rueda" aria-label="Ciclo de vida">
      ${Array.from({ length: N }, (_, i) => `<button type="button" class="ciclo-hueco" data-pos="${i}" aria-label="Espacio ${i + 1} del ciclo, vacío"><span class="ciclo-n">${i + 1}</span></button>`).join("")}
      <div class="ciclo-centro" aria-hidden="true">↻</div>
    </div>
    <div class="ciclo-piezas" aria-label="Etapas para ubicar"></div>
    <p class="explicacion" aria-live="polite"></p>
    <div class="acciones-tabla ciclo-acciones">
      <button type="button" class="btn" data-accion="comprobar" disabled>Comprobar</button>
      <button type="button" class="btn oscuro" data-accion="reiniciar">Mezclar de nuevo</button>
    </div>`;

  const huecos = [...raiz.querySelectorAll(".ciclo-hueco")];
  const piezas = raiz.querySelector(".ciclo-piezas");
  const explicacion = raiz.querySelector(".explicacion");
  const btnComprobar = raiz.querySelector("[data-accion=comprobar]");
  let puestos, terminado, mezcla;

  function pintar() {
    huecos.forEach((h, i) => {
      const e = puestos[i] && porId(puestos[i]);
      h.className = "ciclo-hueco" + (e ? " lleno" : "");
      h.innerHTML = `<span class="ciclo-n">${i + 1}</span>` + (e ? `<span class="ciclo-dibujo">${e.dibujo}</span><span class="ciclo-nombre">${e.nombre}</span>` : "");
      h.setAttribute("aria-label", `Espacio ${i + 1} del ciclo, ${e ? e.nombre + ". Toca para quitar" : "vacío"}`);
      h.disabled = terminado;
    });
    const libres = mezcla.filter(id => !puestos.includes(id)).map(porId);
    piezas.innerHTML = libres.map(e => `<button type="button" class="ciclo-pieza" data-id="${e.id}">
        <span class="ciclo-dibujo">${e.dibujo}</span><span class="ciclo-nombre">${e.nombre}</span></button>`).join("");
    piezas.hidden = !libres.length;
    btnComprobar.disabled = terminado || puestos.some(p => !p);
  }

  function reiniciar() {
    puestos = Array(N).fill(null); terminado = false;
    // Mezclar las piezas sin que queden ya en un orden correcto del ciclo
    const correcto = m => m.every((id, i) => i === N - 1 || siguiente(id) === m[i + 1]);
    do { mezcla = ETAPAS.map(e => e.id).sort(() => Math.random() - .5); } while (correcto(mezcla));
    explicacion.textContent = "";
    pintar();
  }

  piezas.addEventListener("click", ev => {
    const b = ev.target.closest(".ciclo-pieza"); if (!b) return;
    const libre = puestos.indexOf(null); if (libre < 0) return;
    puestos[libre] = b.dataset.id; explicacion.textContent = ""; pintar();
  });
  huecos.forEach((h, i) => h.addEventListener("click", () => {
    if (terminado || !puestos[i]) return;
    puestos[i] = null; explicacion.textContent = ""; pintar();
  }));

  btnComprobar.addEventListener("click", () => {
    // Es un ciclo: vale empezar en cualquier etapa, siempre que cada una lleve a la que sigue
    const fallo = puestos.findIndex((id, i) => siguiente(id) !== puestos[(i + 1) % N]);
    if (fallo < 0) {
      terminado = true; pintar();
      huecos.forEach(h => h.classList.add("correcta"));
      explicacion.innerHTML = `<strong>¡Muy bien!</strong> Así es la <strong>metamorfosis completa</strong>. Los insectos que la tienen se llaman <em>holometábolos</em>.
        <ol class="ciclo-resumen">${ETAPAS.map(e => `<li><strong>${e.nombre}:</strong> ${e.por}</li>`).join("")}</ol>`;
    } else {
      const a = porId(puestos[fallo]);
      huecos[fallo].classList.add("incorrecta"); huecos[(fallo + 1) % N].classList.add("incorrecta");
      explicacion.innerHTML = `<strong>¡Casi!</strong> Revisa qué viene después de <strong>${a.nombre.toLowerCase()}</strong>. Pista: ${a.por}`;
    }
  });
  raiz.querySelector("[data-accion=reiniciar]").addEventListener("click", reiniciar);
  reiniciar();
})();
