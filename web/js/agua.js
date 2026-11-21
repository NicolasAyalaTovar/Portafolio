/* Herramienta 03: calidad del agua.
   Parte A · Índice de Calidad del Agua de la National Sanitation Foundation (ICA-NSF;
     Brown et al., 1970). Cada parámetro se convierte en un subíndice Q (0–100) con su
     curva y se combina con pesos: ICA = Σ wi·Qi / Σ wi (si falta un parámetro, los pesos
     de los presentes se reescalan). Las curvas son aproximaciones lineales por tramos de
     las gráficas publicadas por la NSF.
   Parte B · Índice biológico BMWP/Col (Roldán, 2003): suma de los puntajes de las
     familias de macroinvertebrados presentes, y su promedio por familia (ASPT).
   Parte C · Diagnóstico integrado. */
(function () {
  const raiz = document.getElementById("agua-app");
  if (!raiz) return;

  // ---------- Parte A: parámetros, pesos NSF y curvas Q ----------
  // Curvas: pares [valor, Q]; fuera del rango se usa el extremo (o "fuera" si se indica)
  const PARAMS = [
    { id: "od", nombre: "Oxígeno disuelto", unidad: "% de saturación", w: .17, calc: true,
      como: "Kit colorimétrico o de Winkler (mg/L). La herramienta lo convierte a % de saturación con la temperatura y la altitud.",
      curva: [[0, 0], [10, 8], [20, 13], [30, 20], [40, 30], [50, 43], [60, 56], [70, 69], [80, 81], [90, 91], [100, 97], [110, 96], [120, 92], [130, 85], [140, 78]], fuera: 50 },
    { id: "coli", nombre: "Coliformes fecales", unidad: "UFC/100 mL", w: .16, log: true,
      como: "Placas o kits de coliformes que se incuban 24 a 48 horas.",
      curva: [[0, 98], [1, 74], [2, 46], [3, 22], [4, 8], [5, 3]], fuera: 2 },   // eje x en log10(UFC)
    { id: "ph", nombre: "pH", unidad: "unidades", w: .11,
      como: "Tiras indicadoras o pH-metro.",
      curva: [[2, 2], [3, 4], [4, 8], [5, 25], [6, 55], [6.5, 75], [7, 88], [7.3, 93], [7.5, 92], [8, 82], [8.5, 67], [9, 47], [10, 20], [11, 8], [12, 3]], fuera: 0 },
    { id: "dbo", nombre: "DBO₅", unidad: "mg/L", w: .11,
      como: "Mide el oxígeno de una muestra, guárdala 5 días a oscuras a 20 °C y vuelve a medir: la diferencia es la DBO.",
      curva: [[0, 96], [1, 92], [2, 80], [3, 71], [4, 61], [5, 56], [7, 44], [10, 33], [15, 17], [20, 10], [30, 2]], fuera: 2 },
    { id: "dt", nombre: "Cambio de temperatura", unidad: "°C", w: .10,
      como: "Diferencia entre este punto y un punto aguas arriba (o sin intervención) del mismo cuerpo de agua.",
      curva: [[-10, 56], [-5, 75], [0, 93], [5, 73], [10, 43], [15, 28], [20, 19], [30, 10]], fuera: 5 },
    { id: "fos", nombre: "Fosfatos", unidad: "mg/L PO₄³⁻", w: .10,
      como: "Kit colorimétrico (como los de acuario).",
      curva: [[0, 99], [.05, 98], [.1, 97], [.2, 95], [.3, 90], [.5, 80], [.75, 67], [1, 60], [1.5, 47], [2, 38], [3, 27], [4, 22], [5, 17], [10, 5]], fuera: 2 },
    { id: "nit", nombre: "Nitratos", unidad: "mg/L NO₃⁻", w: .10,
      como: "Tiras o kit colorimétrico.",
      curva: [[0, 98], [1, 97], [2, 92], [3, 85], [4, 78], [5, 70], [10, 51], [15, 43], [20, 37], [30, 26], [40, 20], [50, 15], [100, 2]], fuera: 1 },
    { id: "tur", nombre: "Turbidez", unidad: "NTU", w: .08,
      como: "Tubo de turbidez o disco de Secchi con su tabla de conversión.",
      curva: [[0, 98], [10, 76], [20, 62], [30, 53], [40, 45], [50, 39], [60, 34], [70, 29], [80, 25], [90, 22], [100, 17]], fuera: 5 },
    { id: "st", nombre: "Sólidos totales", unidad: "mg/L", w: .07,
      como: "Evapora 100 mL de agua filtrada en un recipiente pesado y pesa el residuo.",
      curva: [[0, 79], [50, 87], [100, 80], [150, 73], [200, 65], [300, 48], [400, 32], [500, 20]], fuera: 20 }
  ];
  const CLASES_ICA = [
    { min: 91, nombre: "Excelente", color: "#2f6fae", nivel: 1 },
    { min: 71, nombre: "Buena", color: "#2e9e4f", nivel: 2 },
    { min: 51, nombre: "Regular", color: "#d9a400", nivel: 3 },
    { min: 26, nombre: "Mala", color: "#ef7d00", nivel: 4 },
    { min: 0, nombre: "Muy mala", color: "#d62828", nivel: 5 }
  ];

  function interp(curva, v, fuera) {
    if (v < curva[0][0]) return curva[0][1];
    for (let i = 1; i < curva.length; i++) {
      const [x0, y0] = curva[i - 1], [x1, y1] = curva[i];
      if (v <= x1) return y0 + (y1 - y0) * (v - x0) / (x1 - x0);
    }
    return fuera ?? curva[curva.length - 1][1];
  }

  // Oxígeno de saturación (mg/L) a nivel del mar (APHA) corregido por la presión según la altitud
  function odSaturacion(T, altitud) {
    const s = 14.652 - 0.41022 * T + 0.007991 * T * T - 0.000077774 * T * T * T;
    return s * Math.pow(1 - 2.25577e-5 * altitud, 5.25588);
  }

  // ---------- Parte B: BMWP/Col (Roldán, 2003) ----------
  const BMWP = {
    10: "Anomalopsychidae:Trichoptera Atriplectididae:Trichoptera Blephariceridae:Diptera Calamoceratidae:Trichoptera Ptilodactylidae:Coleoptera Chordodidae:Otros Gomphidae:Odonata Hydridae:Otros Lampyridae:Coleoptera Limnesiidae:Otros Odontoceridae:Trichoptera Oligoneuriidae:Ephemeroptera Perlidae:Plecoptera Polythoridae:Odonata Psephenidae:Coleoptera",
    9: "Ampullariidae:Moluscos Dytiscidae:Coleoptera Ephemeridae:Ephemeroptera Euthyplociidae:Ephemeroptera Gyrinidae:Coleoptera Hydraenidae:Coleoptera Hydrobiosidae:Trichoptera Leptophlebiidae:Ephemeroptera Philopotamidae:Trichoptera Polycentropodidae:Trichoptera Polymitarcyidae:Ephemeroptera Xiphocentronidae:Trichoptera",
    8: "Gerridae:Hemiptera Hebridae:Hemiptera Helicopsychidae:Trichoptera Hydrobiidae:Moluscos Leptoceridae:Trichoptera Lestidae:Odonata Palaemonidae:Crustáceos Pleidae:Hemiptera Pseudothelphusidae:Crustáceos Saldidae:Hemiptera Simuliidae:Diptera Veliidae:Hemiptera",
    7: "Baetidae:Ephemeroptera Caenidae:Ephemeroptera Calopterygidae:Odonata Coenagrionidae:Odonata Corixidae:Hemiptera Dixidae:Diptera Dryopidae:Coleoptera Glossosomatidae:Trichoptera Hyalellidae:Crustáceos Hydroptilidae:Trichoptera Hydropsychidae:Trichoptera Leptohyphidae:Ephemeroptera Naucoridae:Hemiptera Notonectidae:Hemiptera Planariidae:Otros Psychodidae:Diptera Scirtidae:Coleoptera",
    6: "Aeshnidae:Odonata Ancylidae:Moluscos Corydalidae:Megaloptera Elmidae:Coleoptera Libellulidae:Odonata Limnichidae:Coleoptera Lutrochidae:Coleoptera Megapodagrionidae:Odonata Sialidae:Megaloptera Staphylinidae:Coleoptera",
    5: "Belostomatidae:Hemiptera Gelastocoridae:Hemiptera Mesoveliidae:Hemiptera Nepidae:Hemiptera Planorbidae:Moluscos Pyralidae:Lepidoptera Tabanidae:Diptera Thiaridae:Moluscos",
    4: "Chrysomelidae:Coleoptera Stratiomyidae:Diptera Haliplidae:Coleoptera Empididae:Diptera Dolichopodidae:Diptera Sphaeriidae:Moluscos Lymnaeidae:Moluscos Hydrometridae:Hemiptera Noteridae:Coleoptera",
    3: "Ceratopogonidae:Diptera Glossiphoniidae:Anélidos Cyclobdellidae:Anélidos Hydrophilidae:Coleoptera Physidae:Moluscos Tipulidae:Diptera",
    2: "Culicidae:Diptera Chironomidae:Diptera Muscidae:Diptera Sciomyzidae:Diptera Syrphidae:Diptera",
    1: "Tubificidae:Anélidos"
  };
  const FAMILIAS = Object.entries(BMWP).flatMap(([p, txt]) => txt.split(" ").map(t => { const [f, g] = t.split(":"); return { f, g, p: +p }; }));
  const GRUPOS = ["Ephemeroptera", "Plecoptera", "Trichoptera", "Odonata", "Coleoptera", "Hemiptera", "Megaloptera", "Lepidoptera", "Diptera", "Crustáceos", "Moluscos", "Anélidos", "Otros"];
  const NOTA_GRUPO = { Otros: "planarias, hidras, gusanos crin de caballo y ácaros acuáticos" };
  const CLASES_BMWP = [
    { min: 101, clase: "I", nombre: "Buena", desc: "aguas muy limpias a limpias", color: "#2f6fae", nivel: 1 },
    { min: 61, clase: "II", nombre: "Aceptable", desc: "aguas ligeramente contaminadas", color: "#2e9e4f", nivel: 2 },
    { min: 36, clase: "III", nombre: "Dudosa", desc: "aguas moderadamente contaminadas", color: "#d9a400", nivel: 3 },
    { min: 16, clase: "IV", nombre: "Crítica", desc: "aguas muy contaminadas", color: "#ef7d00", nivel: 4 },
    { min: 0, clase: "V", nombre: "Muy crítica", desc: "aguas fuertemente contaminadas", color: "#d62828", nivel: 5 }
  ];

  const EJEMPLO = { temp: 12, alt: 2600, od: 7.2, ph: 7.2, dt: 1, tur: 6, nit: 1.5, fos: 0.2, dbo: 1.5, coli: 40, st: 120,
    fam: ["Baetidae", "Leptophlebiidae", "Hydropsychidae", "Simuliidae", "Elmidae", "Chironomidae", "Hyalellidae", "Perlidae", "Leptoceridae", "Tipulidae"] };

  const fmt = (v, d = 1) => Number.isFinite(v) ? v.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";

  raiz.innerHTML = `
    <div class="tarjeta agua-parte">
      <h3>Parte A · Parámetros fisicoquímicos (ICA-NSF)</h3>
      <p class="small muted">Escribe solo lo que pudiste medir; deja vacío lo demás. Se necesitan al menos tres parámetros. Los pesos de los parámetros que falten se reparten entre los presentes.</p>
      <div class="campos agua-base">
        <div><label for="agua-temp">Temperatura del agua (°C)</label><input id="agua-temp" type="number" step="0.1" data-v="temp"></div>
        <div><label for="agua-alt">Altitud del sitio (m s. n. m.)</label><input id="agua-alt" type="number" step="10" value="2600" data-v="alt"></div>
      </div>
      <div class="tabla-wrap"><table class="agua-tabla">
        <thead><tr><th>Parámetro</th><th>Valor medido</th><th class="num">Peso</th><th class="num">Subíndice Q</th></tr></thead>
        <tbody>${PARAMS.map(p => `<tr>
          <td><strong>${p.nombre}</strong></td>
          <td><div class="agua-entrada"><input type="number" step="any" min="${p.id === "dt" ? "" : 0}" data-v="${p.id}" aria-label="${p.nombre} en ${p.id === "od" ? "mg/L" : p.unidad}">
            <span class="small">${p.id === "od" ? "mg/L" : p.unidad}</span></div><span class="small agua-extra" data-extra="${p.id}"></span><span class="small muted agua-como">${p.como}</span></td>
          <td class="num">${p.w.toFixed(2)}</td><td class="num"><strong data-q="${p.id}">—</strong></td></tr>`).join("")}
        </tbody>
      </table></div>
      <div class="agua-resultado" data-res="ica"></div>
    </div>

    <div class="tarjeta agua-parte">
      <h3>Parte B · Bioindicadores (BMWP/Col)</h3>
      <p class="small muted">Recoge macroinvertebrados con una red en piedras, hojarasca, arena y vegetación de la orilla. Identifícalos hasta familia y marca cada familia <strong>una sola vez</strong>, sin importar cuántos individuos encontraste. El número junto a cada familia es su puntaje: 10 para las más sensibles a la contaminación y 1 para las más tolerantes.</p>
      <input type="text" class="agua-buscar" placeholder="Buscar familia…" aria-label="Buscar familia" data-buscar>
      <div class="agua-familias" data-familias>
        ${GRUPOS.map(g => `<fieldset class="agua-grupo" data-grupo="${g}"><legend>${g}${NOTA_GRUPO[g] ? ` <span class="small muted">(${NOTA_GRUPO[g]})</span>` : ""}</legend>
          ${FAMILIAS.filter(x => x.g === g).sort((a, b) => b.p - a.p || a.f.localeCompare(b.f)).map(x => `
            <label class="agua-fam" data-nombre="${x.f.toLowerCase()}"><input type="checkbox" value="${x.f}"><span>${x.f}</span><b>${x.p}</b></label>`).join("")}
        </fieldset>`).join("")}
      </div>
      <div class="agua-resultado" data-res="bmwp"></div>
    </div>

    <div class="tarjeta agua-parte agua-integrado">
      <h3>Parte C · Diagnóstico integrado</h3>
      <div data-res="integrado"><p class="muted">Completa las partes A y B para comparar los dos indicadores.</p></div>
      <div class="acciones-tabla">
        <button type="button" class="btn chico" data-accion="ejemplo">Cargar ejemplo</button>
        <button type="button" class="btn chico oscuro" data-accion="limpiar">Limpiar</button>
        <button type="button" class="btn chico oscuro" data-accion="descargar">Descargar informe</button>
      </div>
    </div>`;

  const val = id => { const el = raiz.querySelector(`[data-v="${id}"]`); return el && el.value.trim() !== "" ? Number(el.value) : NaN; };
  let ultimo = {};

  function calcular() {
    // ----- Parte A -----
    const T = val("temp"), alt = Number.isFinite(val("alt")) ? val("alt") : 0;
    const filas = [];
    PARAMS.forEach(p => {
      let v = val(p.id), extra = "";
      if (p.id === "od" && Number.isFinite(v)) {
        if (Number.isFinite(T)) { const sat = odSaturacion(T, alt); v = v / sat * 100; extra = `${fmt(v, 0)} % de saturación (saturación: ${fmt(sat, 1)} mg/L)`; }
        else { v = NaN; extra = "Escribe la temperatura del agua para calcular el % de saturación."; }
      }
      let Q = NaN;
      if (Number.isFinite(v)) Q = interp(p.curva, p.log ? Math.log10(Math.max(v, 1)) : v, p.fuera);
      raiz.querySelector(`[data-q="${p.id}"]`).textContent = Number.isFinite(Q) ? fmt(Q, 0) : "—";
      raiz.querySelector(`[data-extra="${p.id}"]`).textContent = extra;
      if (Number.isFinite(Q)) filas.push({ p, Q });
    });
    const sw = filas.reduce((s, f) => s + f.p.w, 0);
    const ica = filas.length >= 3 ? filas.reduce((s, f) => s + f.p.w * f.Q, 0) / sw : NaN;
    const cIca = Number.isFinite(ica) ? CLASES_ICA.find(c => ica >= c.min) : null;
    raiz.querySelector('[data-res="ica"]').innerHTML = cIca
      ? `<div class="agua-indice" style="--c:${cIca.color}"><span class="agua-valor">${fmt(ica, 0)}</span><div><strong>ICA-NSF: calidad ${cIca.nombre.toLowerCase()}</strong><span class="small">Calculado con ${filas.length} de ${PARAMS.length} parámetros (${fmt(sw * 100, 0)} % del peso total).</span></div></div>
         <p class="small muted">Rangos: 91–100 excelente · 71–90 buena · 51–70 regular · 26–50 mala · 0–25 muy mala.</p>`
      : `<p class="muted small">${filas.length ? `Llevas ${filas.length} parámetro${filas.length > 1 ? "s" : ""}: se necesitan al menos tres.` : "Aún no hay parámetros."}</p>`;

    // ----- Parte B -----
    const marcadas = [...raiz.querySelectorAll(".agua-fam input:checked")].map(i => FAMILIAS.find(x => x.f === i.value));
    const bmwp = marcadas.reduce((s, x) => s + x.p, 0), aspt = marcadas.length ? bmwp / marcadas.length : NaN;
    const cB = marcadas.length ? CLASES_BMWP.find(c => bmwp >= c.min) : null;
    raiz.querySelector('[data-res="bmwp"]').innerHTML = cB
      ? `<div class="agua-indice" style="--c:${cB.color}"><span class="agua-valor">${bmwp}</span><div><strong>BMWP/Col: clase ${cB.clase}, ${cB.nombre.toLowerCase()}</strong><span class="small">${cB.desc[0].toUpperCase() + cB.desc.slice(1)}. ${marcadas.length} familias · ASPT (promedio por familia): ${fmt(aspt, 2)}</span></div></div>
         <p class="small muted">Clases: I &gt;100 buena · II 61–100 aceptable · III 36–60 dudosa · IV 16–35 crítica · V ≤15 muy crítica.</p>`
      : `<p class="muted small">Marca las familias que encontraste.</p>`;

    // ----- Parte C -----
    let txt = '<p class="muted">Completa las partes A y B para comparar los dos indicadores.</p>';
    if (cIca && cB) {
      const d = cB.nivel - cIca.nivel;
      txt = `<p>El agua tiene calidad <strong style="color:${cIca.color}">${cIca.nombre.toLowerCase()}</strong> según la fisicoquímica y <strong style="color:${cB.color}">${cB.nombre.toLowerCase()}</strong> según los bioindicadores.</p><p>` +
        (Math.abs(d) <= 1 ? "Los dos indicadores coinciden: el diagnóstico es confiable."
          : d > 1 ? "Los organismos muestran un estado peor que la química. Los macroinvertebrados viven semanas en el agua y registran contaminación que pudo pasar antes del día del muestreo, o un hábitat degradado (orillas sin vegetación, fondo cubierto de lodo). Revisa también si muestreaste todos los microhábitats."
          : "La química muestra un estado peor que los organismos. Puede tratarse de una contaminación reciente que aún no ha afectado a la comunidad, de un vertimiento puntual, o de un error de medición. Repite las mediciones en otro día.") +
        "</p><p class=\"small muted\">La fisicoquímica es una fotografía del momento; los bioindicadores son una película de las últimas semanas. Juntos dan un diagnóstico más completo.</p>";
    }
    raiz.querySelector('[data-res="integrado"]').innerHTML = txt;
    ultimo = { filas, ica, cIca, marcadas, bmwp, aspt, cB, T, alt };
  }

  raiz.addEventListener("input", ev => {
    if (ev.target.matches("[data-buscar]")) {
      const t = ev.target.value.trim().toLowerCase();
      raiz.querySelectorAll(".agua-fam").forEach(l => l.hidden = t && !l.dataset.nombre.includes(t));
      raiz.querySelectorAll(".agua-grupo").forEach(g => g.hidden = ![...g.querySelectorAll(".agua-fam")].some(l => !l.hidden));
      return;
    }
    calcular();
  });
  raiz.addEventListener("change", calcular);
  raiz.addEventListener("click", ev => {
    const a = ev.target.closest("[data-accion]")?.dataset.accion; if (!a) return;
    if (a === "ejemplo" || a === "limpiar") {
      raiz.querySelectorAll("[data-v]").forEach(i => { i.value = a === "ejemplo" ? (EJEMPLO[i.dataset.v] ?? "") : (i.dataset.v === "alt" ? 2600 : ""); });
      raiz.querySelectorAll(".agua-fam input").forEach(c => c.checked = a === "ejemplo" && EJEMPLO.fam.includes(c.value));
      calcular();
    }
    if (a === "descargar") {
      const u = ultimo, F = [["seccion", "parametro_o_familia", "valor", "subindice_o_puntaje"]];
      u.filas.forEach(f => F.push(["fisicoquimica", f.p.nombre, val(f.p.id), f.Q.toFixed(1)]));
      F.push(["fisicoquimica", "ICA-NSF", Number.isFinite(u.ica) ? u.ica.toFixed(1) : "", u.cIca ? u.cIca.nombre : ""]);
      u.marcadas.forEach(x => F.push(["bioindicadores", x.f, "presente", x.p]));
      F.push(["bioindicadores", "BMWP/Col", u.bmwp, u.cB ? `Clase ${u.cB.clase} ${u.cB.nombre}` : ""]);
      F.push(["bioindicadores", "ASPT", Number.isFinite(u.aspt) ? u.aspt.toFixed(2) : "", ""]);
      Importador.descargar("calidad_del_agua.csv", Importador.aCSV(F));
    }
  });
  calcular();
})();
