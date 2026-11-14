/* Encabezado y pie compartidos por todas las páginas.
   Para añadir o renombrar una sección, edita solo el arreglo PAGINAS. */
(function () {
  const PAGINAS = [
    { href: "index.html", texto: "Inicio" },
    { href: "entomofauna.html", texto: "Entomofauna bogotana" },
    { href: "herramientas.html", texto: "Herramientas" },
    { href: "juegos.html", texto: "Juegos" },
    { href: "portafolio.html", texto: "Portafolio" },
    { href: "tienda.html", texto: "Tienda" }
  ];

  const actual = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const logo = `
    <svg viewBox="0 0 40 46" aria-hidden="true">
      <defs><clipPath id="hx"><path d="M20 1 39 12v22L20 45 1 34V12z"/></clipPath></defs>
      <g clip-path="url(#hx)">
        <rect width="40" height="46" fill="#f2a900"/>
        <rect y="15" width="40" height="6" fill="#1d1712"/>
        <rect y="27" width="40" height="6" fill="#1d1712"/>
      </g>
      <path d="M20 1 39 12v22L20 45 1 34V12z" fill="none" stroke="#ffd23f" stroke-width="1.5"/>
    </svg>`;

  const enlaces = PAGINAS.map(p =>
    `<a href="${p.href}"${p.href === actual ? ' aria-current="page"' : ""}>${p.texto}</a>`
  ).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="wrap">
      <a class="marca" href="index.html">${logo}<div><strong>Hexápoda</strong><span>Entomología para todos</span></div></a>
      <button class="menu-btn" aria-expanded="false" aria-controls="nav-principal">Menú</button>
      <nav class="nav" id="nav-principal" aria-label="Principal">${enlaces}</nav>
      <button class="tema-btn" title="Cambiar tema claro/oscuro" aria-label="Cambiar tema claro u oscuro">◐</button>
    </div>
    <div class="franja"></div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <div>
        <strong style="font-family:var(--font-title);font-size:1.3rem;color:#fff7e3">Hexápoda</strong>
        <p>Un recurso didáctico para aprender biología a través de los insectos, hecho en Bogotá por Nicolás Ayala Tovar: docente, entomólogo y analista de datos.</p>
      </div>
      <div><strong style="color:#fff7e3">Secciones</strong><ul>${PAGINAS.map(p => `<li><a href="${p.href}">${p.texto}</a></li>`).join("")}</ul></div>
      <div><strong style="color:#fff7e3">En la red</strong><ul>
        <li><a href="https://github.com/NicolasAyalaTovar" target="_blank" rel="noopener">GitHub</a></li>
      </ul></div>
      <p class="legal">© ${new Date().getFullYear()} Nicolás Ayala Tovar. Contenido educativo de libre consulta.</p>
    </div>`;
  document.body.append(footer);

  // Menú móvil
  const btn = header.querySelector(".menu-btn");
  const nav = header.querySelector(".nav");
  btn.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", abierto);
  });

  // Tema claro / oscuro (se recuerda en este navegador)
  const raiz = document.documentElement;
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (e) {}
  header.querySelector(".tema-btn").addEventListener("click", () => {
    const oscuroAhora = raiz.dataset.theme
      ? raiz.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    raiz.dataset.theme = oscuroAhora ? "light" : "dark";
    try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) {}
  });
})();
