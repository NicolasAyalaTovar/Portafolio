/* Números de Hill (diversidad verdadera, valores observados)
   q = 0 → riqueza (S)
   q = 1 → exponencial de Shannon: exp(H'),  H' = −Σ p ln p
   q = 2 → inverso de Simpson: 1 / Σ p²
   Datos: matriz especies (filas) × sitios (columnas) con abundancias. */
(function () {
  const fmt = (x, d = 2) => Number.isFinite(x)
    ? x.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function hill(abundancias) {
    const x = abundancias.filter(a => a > 0);
    const N = x.reduce((a, b) => a + b, 0);
    if (!N) return { N: 0, q0: 0, q1: NaN, q2: NaN, H: NaN, simpson: NaN };
    const p = x.map(a => a / N);
    const H = -p.reduce((s, pi) => s + pi * Math.log(pi), 0);
    const simpson = p.reduce((s, pi) => s + pi * pi, 0);
    return { N, q0: x.length, q1: Math.exp(H), q2: 1 / simpson, H, simpson };
  }

  const EJEMPLO = [
    ["especie", "Humedal", "Parque", "Potrero"],
    ["Bombus atratus", "12", "10", "2"],
    ["Apis mellifera", "10", "45", "60"],
    ["Cycloneda sanguinea", "9", "8", "0"],
    ["Leptophobia aripa", "11", "6", "1"],
    ["Colias dimera", "8", "0", "5"],
    ["Rhionaeschna marchali", "10", "0", "0"],
    ["Harmonia axyridis", "0", "12", "3"]
  ];

  let resultados = [];
  const tbody = document.getElementById("hill-filas");

  function pintar() {
    const max = Math.max(...resultados.map(r => r.q0), 1);
    const barra = (v, cls) => `<div class="barra ${cls}" style="width:${Number.isFinite(v) ? v / max * 100 : 0}%"></div>`;
    tbody.innerHTML = resultados.map(r => `
      <tr>
        <td><strong>${esc(r.sitio)}</strong></td>
        <td class="num">${r.N.toLocaleString("es-CO")}</td>
        <td class="num"><div class="celda-hill">${r.q0}${barra(r.q0, "q0")}</div></td>
        <td class="num"><div class="celda-hill">${fmt(r.q1)}${barra(r.q1, "q1")}</div></td>
        <td class="num"><div class="celda-hill">${fmt(r.q2)}${barra(r.q2, "q2")}</div></td>
        <td class="num">${fmt(r.H, 3)}</td>
        <td class="num">${fmt(r.simpson, 3)}</td>
      </tr>`).join("");
  }

  /* Recibe { encabezado, filas } y calcula los números de Hill por columna (sitio). */
  function calcular({ encabezado, filas }) {
    const nCol = Math.max(...filas.map(f => f.length));
    if (nCol < 2) throw new Error("Se necesitan al menos dos columnas: la especie y uno o más sitios con abundancias.");
    const sitios = [];
    for (let j = 1; j < nCol; j++) sitios.push((encabezado && encabezado[j]) || `Sitio ${j}`);

    const problemas = [];
    const columnas = sitios.map(() => []);
    filas.forEach((f, i) => {
      for (let j = 1; j < nCol; j++) {
        const celda = (f[j] ?? "").trim();
        const v = celda === "" ? 0 : Importador.numero(celda);
        if (!Number.isFinite(v) || v < 0) { problemas.push(`fila ${i + (encabezado ? 2 : 1)}, columna “${sitios[j - 1]}”: “${celda}”`); continue; }
        columnas[j - 1].push(v);
      }
    });
    if (problemas.length) {
      throw new Error(`Hay valores que no son abundancias válidas (deben ser números ≥ 0): ${problemas.slice(0, 3).join("; ")}${problemas.length > 3 ? "…" : ""}`);
    }

    resultados = sitios.map((s, j) => ({ sitio: s, ...hill(columnas[j]) }));
    pintar();
    // Las curvas de rarefacción (rarefaccion.js) usan estos mismos datos
    document.dispatchEvent(new CustomEvent("hill:datos", { detail: sitios.map((s, j) => ({ sitio: s, x: columnas[j] })) }));
    const resumen = `${filas.length} especies × ${sitios.length} ${sitios.length === 1 ? "sitio" : "sitios"}`;
    document.getElementById("hill-resumen").textContent = "Matriz analizada: " + resumen + ".";
    return resumen + " analizados.";
  }

  Importador.crear(document.getElementById("importar-hill"), {
    id: "hill",
    archivo: "ejemplo_diversidad.csv",
    columnas: [
      { nombre: "especie", desc: "primera columna: nombre de la especie o morfoespecie (una por fila)." },
      { nombre: "Sitio 1, Sitio 2, …", desc: "una columna por sitio, muestra o tratamiento, con el <strong>número de individuos</strong> de cada especie. El nombre de la columna será el nombre del sitio." }
    ],
    notas: "Si una especie no se registró en un sitio, escribe 0 o deja la celda vacía. Es el mismo formato de matriz especies × sitios que usa iNEXT en R.",
    ejemplo: EJEMPLO,
    alLeer: calcular
  });

  document.getElementById("hill-descargar").onclick = () => {
    Importador.descargar("numeros_de_hill.csv", Importador.aCSV([
      ["sitio", "N", "q0_riqueza", "q1_exp_shannon", "q2_inverso_simpson", "H_shannon", "simpson_suma_p2"],
      ...resultados.map(r => [r.sitio, r.N, r.q0, r.q1.toFixed(4), r.q2.toFixed(4), r.H.toFixed(4), r.simpson.toFixed(4)])
    ]));
  };

  // Mostrar el ejemplo al cargar la página
  calcular(Importador.leer(Importador.aCSV(EJEMPLO)));
  document.getElementById("hill-resumen").textContent += " (datos de ejemplo)";
})();
