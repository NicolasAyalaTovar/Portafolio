/* Juego 03 (primaria): La ruta del polen.
   La abeja lleva el polen de la última flor que visitó. Una flor queda
   polinizada cuando recibe polen de OTRA flor de su misma especie.
   Meta: polinizar todas las flores con la menor cantidad de vuelos. */
(function () {
  const raiz = document.getElementById("polen");
  if (!raiz) return;

  const TIPOS = {
    girasol: { emoji: "🌻", nombre: "girasol", plural: "girasoles", color: "#f2a900" },
    cayeno:  { emoji: "🌺", nombre: "cayeno", plural: "cayenos", color: "#e0457b" }
  };
  // Posiciones (en % del jardín) donde pueden aparecer las flores
  const SITIOS = [[14, 18], [38, 12], [62, 20], [86, 14], [24, 50], [50, 46], [76, 52], [14, 82], [40, 80], [66, 84], [88, 78]];
  const POR_TIPO = 4;
  const MINIMO = Object.keys(TIPOS).length * (POR_TIPO + 1);   // recorrido perfecto: 10 vuelos
  const COLMENA = [5, 50];

  raiz.innerHTML = `
    <span class="etiqueta">Primaria · Juego 03 · La ruta del polen</span>
    <p class="pregunta">Ayuda a la abeja a polinizar el jardín</p>
    <p class="muted small polen-instruccion">Toca una flor para que la abeja vuele hasta ella. En cada flor toma néctar y se le pega polen.
      Una flor queda <strong>polinizada</strong> cuando la abeja le trae polen de <strong>otra flor de la misma especie</strong>.
      ¡Poliniza todas las flores con la menor cantidad de vuelos!</p>
    <div class="polen-marcador" aria-live="polite">
      <span>Vuelos: <strong data-vuelos>0</strong></span>
      <span>Polinizadas: <strong data-hechas>0</strong> de ${POR_TIPO * Object.keys(TIPOS).length}</span>
      <span>Polen que lleva: <strong data-lleva>ninguno</strong></span>
    </div>
    <div class="polen-jardin" aria-label="Jardín con flores">
      <span class="polen-colmena" style="left:${COLMENA[0]}%;top:${COLMENA[1]}%" aria-hidden="true">🏠</span>
      <span class="polen-abeja" aria-hidden="true"><span class="polen-carga"></span>🐝</span>
    </div>
    <p class="explicacion" aria-live="polite"></p>
    <div class="acciones-tabla polen-acciones">
      <button type="button" class="btn oscuro" data-accion="reiniciar">Jardín nuevo</button>
    </div>`;

  const jardin = raiz.querySelector(".polen-jardin");
  const abeja = raiz.querySelector(".polen-abeja");
  const carga = raiz.querySelector(".polen-carga");
  const explicacion = raiz.querySelector(".explicacion");
  const $m = k => raiz.querySelector(`[data-${k}]`);
  let flores, lleva, vuelos, terminado;

  const moverAbeja = ([x, y]) => { abeja.style.left = x + "%"; abeja.style.top = y + "%"; };
  const pendientes = () => flores.filter(f => !f.polinizada).length;

  function pintarMarcador() {
    $m("vuelos").textContent = vuelos;
    $m("hechas").textContent = flores.length - pendientes();
    $m("lleva").textContent = lleva ? `de ${TIPOS[lleva.tipo].nombre}` : "ninguno";
    carga.style.background = lleva ? TIPOS[lleva.tipo].color : "transparent";
    carga.hidden = !lleva;
  }

  function pintarFlor(f) {
    const t = TIPOS[f.tipo];
    f.el.classList.toggle("polinizada", f.polinizada);
    f.el.setAttribute("aria-label", `${t.nombre} ${f.n}${f.polinizada ? ", polinizada" : ", sin polinizar"}`);
  }

  function nuevoJardin() {
    jardin.querySelectorAll(".polen-flor").forEach(b => b.remove());
    const sitios = [...SITIOS].sort(() => Math.random() - .5);
    flores = [];
    Object.keys(TIPOS).forEach(tipo => {
      for (let n = 1; n <= POR_TIPO; n++) flores.push({ tipo, n, pos: sitios.pop(), polinizada: false });
    });
    flores.forEach((f, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "polen-flor"; b.dataset.i = i;
      b.style.left = f.pos[0] + "%"; b.style.top = f.pos[1] + "%";
      b.innerHTML = `<span class="polen-emoji">${TIPOS[f.tipo].emoji}</span><span class="polen-sello" aria-hidden="true">✓</span>`;
      f.el = b; pintarFlor(f); jardin.append(b);
    });
    lleva = null; vuelos = 0; terminado = false;
    abeja.classList.add("sin-transicion"); moverAbeja(COLMENA);
    requestAnimationFrame(() => abeja.classList.remove("sin-transicion"));
    explicacion.innerHTML = "La abeja sale de la colmena con el cuerpo limpio. ¿A qué flor vas primero?";
    pintarMarcador();
  }

  function visitar(f) {
    if (terminado) return;
    if (lleva && lleva === f) { explicacion.textContent = "La abeja ya está en esta flor. Elige otra."; return; }
    vuelos++;
    moverAbeja(f.pos);
    const t = TIPOS[f.tipo];
    let msg;
    if (!lleva) {
      msg = `Toma néctar del ${t.nombre} y se le pega su polen. Ahora llévalo a otro ${t.nombre}.`;
    } else if (lleva.tipo !== f.tipo) {
      msg = `<strong>¡Ups!</strong> El polen de ${TIPOS[lleva.tipo].nombre} no sirve para un ${t.nombre}: cada flor necesita polen de su misma especie. Ahora la abeja lleva polen de ${t.nombre}.`;
    } else if (f.polinizada) {
      msg = `Este ${t.nombre} ya estaba polinizado, pero la abeja vuelve a cargar su polen.`;
    } else {
      f.polinizada = true; pintarFlor(f);
      msg = `<strong>¡Polinizado!</strong> El polen del ${t.nombre} ${lleva.n} llegó al ${t.nombre} ${f.n}. Ahora esta flor podrá formar semillas.`;
    }
    lleva = f;
    pintarMarcador();
    if (!pendientes()) terminar(); else explicacion.innerHTML = msg;
  }

  function terminar() {
    terminado = true;
    const estrellas = vuelos <= MINIMO ? 3 : vuelos <= MINIMO + 4 ? 2 : 1;
    explicacion.innerHTML = `<strong>¡Jardín polinizado en ${vuelos} vuelos! ${"⭐".repeat(estrellas)}</strong>
      ${estrellas === 3 ? "¡Recorrido perfecto! " : `El recorrido perfecto usa ${MINIMO} vuelos. `}
      Las abejas reales hacen algo parecido: en cada viaje suelen visitar flores de una misma especie. A esto se le llama
      <strong>constancia floral</strong>, y es la razón por la que son tan buenas polinizadoras.`;
  }

  jardin.addEventListener("click", ev => {
    const b = ev.target.closest(".polen-flor"); if (b) visitar(flores[b.dataset.i]);
  });
  raiz.querySelector("[data-accion=reiniciar]").addEventListener("click", nuevoJardin);
  nuevoJardin();
})();
