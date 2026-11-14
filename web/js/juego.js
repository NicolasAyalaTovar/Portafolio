/* Juego 01: ¿Es un insecto?
   Para añadir preguntas, agrega objetos al arreglo PREGUNTAS. */
(function () {
  const PREGUNTAS = [
    { emoji: "🕷️", nombre: "la araña", insecto: false, por: "Tiene 8 patas y el cuerpo en 2 partes. Es un arácnido, primo de los insectos." },
    { emoji: "🐝", nombre: "la abeja", insecto: true, por: "Tiene 6 patas, antenas y el cuerpo en 3 partes: cabeza, tórax y abdomen." },
    { emoji: "🐌", nombre: "el caracol", insecto: false, por: "Es un molusco: no tiene patas articuladas ni exoesqueleto." },
    { emoji: "🐞", nombre: "la mariquita", insecto: true, por: "Es un escarabajo (orden Coleoptera): sus alas delanteras son duras y protegen a las de vuelo." },
    { emoji: "🦂", nombre: "el escorpión", insecto: false, por: "Tiene 8 patas: es un arácnido, como las arañas." },
    { emoji: "🦋", nombre: "la mariposa", insecto: true, por: "Tiene 6 patas y pasa por metamorfosis completa: huevo, oruga, pupa y adulto." },
    { emoji: "🐜", nombre: "la hormiga", insecto: true, por: "Es un insecto social, pariente cercano de las abejas y avispas (Hymenoptera)." },
    { emoji: "🪱", nombre: "la lombriz", insecto: false, por: "Es un anélido: su cuerpo está formado por anillos y no tiene patas." }
  ];

  const $ = id => document.getElementById(id);
  let orden, i, aciertos;

  function iniciar() {
    orden = [...PREGUNTAS].sort(() => Math.random() - .5);
    i = 0; aciertos = 0;
    $("marcador").innerHTML = orden.map(() => "<span></span>").join("");
    mostrar();
  }

  function mostrar() {
    const p = orden[i];
    $("emoji").textContent = p.emoji;
    $("pregunta").textContent = `¿Es ${p.nombre} un insecto?`;
    $("explicacion").textContent = "";
    $("siguiente").hidden = true;
    $("opciones").innerHTML = `
      <button class="btn" data-r="true">Sí, es un insecto</button>
      <button class="btn oscuro" data-r="false">No, no lo es</button>`;
  }

  $("opciones").addEventListener("click", ev => {
    const b = ev.target.closest("button"); if (!b || b.disabled) return;
    const p = orden[i], ok = (b.dataset.r === "true") === p.insecto;
    if (ok) aciertos++;
    $("opciones").querySelectorAll("button").forEach(x => {
      x.disabled = true;
      if ((x.dataset.r === "true") === p.insecto) x.classList.add("correcta");
      else if (x === b) x.classList.add("incorrecta");
    });
    $("marcador").children[i].className = ok ? "ok" : "mal";
    $("explicacion").innerHTML = `<strong>${ok ? "¡Correcto! 🎉" : "¡Casi!"}</strong> ${p.por}`;
    $("siguiente").hidden = false;
    $("siguiente").textContent = i < orden.length - 1 ? "Siguiente →" : "Ver resultado";
  });

  $("siguiente").addEventListener("click", () => {
    if (i >= orden.length) return iniciar();   // "Jugar de nuevo"
    i++;
    if (i < orden.length) return mostrar();
    $("emoji").textContent = aciertos === orden.length ? "🏆" : "🍯";
    $("pregunta").textContent = `¡Llenaste ${aciertos} de ${orden.length} celdas del panal!`;
    $("opciones").innerHTML = "";
    $("explicacion").textContent = "Recuerda: un insecto tiene 6 patas, antenas y el cuerpo dividido en cabeza, tórax y abdomen.";
    $("siguiente").textContent = "Jugar de nuevo";
  });

  iniciar();
})();
