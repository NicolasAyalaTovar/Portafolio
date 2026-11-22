/* Calculadora de biomasa — traducción a JavaScript de Biomass.R
   b = n × (0.0305 × l^2.62)   (Rogers et al., 1976) */
(function () {
  const biomasa = (n, l) => n * (0.0305 * Math.pow(l, 2.62));
  const fmt = (x, d = 2) => Number.isFinite(x)
    ? x.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- Cálculo rápido ----
  const n1 = document.getElementById("n1"), l1 = document.getElementById("l1"), r1 = document.getElementById("r1");
  function rapido() {
    const n = parseFloat(n1.value), l = parseFloat(l1.value);
    r1.textContent = (n >= 0 && l >= 0) ? fmt(biomasa(n, l)) + " mg" : "—";
  }
  n1.addEventListener("input", rapido); l1.addEventListener("input", rapido); rapido();

  // ---- Tabla de varias especies ----
  const EJEMPLO = [
    { especie: "Species1", n: 10, l: 5.2 },
    { especie: "Species2", n: 15, l: 6.5 },
    { especie: "Species3", n: 8, l: 4.8 },
    { especie: "Species4", n: 20, l: 7.0 }
  ];
  let datos = EJEMPLO.map(d => ({ ...d }));
  const tbody = document.getElementById("filas");

  function pintar() {
    tbody.innerHTML = datos.map((d, i) => `
      <tr data-i="${i}">
        <td><input type="text" data-k="especie" value="${esc(d.especie)}" aria-label="Especie"></td>
        <td class="num"><input type="number" data-k="n" min="0" step="1" value="${d.n}" aria-label="Abundancia"></td>
        <td class="num"><input type="number" data-k="l" min="0" step="0.1" value="${d.l}" aria-label="Longitud en mm"></td>
        <td class="num" data-b></td>
        <td style="min-width:70px"><div class="barra" data-bar></div></td>
        <td><button class="quitar" data-quitar title="Quitar fila" aria-label="Quitar fila">×</button></td>
      </tr>`).join("");
    recalcular();
  }

  function recalcular() {
    const bs = datos.map(d => biomasa(+d.n, +d.l));
    const total = bs.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
    const max = Math.max(...bs.filter(Number.isFinite), 0);
    tbody.querySelectorAll("tr").forEach((tr, i) => {
      tr.querySelector("[data-b]").textContent = fmt(bs[i]);
      const pct = total ? bs[i] / total * 100 : 0;
      const bar = tr.querySelector("[data-bar]");
      bar.style.width = (max ? bs[i] / max * 100 : 0) + "%";
      bar.title = fmt(pct, 1) + " % del total";
    });
    document.getElementById("totN").textContent = datos.reduce((a, d) => a + (+d.n || 0), 0).toLocaleString("es-CO");
    document.getElementById("totB").textContent = fmt(total);
  }

  tbody.addEventListener("input", ev => {
    const k = ev.target.dataset.k; if (!k) return;
    const i = +ev.target.closest("tr").dataset.i;
    datos[i][k] = k === "especie" ? ev.target.value : parseFloat(ev.target.value);
    recalcular();
  });
  tbody.addEventListener("click", ev => {
    if (!ev.target.hasAttribute("data-quitar")) return;
    datos.splice(+ev.target.closest("tr").dataset.i, 1); pintar();
  });
  document.getElementById("agregar").onclick = () => { datos.push({ especie: "Especie" + (datos.length + 1), n: 1, l: 1 }); pintar(); };
  document.getElementById("ejemplo").onclick = () => { datos = EJEMPLO.map(d => ({ ...d })); pintar(); };

  // ---- Importar: pegar datos o subir .csv ----
  Importador.crear(document.getElementById("importar-biomasa"), {
    id: "bio",
    guia: document.getElementById("guia-biomasa"),   // la guía de formato va debajo de "¿Cómo funciona?"
    archivo: "ejemplo_biomasa.csv",
    columnas: [
      { nombre: "especie", desc: "nombre de la especie o morfoespecie." },
      { nombre: "n", desc: "abundancia: número de individuos (entero ≥ 0)." },
      { nombre: "l", desc: "longitud corporal promedio en <strong>milímetros</strong>." }
    ],
    ejemplo: [
      ["especie", "n", "l"],
      ["Bombus atratus", "10", "18.5"],
      ["Apis mellifera", "15", "12.0"],
      ["Cycloneda sanguinea", "8", "4.8"],
      ["Leptophobia aripa", "20", "21.0"]
    ],
    alLeer({ filas }) {
      const N = Importador.numero;
      const nuevos = [], malas = [];
      filas.forEach((f, i) => {
        const d = { especie: f[0], n: N(f[1]), l: N(f[2]) };
        if (f.length >= 3 && d.especie && d.n >= 0 && d.l >= 0) nuevos.push(d); else malas.push(i + 2);
      });
      if (!nuevos.length) throw new Error("No encontré filas válidas. Se necesitan tres columnas: especie, n y l.");
      datos = nuevos; pintar();
      return `${nuevos.length} especies cargadas` +
        (malas.length
          ? `. Se ${malas.length === 1 ? "omitió 1 fila" : `omitieron ${malas.length} filas`} con datos incompletos (fila ${malas.slice(0, 5).join(", ")}${malas.length > 5 ? "…" : ""}).`
          : ".");
    }
  });

  // ---- Exportar ----
  document.getElementById("descargar").onclick = () => {
    Importador.descargar("biomasa_resultados.csv", Importador.aCSV([
      ["especie", "n", "l_mm", "biomasa_mg"],
      ...datos.map(d => [d.especie, d.n, d.l, biomasa(+d.n, +d.l).toFixed(4)])
    ]));
  };

  pintar();
})();
