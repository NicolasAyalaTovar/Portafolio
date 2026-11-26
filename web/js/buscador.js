/* =========================================================
   Buscador del sitio (funciona sin servidor)
   Busca en especies, herramientas, juegos, proyectos, publicaciones
   y productos. Para añadir una entrada fija, edita PAGINAS_BUSCABLES.
   Lo crea layout.js en el encabezado de todas las páginas.
   ========================================================= */
window.Buscador = (function () {
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const PAGINAS_BUSCABLES = [
    { titulo: "Entomofauna bogotana", detalle: "Álbum de insectos de Bogotá", url: "entomofauna.html", tipo: "Página", extra: "especies fichas laminas album" },
    { titulo: "Calculadora de biomasa", detalle: "Herramienta · Rogers et al. (1976)", url: "herramientas.html#biomasa", tipo: "Herramienta", extra: "peso longitud abundancia" },
    { titulo: "Rarefacción y extrapolación", detalle: "Herramienta · curvas de números de Hill (iNEXT)", url: "herramientas.html#rarefaccion-extrapolacion", tipo: "Herramienta", extra: "rarefaccion extrapolacion inext chao1 cobertura esfuerzo de muestreo" },
    { titulo: "Constructor de redes tróficas", detalle: "Herramienta · dibuja y descarga redes tróficas", url: "herramientas.html#redes-troficas", tipo: "Herramienta", extra: "red trofica cadena alimenticia productores consumidores descomponedores diagrama png jpg" },
    { titulo: "Árboles filogenéticos", detalle: "Herramienta · cladogramas con caracteres morfológicos", url: "herramientas.html#filogenia", tipo: "Herramienta", extra: "arbol filogenetico cladograma parsimonia sinapomorfia caracteres morfologicos matriz filogenia" },
    { titulo: "Calidad del agua", detalle: "Herramienta · ICA-NSF y BMWP/Col", url: "herramientas.html#agua", tipo: "Herramienta", extra: "agua ph oxigeno nitratos fosfatos turbidez bioindicadores macroinvertebrados bmwp ica quebrada rio humedal" },
    { titulo: "Índices de diversidad (números de Hill)", detalle: "Herramienta · riqueza, Shannon, Simpson", url: "herramientas.html#diversidad", tipo: "Herramienta", extra: "q0 q1 q2 diversidad hill shannon simpson riqueza" },
    { titulo: "Clave dicotómica de órdenes", detalle: "Herramienta · identifica el orden de un insecto", url: "clave.html", tipo: "Herramienta", extra: "identificar identificacion ordenes llave" },
    { titulo: "Diccionario de raíces griegas y latinas", detalle: "Etimología de los nombres de los órdenes", url: "clave.html#titulo-diccionario", tipo: "Página", extra: "etimologia griego latin pteron ala" },
    { titulo: "Arma el ciclo de vida", detalle: "Juego · nivel primaria · metamorfosis de la mariposa", url: "juegos.html#ciclo", tipo: "Juego", extra: "huevo oruga larva pupa crisalida mariposa metamorfosis holometabolo" },
    { titulo: "La ruta del polen", detalle: "Juego · nivel primaria · polinización", url: "juegos.html#polen", tipo: "Juego", extra: "abeja flores polinizacion polen nectar constancia floral" },
    { titulo: "¿Es un insecto?", detalle: "Juego · nivel primaria", url: "juegos.html#juego", tipo: "Juego", extra: "niños ninos patas arañas" },
    { titulo: "Juegos para bachillerato", detalle: "Juegos · nivel bachillerato", url: "juegos.html#bachillerato", tipo: "Juego" },
    { titulo: "Detective del humedal", detalle: "Juego · nivel bachillerato · bioindicadores", url: "juegos.html#humedal", tipo: "Juego", extra: "humedal bioindicadores calidad agua macroinvertebrados" },
    { titulo: "La red trófica del humedal", detalle: "Juego · nivel bachillerato · ecosistemas", url: "juegos.html#redes", tipo: "Juego", extra: "red trofica cadena alimenticia cascada trofica eutrofizacion piramide energia ecosistema humedal" },
    { titulo: "El laboratorio de las polillas", detalle: "Juego · nivel bachillerato · evolución", url: "juegos.html#evolucion", tipo: "Juego", extra: "evolucion seleccion natural direccional estabilizadora disruptiva deriva genetica polilla biston" },
    { titulo: "¿De qué orden soy?", detalle: "Juego · nivel bachillerato · órdenes de insectos", url: "juegos.html#orden", tipo: "Juego", extra: "orden identificar coleoptera hymenoptera lepidoptera diptera hemiptera" },
    { titulo: "Jardín vertical reciclado", detalle: "Proyecto · botellas plásticas", url: "proyectos.html#jardin-vertical", tipo: "Proyecto", extra: "jardin vertical botellas reciclaje materas plantas pared huerta" },
    { titulo: "Una compostera", detalle: "Proyecto · compost en caja de madera o canecas", url: "proyectos.html#compostera", tipo: "Proyecto", extra: "compost compostera abono descomponedores lombriz mosca soldado residuos organicos canecas" },
    { titulo: "Científicos de hormigas", detalle: "Juego · nivel bachillerato · método científico", url: "juegos.html#metodo", tipo: "Juego", extra: "metodo cientifico hipotesis variables control replicas experimento hormigas" },
    { titulo: "Un jardín para abejas", detalle: "Proyecto · plantas que atraen polinizadores", url: "proyectos.html#jardin-abejas", tipo: "Proyecto", extra: "plantas flores jardin lavanda salvia borraja falso boldo manzanilla romero tomillo calendula polinizadores" },
    { titulo: "Hotel para abejas e insectos", detalle: "Proyecto con materiales reutilizables", url: "proyectos.html#hotel-insectos", tipo: "Proyecto", extra: "reciclaje reutilizar escuela colegio polinizadores" },
    { titulo: "Portafolio de Nicolás Ayala Tovar", detalle: "Publicaciones y proyectos", url: "portafolio.html", tipo: "Página", extra: "docente entomologo investigador contacto" },
    { titulo: "Nuevo registro de Glenus vestitus (Staphylinidae)", detalle: "Publicación · Acta Biológica Colombiana", url: "portafolio.html#titulo-publicaciones", tipo: "Publicación" },
    { titulo: "Ojos alienígenas en la Tierra", detalle: "Publicación · visión de los insectos y astrobiología", url: "portafolio.html#titulo-publicaciones", tipo: "Publicación" },
    { titulo: "Dos mundos un mismo escarabajo", detalle: "Divulgación · Oriolus", url: "portafolio.html#titulo-divulgacion", tipo: "Publicación" },
    { titulo: "Origami en la naturaleza", detalle: "Divulgación · escarabajos errantes · Oriolus", url: "portafolio.html#titulo-divulgacion", tipo: "Publicación" },
    // { titulo: "Tienda", detalle: "Productos de la colmena", url: "tienda.html", tipo: "Página", extra: "comprar miel" }  (tienda oculta por ahora)
  ];

  function indice() {
    const items = [...PAGINAS_BUSCABLES];
    (window.ESPECIES || []).forEach(e => items.push({
      titulo: e.nombre, detalle: `${e.cientifico} · ${e.orden}`, url: "entomofauna.html#" + slug(e.cientifico), tipo: "Especie",
      extra: [e.cientifico, e.familia, e.orden, (window.LEYENDA?.ordenes[e.orden]?.comun) || ""].join(" ")
    }));
    const TIENDA_VISIBLE = false;   // cambia a true cuando la tienda vuelva al menú
    if (TIENDA_VISIBLE) (window.PRODUCTOS || []).forEach(p => items.push({ titulo: p.nombre, detalle: "Tienda", url: "tienda.html", tipo: "Producto", extra: p.descripcion }));
    // Se guarda el texto con espacios al inicio de cada palabra para buscar solo desde el comienzo de las palabras
    const palabrasDe = t => " " + norm(t).replace(/[^a-z0-9]+/g, " ");
    return items.map(it => ({ ...it, _t: palabrasDe(it.titulo), _todo: palabrasDe([it.titulo, it.detalle, it.extra].join(" ")) }));
  }

  function buscar(items, consulta) {
    const palabras = norm(consulta).replace(/[^a-z0-9]+/g, " ").split(" ").filter(Boolean).map(p => " " + p);
    if (!palabras.length) return [];
    return items
      .filter(it => palabras.every(p => it._todo.includes(p)))
      .map(it => ({ it, pts: palabras.reduce((s, p) => s + (it._t.startsWith(p) ? 3 : it._t.includes(p) ? 2 : 1), 0) }))
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 8)
      .map(r => r.it);
  }

  function crear(raiz) {
    const items = indice();
    raiz.classList.add("buscador");
    raiz.innerHTML = `
      <form role="search" onsubmit="return false">
        <label for="q" class="sr-only">Buscar en La Colmena</label>
        <input id="q" type="search" autocomplete="off" placeholder="Buscar en La Colmena…"
               role="combobox" aria-expanded="false" aria-controls="q-resultados" aria-autocomplete="list">
      </form>
      <ul class="buscador-resultados" id="q-resultados" role="listbox" hidden></ul>`;
    const input = raiz.querySelector("input"), lista = raiz.querySelector("ul");
    let activo = -1;

    function pintar() {
      const res = buscar(items, input.value);
      activo = -1;
      if (!input.value.trim()) { lista.hidden = true; input.setAttribute("aria-expanded", "false"); return; }
      lista.innerHTML = res.length
        ? res.map((r, i) => `<li role="option" id="q-op-${i}"><a href="${r.url}"><span class="buscador-tipo">${r.tipo}</span><strong>${esc(r.titulo)}</strong><span class="small muted">${esc(r.detalle)}</span></a></li>`).join("")
        : `<li class="buscador-vacio">No encontramos resultados para “${esc(input.value)}”.</li>`;
      lista.hidden = false; input.setAttribute("aria-expanded", "true");
    }
    function mover(d) {
      const ops = lista.querySelectorAll("[role=option]"); if (!ops.length) return;
      activo = (activo + d + ops.length) % ops.length;
      ops.forEach((o, i) => o.classList.toggle("activo", i === activo));
      input.setAttribute("aria-activedescendant", ops[activo].id);
    }
    input.addEventListener("input", pintar);
    input.addEventListener("keydown", ev => {
      if (ev.key === "ArrowDown") { ev.preventDefault(); mover(1); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); mover(-1); }
      else if (ev.key === "Enter") {
        const op = lista.querySelectorAll("[role=option] a")[activo < 0 ? 0 : activo];
        if (op) location.href = op.href;
      } else if (ev.key === "Escape") { input.value = ""; pintar(); }
    });
    document.addEventListener("click", ev => { if (!raiz.contains(ev.target)) { lista.hidden = true; input.setAttribute("aria-expanded", "false"); } });
    input.addEventListener("focus", () => { if (input.value.trim()) pintar(); });
  }

  return { crear };
})();
