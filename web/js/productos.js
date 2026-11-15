/* =========================================================
   PRODUCTOS DE LA TIENDA
   - La página de Tienda muestra todos los productos.
   - La página de Inicio muestra solo los que tengan masVendido: true.
   Campos: nombre, emoji, descripcion, precio (texto o null = "Próximamente"),
           foto (opcional, ruta en img/), masVendido (true/false)
   ========================================================= */
window.PRODUCTOS = [
  { nombre: "Miel", emoji: "🍯", masVendido: true, precio: null,
    descripcion: "Néctar transformado por las enzimas de las obreras y deshidratado con el aleteo de toda la colonia." },
  { nombre: "Polen", emoji: "🌼", masVendido: true, precio: null,
    descripcion: "Las bolitas que las abejas cargan en sus patas traseras: la proteína de la colmena." },
  { nombre: "Propóleo", emoji: "🛡️", masVendido: true, precio: null,
    descripcion: "Resinas vegetales que las abejas usan para sellar y proteger su hogar." },
  { nombre: "Velas de cera", emoji: "🕯️", masVendido: false, precio: null,
    descripcion: "Cera producida por glándulas del abdomen de las obreras, la misma que forma los hexágonos del panal." },
  { nombre: "Cosmética natural", emoji: "🧼", masVendido: false, precio: null,
    descripcion: "Jabones y bálsamos con miel, cera y propóleo." },
  { nombre: "Kits didácticos", emoji: "📦", masVendido: false, precio: null,
    descripcion: "Material para aprender sobre abejas en casa o en el aula." }
];

/* Dibuja tarjetas de producto dentro de un contenedor */
window.pintarProductos = function (contenedor, lista) {
  contenedor.innerHTML = lista.map(p => `
    <article class="tarjeta producto">
      ${p.foto
        ? `<figure class="foto-especie foto-producto"><img src="${encodeURI(p.foto)}" alt="${p.nombre}" loading="lazy"></figure>`
        : `<div class="hex-icon" aria-hidden="true">${p.emoji}</div>`}
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      ${p.precio ? `<p class="precio">${p.precio}</p>` : ""}
      <button class="btn chico" ${p.precio ? "" : "disabled"}>${p.precio ? "Comprar" : "Próximamente"}</button>
    </article>`).join("");
};
