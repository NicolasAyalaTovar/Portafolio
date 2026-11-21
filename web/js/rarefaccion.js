/* Rarefacción y extrapolación con números de Hill (datos de abundancia), según
   Chao et al. (2014), Ecological Monographs 84: 45–67. Es la misma propuesta que
   implementa el paquete iNEXT de R (Hsieh, Ma y Chao, 2016), sin intervalos de confianza.

   Usa los datos de la herramienta de diversidad: escucha el evento "hill:datos"
   que envía diversidad.js con [{ sitio, x: [abundancias] }, …].

   Interpolación (m < n):
     q0: S(m) = Σ [1 − C(n−Xi, m) / C(n, m)]
     q1: exp(−Σk (k/m) ln(k/m) fk(m)),  fk(m) = Σi C(Xi,k) C(n−Xi, m−k) / C(n, m)
     q2: 1 / [1/m + (1 − 1/m) Σ Xi(Xi−1) / (n(n−1))]
   Extrapolación (m = n + m*):
     q0: Sobs + f̂0 [1 − (1 − f1 / (n f̂0 + f1))^m*]           (f̂0 de Chao1)
     q1: ¹Dobs + (¹D̂ − ¹Dobs) [1 − (1 − f1 / (n f̂0 + f1))^m*]   (¹D̂: estimador de Chao et al., 2013)
     q2: 1 / [1/m + (1 − 1/m) Σ Xi(Xi−1) / (n(n−1))]
   Cobertura de la muestra: Ĉn = 1 − (f1/n) [(n−1) f1 / ((n−1) f1 + 2 f2)] */
