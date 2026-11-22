/* =========================================================
   Importador común de datos para las herramientas.
   Dos opciones: pegar datos o subir un archivo .csv,
   más una guía con un ejemplo de cómo organizar la tabla.

   Uso:
     Importador.crear(elemento, {
       id: "bio",                       // prefijo único
       columnas: [{ nombre, desc }],    // explicación de cada columna
       ejemplo: [["especie","n"], ...], // primera fila = encabezado
       archivo: "ejemplo.csv",          // nombre del CSV de ejemplo
       notas: "texto opcional",
       alLeer: tabla => {...}           // recibe { encabezado, filas }
     });
   ========================================================= */
window.Importador = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* Convierte un texto en número aceptando coma o punto decimal: "5,2" → 5.2 */
  function numero(s) {
    if (s === undefined || s === null) return NaN;
    const t = String(s).trim().replace(/\s/g, "");
    if (t === "") return NaN;
    return Number(t.includes(",") && !t.includes(".") ? t.replace(",", ".") : t.replace(/,/g, ""));
  }

  /* Separa una línea respetando comillas: a,"b,c",d → [a, "b,c", d] */
  function partir(linea, sep) {
    const out = []; let campo = "", comillas = false;
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (comillas) {
        if (c === '"' && linea[i + 1] === '"') { campo += '"'; i++; }
        else if (c === '"') comillas = false;
        else campo += c;
      } else if (c === '"') comillas = true;
      else if (c === sep) { out.push(campo.trim()); campo = ""; }
      else campo += c;
    }
    out.push(campo.trim());
    return out;
  }

  /* Lee texto CSV / TSV / punto y coma. Detecta el separador automáticamente.
     Si la primera fila no tiene números (salvo la primera columna), es el encabezado. */
  function leer(texto) {
    const lineas = String(texto).replace(/^﻿/, "").split(/\r?\n/).filter(l => l.trim() !== "");
    if (!lineas.length) return { encabezado: null, filas: [] };
    const primera = lineas[0];
    const sep = primera.includes("\t") ? "\t" : (primera.split(";").length > primera.split(",").length ? ";" : ",");
    const filas = lineas.map(l => partir(l, sep));
    const esEncabezado = filas[0].slice(1).every(c => isNaN(numero(c)));
    const encabezado = esEncabezado ? filas.shift() : null;
    return { encabezado, filas, sep };
  }

  function aCSV(tabla) {
    return tabla.map(f => f.map(c => /[",;\n]/.test(c) ? `"${String(c).replace(/"/g, '""')}"` : c).join(",")).join("\n");
  }

  function descargar(nombre, texto) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" }));
    a.download = nombre; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function crear(raiz, cfg) {
    const id = cfg.id;
    const tablaEj = cfg.ejemplo;
    raiz.classList.add("importador");
    raiz.innerHTML = `
      <div class="pestanas" role="tablist" aria-label="Forma de cargar los datos">
        <button class="pestana" role="tab" id="${id}-tab-pegar" aria-controls="${id}-pegar" aria-selected="true">📋 Pegar datos</button>
        <button class="pestana" role="tab" id="${id}-tab-csv" aria-controls="${id}-csv" aria-selected="false">📁 Subir archivo .csv</button>
      </div>

      <div class="panel" role="tabpanel" id="${id}-pegar" aria-labelledby="${id}-tab-pegar">
        <label for="${id}-texto" class="small">Copia las celdas en Excel, Google Sheets o LibreOffice (incluido el encabezado) y pégalas aquí:</label>
        <textarea id="${id}-texto" rows="6" spellcheck="false" placeholder="${esc(tablaEj.slice(0, 3).map(f => f.join("\t")).join("\n"))}"></textarea>
        <button class="btn chico" data-accion="usar">Calcular con estos datos</button>
      </div>

      <div class="panel" role="tabpanel" id="${id}-csv" aria-labelledby="${id}-tab-csv" hidden>
        <label class="zona-archivo" for="${id}-archivo">
          <span class="hex-icon">📁</span>
          <span><strong>Elige un archivo .csv</strong> o arrástralo aquí<br>
          <span class="small muted">Separado por comas, punto y coma o tabulaciones.</span></span>
          <input type="file" id="${id}-archivo" accept=".csv,.txt,.tsv,text/csv" class="sr-only">
        </label>
        <p class="small muted" data-nombre></p>
      </div>

      <p class="estado small" data-estado role="status"></p>

      <details class="guia">
        <summary>¿Cómo deben ir organizados los datos?</summary>
        <ul class="small">
          ${cfg.columnas.map(c => `<li><code>${esc(c.nombre)}</code>: ${c.desc}</li>`).join("")}
          <li>La <strong>primera fila</strong> es el encabezado; cada fila siguiente es una especie.</li>
          <li>Puedes usar punto o coma decimal (<code>5.2</code> o <code>5,2</code>).</li>
          ${cfg.notas ? `<li>${cfg.notas}</li>` : ""}
        </ul>
        <p class="small"><strong>Ejemplo</strong> (${esc(cfg.archivo)}):</p>
        <div class="tabla-wrap ejemplo">
          <table>
            <thead><tr>${tablaEj[0].map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
            <tbody>${tablaEj.slice(1).map(f => `<tr>${f.map((c, j) => `<td${j ? ' class="num"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
        <pre class="csv-crudo small" aria-label="El mismo ejemplo como texto CSV">${esc(aCSV(tablaEj))}</pre>
        <div class="acciones-tabla">
          <button class="btn chico oscuro" data-accion="bajar-ejemplo">Descargar ejemplo .csv</button>
          <button class="btn chico oscuro" data-accion="usar-ejemplo">Usar el ejemplo</button>
        </div>
      </details>`;

    const $ = sel => raiz.querySelector(sel);
    const estado = $("[data-estado]");
    const avisar = (msg, ok) => { estado.textContent = msg; estado.className = "estado small " + (ok ? "ok" : "error"); };

    function procesar(texto, origen) {
      const tabla = leer(texto);
      if (!tabla.filas.length) return avisar("No encontré datos. Revisa que el texto o el archivo tengan filas.", false);
      try {
        const msg = cfg.alLeer(tabla);
        avisar(`✔ ${origen}: ${msg}`, true);
      } catch (e) {
        avisar("⚠ " + e.message, false);
      }
    }

    // Pestañas
    raiz.querySelectorAll(".pestana").forEach(b => b.addEventListener("click", () => {
      raiz.querySelectorAll(".pestana").forEach(x => {
        const activo = x === b;
        x.setAttribute("aria-selected", activo);
        document.getElementById(x.getAttribute("aria-controls")).hidden = !activo;
      });
    }));

    // Acciones
    function alClic(ev) {
      const a = ev.target.closest("[data-accion]"); if (!a) return;
      if (a.dataset.accion === "usar") procesar($(`#${id}-texto`).value, "Datos pegados");
      if (a.dataset.accion === "usar-ejemplo") {
        $(`#${id}-texto`).value = tablaEj.map(f => f.join("\t")).join("\n");
        $(`#${id}-tab-pegar`).click();
        procesar(aCSV(tablaEj), "Ejemplo");
      }
      if (a.dataset.accion === "bajar-ejemplo") descargar(cfg.archivo, aCSV(tablaEj));
    }
    raiz.addEventListener("click", alClic);

    // Opcional: mostrar la guía de formato en otro lugar de la página (cfg.guia)
    if (cfg.guia) {
      const guia = raiz.querySelector("details.guia");
      cfg.guia.append(guia);
      guia.addEventListener("click", alClic);
    }

    // Archivo: seleccionar o arrastrar
    const input = $(`#${id}-archivo`), zona = $(".zona-archivo");
    function leerArchivo(f) {
      if (!f) return;
      $("[data-nombre]").textContent = "Archivo: " + f.name;
      f.text().then(t => procesar(t, f.name));
    }
    input.addEventListener("change", () => { leerArchivo(input.files[0]); input.value = ""; });
    zona.addEventListener("dragover", e => { e.preventDefault(); zona.classList.add("encima"); });
    zona.addEventListener("dragleave", () => zona.classList.remove("encima"));
    zona.addEventListener("drop", e => { e.preventDefault(); zona.classList.remove("encima"); leerArchivo(e.dataTransfer.files[0]); });
  }

  return { crear, leer, numero, aCSV, descargar };
})();
