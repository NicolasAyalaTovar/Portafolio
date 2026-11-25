/* Juego bachillerato 05: Científicos de hormigas (método y pensamiento científico).
   Un experimento completo con la hormiga de los andenes (Linepithema sp., del álbum):
   pregunta investigable → hipótesis → variables → grupo control → réplicas → análisis.
   Los datos del último reto se simulan en cada partida. */
(function () {
  const raiz = document.getElementById("metodo");
  if (!raiz) return;

  const OBSERVACION = "En la cocina del colegio aparece una fila de hormigas de los andenes (<em>Linepithema</em> sp.) que va directo hacia el azucarero, pero nunca hacia el salero.";

  const VARIABLES = [
    { t: "El tipo de cebo: azúcar, sal o agua", v: "I" },
    { t: "El número de hormigas en cada cebo a los 30 minutos", v: "D" },
    { t: "La cantidad de cebo: media cucharadita", v: "C" },
    { t: "La distancia de cada cebo al hormiguero", v: "C" },
    { t: "La hora del día en que se hace el experimento", v: "C" },
    { t: "El tamaño del papel donde se pone el cebo", v: "C" }
  ];
  const TIPOS_VAR = { I: "La cambio (independiente)", D: "La mido (dependiente)", C: "La mantengo igual (controlada)" };

  const RETOS = [
    { paso: "Paso 1 · La pregunta", texto: OBSERVACION,
      pregunta: "¿Cuál de estas preguntas se puede responder con un experimento?",
      opciones: ["¿Por qué las hormigas son tan molestas?",
                 "¿Las hormigas de los andenes prefieren el azúcar o la sal?",
                 "¿Las hormigas son felices cuando encuentran comida?"], correcta: 1,
      por: "Una <strong>pregunta investigable</strong> se puede responder observando o midiendo algo. «Molestas» es una opinión y la felicidad de una hormiga no se puede medir; en cambio, sí podemos contar cuántas hormigas llegan a cada alimento." },
    { paso: "Paso 2 · La hipótesis", texto: "Ya tienes tu pregunta: ¿las hormigas de los andenes prefieren el azúcar o la sal?",
      pregunta: "¿Cuál es la mejor hipótesis?",
      opciones: ["Las hormigas son muy inteligentes.",
                 "Si pongo azúcar y sal a la misma distancia del hormiguero, llegarán más hormigas al azúcar, porque es una fuente de energía para la colonia.",
                 "Las hormigas prefieren el azúcar porque yo lo vi en la cocina."], correcta: 1,
      por: "Una buena <strong>hipótesis</strong> es una respuesta tentativa que se puede poner a prueba: hace una <strong>predicción</strong> («llegarán más hormigas al azúcar») y propone una <strong>explicación</strong> («es fuente de energía»). Una sola observación en la cocina no basta: eso es lo que vamos a comprobar." },
    { paso: "Paso 3 · Las variables", texto: "Vas a poner tres cebos —azúcar, sal y agua— cerca de un hormiguero del patio y contar las hormigas que llegan a cada uno.",
      variables: true,
      pregunta: "Clasifica cada variable de tu experimento.",
      por: "Solo debe cambiar <strong>una variable a propósito</strong>: el tipo de cebo (independiente). Lo que mides es el número de hormigas (dependiente). Todo lo demás se <strong>controla</strong>: si un cebo estuviera más cerca del hormiguero, no sabrías si llegaron más hormigas por el alimento o por la distancia." },
    { paso: "Paso 4 · El grupo control", texto: "En tu montaje hay tres papeles: uno con azúcar, uno con sal y uno solo con agua.",
      pregunta: "¿Para qué sirve el papel que solo tiene agua?",
      opciones: ["Para que las hormigas tomen agua después de comer.",
                 "Para saber cuántas hormigas llegan a un papel mojado aunque no tenga alimento, y comparar los demás cebos con esa referencia.",
                 "No sirve para nada; se puede quitar."], correcta: 1,
      por: "Es el <strong>grupo control</strong>. Algunas hormigas pasarán por cualquier papel por casualidad o atraídas por la humedad. El control dice cuántas llegan «porque sí», y solo la diferencia frente a él se puede atribuir al alimento." },
    { paso: "Paso 5 · Las réplicas", texto: "Tu experimento está listo. Ahora debes decidir cuántas veces hacerlo.",
      pregunta: "¿Qué es mejor?",
      opciones: ["Hacerlo una sola vez: si el azúcar gana, ya está demostrado.",
                 "Repetirlo cinco veces, en días distintos o con hormigueros distintos, y comparar los promedios.",
                 "Hacerlo una vez y contar las hormigas durante cinco horas."], correcta: 1,
      por: "Las <strong>réplicas</strong> separan el patrón real de la casualidad. Un solo día podría salir raro: lluvia, un pájaro cerca o un hormiguero con hambre. Si el resultado se repite, confiamos más en él." },
    { paso: "Paso 6 · Los resultados", datos: true, texto: "Hiciste cinco réplicas. Estos son tus datos: número de hormigas en cada cebo a los 30 minutos.",
      pregunta: "¿Qué puedes concluir?",
      opciones: ["Los datos apoyan la hipótesis: en todas las réplicas llegaron muchas más hormigas al azúcar que a la sal y al agua.",
                 "Los datos demuestran que todas las hormigas del mundo prefieren el azúcar.",
                 "No se puede concluir nada, porque en cada réplica llegó un número distinto de hormigas."], correcta: 0,
      por: "Los datos <strong>apoyan</strong> la hipótesis, pero no la demuestran para siempre ni para todas las especies: solo probaste hormigas de los andenes, en un lugar y una época. Que los números varíen entre réplicas es normal; por eso se comparan los promedios. Un buen científico también comunica sus resultados y plantea preguntas nuevas: ¿y si comparamos azúcar con atún, que es proteína?" }
  ];

  let reto, aciertos, respondido, datos;

  raiz.innerHTML = `
    <span class="etiqueta">Bachillerato · Juego 05 · Científicos de hormigas</span>
    <div class="marcador" data-marcador aria-hidden="true"></div>
    <p class="metodo-paso" data-paso></p>
    <p class="muted metodo-texto" data-texto></p>
    <div data-extra></div>
    <p class="pregunta metodo-pregunta" data-pregunta></p>
    <div class="opciones metodo-opciones" data-opciones></div>
    <p class="explicacion" data-explicacion aria-live="polite"></p>
    <button type="button" class="btn oscuro" data-siguiente hidden>Siguiente paso →</button>`;
  const $ = k => raiz.querySelector(`[data-${k}]`);
  const mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function simular() {
    const conteo = m => Math.max(0, Math.round(m + (Math.random() - .5) * m * .7 + (Math.random() - .5) * 2));
    return Array.from({ length: 5 }, () => ({ azucar: conteo(17), sal: conteo(2), agua: conteo(1) }));
  }

  function tablaDatos() {
    const prom = k => datos.reduce((s, d) => s + d[k], 0) / datos.length;
    const p = { azucar: prom("azucar"), sal: prom("sal"), agua: prom("agua") };
    const max = Math.max(p.azucar, p.sal, p.agua, 1);
    const nombres = { azucar: "Azúcar", sal: "Sal", agua: "Agua (control)" };
    const f1 = v => v.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `<div class="tabla-wrap"><table class="metodo-tabla">
      <thead><tr><th>Cebo</th>${datos.map((_, i) => `<th class="num">Réplica ${i + 1}</th>`).join("")}<th class="num">Promedio</th></tr></thead>
      <tbody>${Object.keys(nombres).map(k => `<tr><td><strong>${nombres[k]}</strong></td>${datos.map(d => `<td class="num">${d[k]}</td>`).join("")}<td class="num"><strong>${f1(p[k])}</strong></td></tr>`).join("")}</tbody>
    </table></div>
    <div class="metodo-barras" aria-hidden="true">${Object.keys(nombres).map(k => `
      <div><span>${nombres[k]}</span><i style="width:${p[k] / max * 100}%"></i><b>${f1(p[k])}</b></div>`).join("")}</div>`;
  }

  function mostrar() {
    const r = RETOS[reto];
    respondido = false;
    $("paso").textContent = r.paso;
    $("texto").innerHTML = r.texto;
    $("pregunta").textContent = r.pregunta;
    $("explicacion").textContent = "";
    $("siguiente").hidden = true;
    $("extra").innerHTML = "";
    if (r.datos) { datos = simular(); $("extra").innerHTML = tablaDatos(); }
    if (r.variables) {
      $("opciones").innerHTML = "";
      $("extra").innerHTML = `<div class="metodo-vars">${mezclar(VARIABLES.map((v, i) => i)).map(i => `
        <div class="metodo-var" data-var="${i}"><p>${VARIABLES[i].t}</p>
          <div class="metodo-elige" role="group" aria-label="Tipo de variable">${Object.entries(TIPOS_VAR).map(([k, n]) =>
            `<button type="button" class="btn chico oscuro" data-v="${k}" aria-pressed="false">${n}</button>`).join("")}</div></div>`).join("")}
        </div><button type="button" class="btn" data-comprobar disabled>Comprobar</button>`;
      return;
    }
    $("opciones").innerHTML = mezclar(r.opciones.map((o, i) => [o, i])).map(([o, i]) => `<button type="button" class="btn" data-i="${i}">${o}</button>`).join("");
  }

  function terminar(ok) {
    const r = RETOS[reto];
    respondido = true;
    if (ok) aciertos++;
    $("marcador").children[reto].className = ok ? "ok" : "mal";
    $("explicacion").innerHTML = `<strong>${ok ? "¡Correcto!" : "No es así."}</strong> ${r.por}`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = reto < RETOS.length - 1 ? "Siguiente paso →" : "Ver resultado";
  }

  function responder(i) {
    if (respondido) return;
    const r = RETOS[reto];
    $("opciones").querySelectorAll("button").forEach(b => {
      b.disabled = true;
      if (+b.dataset.i === r.correcta) b.classList.add("correcta"); else if (+b.dataset.i === i) b.classList.add("incorrecta");
    });
    terminar(i === r.correcta);
  }

  function comprobarVariables() {
    if (respondido) return;
    let ok = true;
    raiz.querySelectorAll(".metodo-var").forEach(c => {
      const elegido = c.querySelector('[aria-pressed="true"]'), real = VARIABLES[+c.dataset.var].v;
      c.querySelectorAll("button").forEach(b => {
        b.disabled = true;
        if (b.dataset.v === real) b.classList.add("correcta"); else if (b === elegido) b.classList.add("incorrecta");
      });
      if (!elegido || elegido.dataset.v !== real) ok = false;
    });
    $("comprobar").disabled = true;
    terminar(ok);
  }

  function final() {
    $("paso").textContent = `Resolviste ${aciertos} de ${RETOS.length} pasos`;
    ["texto", "extra", "opciones"].forEach(k => $(k).innerHTML = "");
    $("pregunta").textContent = "El método científico es un ciclo, no una receta";
    $("explicacion").innerHTML = `<ol class="evo-resumen">
        <li><strong>Observa</strong> y haz una <strong>pregunta investigable</strong>.</li>
        <li>Propón una <strong>hipótesis</strong> con una predicción y una explicación.</li>
        <li>Diseña un experimento: cambia <strong>una sola variable</strong>, mide otra y controla las demás.</li>
        <li>Incluye un <strong>grupo control</strong> y varias <strong>réplicas</strong>.</li>
        <li>Analiza los datos: ¿<strong>apoyan</strong> o <strong>refutan</strong> la hipótesis?</li>
        <li>Comunica tus resultados y plantea nuevas preguntas… y el ciclo vuelve a empezar.</li>
      </ol>
      ¿Quieres hacerlo de verdad? Este experimento se puede montar en el patio del colegio en media hora. Conoce a la protagonista en su <a href="entomofauna.html#linepithema-sp">lámina del álbum</a>.`;
    $("siguiente").textContent = "Jugar de nuevo";
  }

  function iniciar() {
    reto = 0; aciertos = 0;
    $("marcador").innerHTML = "<span></span>".repeat(RETOS.length);
    mostrar();
  }

  $("opciones").addEventListener("click", ev => { const b = ev.target.closest("button[data-i]"); if (b && !b.disabled) responder(+b.dataset.i); });
  $("extra").addEventListener("click", ev => {
    const b = ev.target.closest(".metodo-elige button");
    if (b && !b.disabled) {
      b.parentElement.querySelectorAll("button").forEach(x => { const on = x === b; x.setAttribute("aria-pressed", on); x.classList.toggle("oscuro", !on); });
      $("comprobar").disabled = [...raiz.querySelectorAll(".metodo-var")].some(c => !c.querySelector('[aria-pressed="true"]'));
    }
    if (ev.target.closest("[data-comprobar]")) comprobarVariables();
  });
  $("siguiente").addEventListener("click", () => {
    if (reto >= RETOS.length) return iniciar();
    reto++;
    if (reto < RETOS.length) mostrar(); else final();
  });
  iniciar();
})();
