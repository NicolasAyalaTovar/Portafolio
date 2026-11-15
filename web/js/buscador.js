/* =========================================================
   Buscador del sitio (funciona sin servidor)
   Busca en especies, herramientas, juegos, proyectos, publicaciones
   y productos. Para añadir una entrada fija, edita PAGINAS_BUSCABLES.
   Uso: Buscador.crear(elementoContenedor)
   ========================================================= */
window.Buscador = (function () {
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const PAGINAS_BUSCABLES = [
    { titulo: "Entomofauna bogotana", detalle: "Álbum de insectos de Bogotá", url: "entomofauna.html", tipo: "Página", extra: "especies fichas laminas album" },
    { titulo: "Calculadora de biomasa", detalle: "Herramienta · Rogers et al. (1976)", url: "herramientas.html#biomasa", tipo: "Herramienta", extra: "peso longitud abundancia" },
    { titulo: "Índices de diversidad (números de Hill)", detalle: "Herramienta · riqueza, Shannon, Simpson", url: "herramientas.html#diversidad", tipo: "Herramienta", extra: "q0 q1 q2 diversidad hill shannon simpson riqueza" },
    { titulo: "¿Es un insecto?", detalle: "Juego · nivel primaria", url: "juegos.html#primaria", tipo: "Juego", extra: "niños ninos patas arañas" },
    { titulo: "Juegos para bachillerato", detalle: "Juegos · nivel bachillerato", url: "juegos.html#bachillerato", tipo: "Juego" },
    { titulo: "Juegos para pregrado", detalle: "Juegos · nivel pregrado", url: "juegos.html#pregrado", tipo: "Juego" },
    { titulo: "Hotel para abejas e insectos", detalle: "Proyecto con materiales reutilizables", url: "proyectos.html#hotel-insectos", tipo: "Proyecto", extra: "reciclaje reutilizar escuela colegio polinizadores" },
    { titulo: "Portafolio de Nicolás Ayala Tovar", detalle: "Publicaciones y proyectos", url: "portafolio.html", tipo: "Página", extra: "docente entomologo investigador contacto" },
    { titulo: "Nuevo registro de Glenus vestitus (Staphylinidae)", detalle: "Publicación · Acta Biológica Colombiana", url: "portafolio.html#titulo-publicaciones", tipo: "Publicación" },
    { titulo: "Ojos alienígenas en la Tierra", detalle: "Publicación · visión de los insectos y astrobiología", url: "portafolio.html#titulo-publicaciones", tipo: "Publicación" },
    { titulo: "Dos mundos un mismo escarabajo", detalle: "Divulgación · Oriolus", url: "portafolio.html#titulo-divulgacion", tipo: "Publicación" },
    { titulo: "Origami en la naturaleza", detalle: "Divulgación · escarabajos errantes · Oriolus", url: "portafolio.html#titulo-divulgacion", tipo: "Publicación" },
    { titulo: "Tienda", detalle: "Productos de la colmena", url: "tienda.html", tipo: "Página", extra: "comprar miel" }
  ];

  function indice() {
    const items = [...PAGINAS_BUSCABLES];
    (window.ESPECIES || []).forEach(e => items.push({
      titulo: e.nombre, detalle: `${e.cientifico} · ${e.orden}`, url: "entomofauna.html#" + slug(e.cientifico), tipo: "Especie",
      extra: [e.cientifico, e.familia, e.orden, (window.LEYENDA?.ordenes[e.orden]?.comun) || ""].join(" ")
    }));
    (window.PRODUCTOS || []).forEach(p => items.push({ titulo: p.nombre, detalle: "Tienda", url: "tienda.html", tipo: "Producto", extra: p.descripcion }));
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
        <span class="buscador-ico" aria-hidden="true">🔍</span>
        <input id="q" type="search" autocomplete="off" placeholder="Busca un insecto, una herramienta o un juego…"
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