(function () {
  const raiz = document.getElementById("rarefaccion");
  if (!raiz) return;

  // ---------- Matemática ----------
  const LG = [0, 0];   // log-factorial en caché: LG[k] = ln(k!)
  function lfact(n) {
    for (let i = LG.length; i <= n; i++) LG[i] = LG[i - 1] + Math.log(i);
    return LG[n];
  }
  const lchoose = (n, k) => (k < 0 || k > n) ? -Infinity : lfact(n) - lfact(k) - lfact(n - k);

  function estadisticos(x) {
    x = x.filter(v => v > 0).map(Math.round);
    const n = x.reduce((a, b) => a + b, 0), S = x.length;
    const f1 = x.filter(v => v === 1).length, f2 = x.filter(v => v === 2).length;
    const f0 = n > 1 ? (f2 > 0 ? (n - 1) / n * f1 * f1 / (2 * f2) : (n - 1) / n * f1 * (f1 - 1) / 2) : 0;
    const sumXX = x.reduce((s, v) => s + v * (v - 1), 0);
    const p = x.map(v => v / n);
    const D1obs = Math.exp(-p.reduce((s, pi) => s + pi * Math.log(pi), 0));
    const D2obs = 1 / p.reduce((s, pi) => s + pi * pi, 0);

    // Shannon asintótico (Chao, Wang y Jost, 2013)
    const A = f2 > 0 ? 2 * f2 / ((n - 1) * f1 + 2 * f2) : f1 > 0 ? 2 / ((n - 1) * (f1 - 1) + 2) : 1;
    let H = 0;
    const armonico = []; let acc = 0;               // armonico[k] = Σ_{j=k}^{n−1} 1/j
    for (let k = n - 1; k >= 1; k--) { acc += 1 / k; armonico[k] = acc; }
    x.forEach(v => { if (v <= n - 1) H += v / n * armonico[v]; });
    if (f1 > 0 && A < 1) {
      let t = 0, pot = 1;
      for (let j = 1; j < 200000; j++) { pot *= (1 - A); const term = pot / (n - 1 + j); t += term; if (term < 1e-12) break; }
      H += f1 / n * t;
    }
    const D1 = Math.max(Math.exp(H), D1obs);
    const D2 = n > 1 && sumXX > 0 ? Math.max(n * (n - 1) / sumXX, D2obs) : D2obs;
    const cobertura = n > 1 ? 1 - f1 / n * ((n - 1) * f1 / ((n - 1) * f1 + 2 * f2 || 1)) : 0;
    return { x, n, S, f1, f2, f0, sumXX, D1obs, D2obs, D1, D2, S0: S + f0, cobertura };
  }

  function D(e, q, m) {
    const { x, n, S, f1, f0, sumXX } = e;
    if (m <= 0) return 0;
    if (q === 2) return 1 / (1 / m + (1 - 1 / m) * (n > 1 ? sumXX / (n * (n - 1)) : 0));
    if (m <= n) {
      const lc = lchoose(n, m);
      if (q === 0) return x.reduce((s, X) => s + 1 - Math.exp(lchoose(n - X, m) - lc), 0);
      let h = 0;   // q = 1
      for (let k = 1; k <= m; k++) {
        let fk = 0;
        for (const X of x) if (k <= X && m - k <= n - X) fk += Math.exp(lchoose(X, k) + lchoose(n - X, m - k) - lc);
        if (fk) h -= (k / m) * Math.log(k / m) * fk;
      }
      return Math.exp(h);
    }
    const ms = m - n, fac = f0 > 0 ? 1 - Math.pow(1 - f1 / (n * f0 + f1), ms) : 0;
    return q === 0 ? S + f0 * fac : e.D1obs + (e.D1 - e.D1obs) * fac;
  }

  // ---------- Interfaz ----------
  const COLORES = ["#c27c00", "#3f7d3a", "#b3401b", "#2f6fae", "#7b4fa0", "#1d8a8a", "#8a6d1d", "#a0396b"];
  const NOMBRES = { 0: "⁰D · riqueza", 1: "¹D · exp(Shannon)", 2: "²D · 1/Simpson" };
  let q = 0, sitios = [];

  raiz.innerHTML = `
    <div class="raref-q" role="group" aria-label="Orden q de la curva">
      ${[0, 1, 2].map(k => `<button type="button" class="btn chico${k ? " oscuro" : ""}" data-q="${k}" aria-pressed="${!k}">${NOMBRES[k]}</button>`).join("")}
    </div>
    <figure class="raref-figura">
      <svg viewBox="0 0 640 380" role="img" aria-labelledby="raref-titulo" data-svg></svg>
      <figcaption id="raref-titulo" class="small muted">Línea continua: rarefacción (interpolación). Línea punteada: extrapolación hasta el doble de la muestra. Punto: muestra observada.</figcaption>
    </figure>
    <div class="raref-leyenda" data-leyenda></div>
    <h3 style="margin-top:22px">Comparación con el mismo esfuerzo</h3>
    <div class="tabla-wrap"><table>
      <thead><tr><th>Sitio</th><th class="num">Individuos (n)</th><th class="num">Cobertura</th><th class="num" data-col-m>⁰D a m</th><th class="num">⁰D asintótica</th><th class="num">¹D asintótica</th><th class="num">²D asintótica</th></tr></thead>
      <tbody data-tabla></tbody>
    </table></div>
    <p class="small muted" data-nota></p>
    <div class="acciones-tabla"><button type="button" class="btn chico oscuro" data-descargar>Descargar curvas</button></div>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);
  const fmt = (v, d = 1) => Number.isFinite(v) ? v.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Puntos de cada curva: ~40 tamaños entre 1 y 2n, incluido n
  function curva(e, qq) {
    const fin = 2 * e.n, pasos = 40, ms = new Set([1, e.n, fin]);
    for (let i = 1; i < pasos; i++) ms.add(Math.max(1, Math.round(fin * i / pasos)));
    return [...ms].sort((a, b) => a - b).map(m => [m, D(e, qq, m)]);
  }

  function ticks(max, n = 5) {
    const paso0 = max / n, mag = Math.pow(10, Math.floor(Math.log10(paso0 || 1)));
    const paso = [1, 2, 2.5, 5, 10].map(f => f * mag).find(p => p >= paso0) || mag;
    const t = []; for (let v = 0; v <= max + 1e-9; v += paso) t.push(+v.toFixed(6)); return t;
  }

  function dibujar() {
    raiz.querySelectorAll("[data-q]").forEach(b => {
      const on = +b.dataset.q === q; b.setAttribute("aria-pressed", on); b.classList.toggle("oscuro", !on);
    });
    const series = sitios.map((s, i) => ({ ...s, color: COLORES[i % COLORES.length], pts: curva(s.e, q) }));
    const xmax = Math.max(...series.map(s => 2 * s.e.n), 1);
    const ymax = Math.max(...series.flatMap(s => s.pts.map(p => p[1])), 1) * 1.08;
    const M = { l: 52, r: 16, t: 14, b: 46 }, W = 640 - M.l - M.r, Ht = 380 - M.t - M.b;
    const X = v => M.l + v / xmax * W, Y = v => M.t + Ht - v / ymax * Ht;
    const tx = ticks(xmax), ty = ticks(ymax);
    const linea = pts => pts.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
    $("svg").innerHTML = `
      <g class="raref-ejes">
        ${ty.map(v => `<line x1="${M.l}" x2="${M.l + W}" y1="${Y(v)}" y2="${Y(v)}" class="raref-grid"/><text x="${M.l - 8}" y="${Y(v) + 4}" text-anchor="end">${fmt(v, v % 1 ? 1 : 0)}</text>`).join("")}
        ${tx.map(v => `<text x="${X(v)}" y="${M.t + Ht + 18}" text-anchor="middle">${fmt(v, 0)}</text>`).join("")}
        <line x1="${M.l}" x2="${M.l + W}" y1="${M.t + Ht}" y2="${M.t + Ht}" class="raref-eje"/>
        <line x1="${M.l}" x2="${M.l}" y1="${M.t}" y2="${M.t + Ht}" class="raref-eje"/>
        <text x="${M.l + W / 2}" y="${380 - 6}" text-anchor="middle" class="raref-titulo-eje">Número de individuos</text>
        <text transform="translate(14 ${M.t + Ht / 2}) rotate(-90)" text-anchor="middle" class="raref-titulo-eje">${NOMBRES[q]}</text>
      </g>
      ${series.map(s => {
        const inter = s.pts.filter(p => p[0] <= s.e.n), extra = s.pts.filter(p => p[0] >= s.e.n);
        const obs = s.pts.find(p => p[0] === s.e.n);
        return `<g style="--c:${s.color}">
          <path d="${linea(inter)}" class="raref-linea"/><path d="${linea(extra)}" class="raref-linea extra"/>
          <circle cx="${X(obs[0])}" cy="${Y(obs[1])}" r="5.5" class="raref-punto"><title>${esc(s.sitio)}: n = ${s.e.n}, ${fmt(obs[1], 2)}</title></circle>
        </g>`;
      }).join("")}`;
    $("leyenda").innerHTML = series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.sitio)}</span>`).join("");

    // Tabla: diversidad estimada al mismo tamaño de muestra
    const ns = sitios.map(s => s.e.n), m = Math.min(Math.max(...ns), 2 * Math.min(...ns));
    $("col-m").innerHTML = `${["⁰D", "¹D", "²D"][q]} a m = ${m.toLocaleString("es-CO")}`;
    $("tabla").innerHTML = sitios.map(s => `<tr>
      <td><strong>${esc(s.sitio)}</strong></td><td class="num">${s.e.n.toLocaleString("es-CO")}</td>
      <td class="num">${fmt(s.e.cobertura * 100, 1)} %</td><td class="num">${fmt(D(s.e, q, m), 2)}</td>
      <td class="num">${fmt(s.e.S0, 1)}</td><td class="num">${fmt(s.e.D1, 1)}</td><td class="num">${fmt(s.e.D2, 1)}</td></tr>`).join("");
    $("nota").innerHTML = `Para comparar, todos los sitios se llevan a <strong>m = ${m.toLocaleString("es-CO")} individuos</strong> (el tamaño mayor, sin pasar del doble de la muestra más pequeña). ` +
      `La <strong>cobertura</strong> estima qué proporción de los individuos de la comunidad pertenece a especies ya registradas: cerca del 100 % indica un muestreo casi completo.`;
  }

  document.addEventListener("hill:datos", ev => {
    sitios = ev.detail.map(r => ({ sitio: r.sitio, e: estadisticos(r.x) })).filter(s => s.e.n > 1);
    if (!sitios.length) { $("svg").innerHTML = ""; $("tabla").innerHTML = ""; return; }
    dibujar();
  });
  raiz.querySelector(".raref-q").addEventListener("click", ev => { const b = ev.target.closest("[data-q]"); if (b) { q = +b.dataset.q; dibujar(); } });
  $("descargar").addEventListener("click", () => {
    const filas = [["sitio", "q", "m", "metodo", "diversidad"]];
    sitios.forEach(s => [0, 1, 2].forEach(qq => curva(s.e, qq).forEach(([m, v]) =>
      filas.push([s.sitio, qq, m, m < s.e.n ? "rarefaccion" : m === s.e.n ? "observado" : "extrapolacion", v.toFixed(4)]))));
    Importador.descargar("rarefaccion_extrapolacion.csv", Importador.aCSV(filas));
  });
})();
