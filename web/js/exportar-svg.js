/* Descarga un <svg> de la página como imagen PNG o JPG.
   El SVG debe usar colores escritos directamente (no variables CSS), porque al
   convertirlo en imagen se dibuja fuera de la página y sin su hoja de estilos. */
window.ExportarSVG = function (svg, nombre, tipo = "png", fondo = "#fffaf0") {
  const vb = svg.viewBox.baseVal, escala = 2;
  const w = vb.width, h = vb.height;
  const copia = svg.cloneNode(true);
  copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copia.setAttribute("width", w); copia.setAttribute("height", h);
  const texto = new XMLSerializer().serializeToString(copia);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = w * escala; c.height = h * escala;
    const ctx = c.getContext("2d");
    ctx.fillStyle = fondo; ctx.fillRect(0, 0, c.width, c.height);   // el JPG no tiene transparencia
    ctx.drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `${nombre}.${tipo === "jpg" ? "jpg" : "png"}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    }, tipo === "jpg" ? "image/jpeg" : "image/png", .95);
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(texto);
};

/* Nombre de archivo seguro a partir de un título */
window.nombreArchivo = t => (t || "diagrama").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "diagrama";
