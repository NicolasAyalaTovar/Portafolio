/* =========================================================
   DATOS EDITABLES DEL SITIO
   Noticias de la página de inicio. Las especies están en especies.js.
   (Se guardan como JS y no como JSON para que el sitio funcione
   también abriendo los archivos directamente, sin servidor.)
   ========================================================= */

/* Noticias de entomología en Colombia.
   Campos: titulo, resumen, fuente, url, fecha (opcional, "AAAA-MM-DD"), etiqueta */
window.NOTICIAS = [
  {
    titulo: "Nuevo escarabajo joya del noroeste de Colombia",
    resumen: "Se describe Conognatha rhombofasciata (Buprestidae), un escarabajo metálico hallado por investigadores de universidades colombianas. Una excelente excusa para hablar de coloración estructural.",
    fuente: "Papéis Avulsos de Zoologia (USP)",
    url: "https://revistas.usp.br/paz/article/view/244352",
    fecha: "2026-05-01",
    etiqueta: "Nueva especie"
  },
  {
    titulo: "Un escarabajo diminuto en honor a Bachué",
    resumen: "Monstrophennium bachue mide apenas 1,5 mm y fue descrito por investigadores de la Pontificia Universidad Javeriana. Pequeño tamaño, gran diversidad oculta.",
    fuente: "Pesquisa Javeriana",
    url: "https://www.javeriana.edu.co/pesquisa/un-escarabajo-en-honor-a-bachue/",
    etiqueta: "Nueva especie"
  },
  {
    titulo: "La polilla avispa más grande del país",
    resumen: "La Universidad de Antioquia describió Tigridania magdalenae, una polilla que imita a una avispa: un caso de mimetismo para explicar en clase.",
    fuente: "El Espectador",
    url: "https://www.elespectador.com/ciencia/descubren-la-polilla-avispa-mas-grande-del-pais-y-un-lagarto-espinoso-semiacuatico/",
    etiqueta: "Mimetismo"
  },
  {
    titulo: "Nuevo escarabajo en la Serranía de Chiribiquete",
    resumen: "Investigadores del Instituto Humboldt describieron Aegidinus elbae tras tres años de estudio en uno de los parques naturales más biodiversos de Colombia.",
    fuente: "El Tiempo",
    url: "https://www.eltiempo.com/vida/medio-ambiente/descubren-nueva-especie-de-escarabajo-en-colombia-796561",
    etiqueta: "Biodiversidad"
  },
  {
    titulo: "Hallazgos que retan lo que sabemos sobre distribución de insectos",
    resumen: "Entre ellos, una cigarra nueva para la ciencia encontrada en las estribaciones andinas por entomólogos de la Universidad de Antioquia.",
    fuente: "Noticias Ambientales",
    url: "https://noticiasambientales.com/science/in-colombia-an-unidentified-insect-has-been-discovered-along-with-another-one-that-challenges-current-theories-about-its-distribution/",
    etiqueta: "Biogeografía"
  }
];


/* Proyectos que se muestran en el carrusel del inicio (los detalles están en proyectos.html).
   Campos: titulo, resumen, foto, url, etiqueta */
window.PROYECTOS = [
  {
    titulo: "Hotel para abejas e insectos",
    resumen: "Construye un refugio para abejas solitarias, mariquitas y crisopas con botellas, latas, cajas y cañas que iban a la basura.",
    foto: "img/Hotel para insectos.jpg",
    url: "proyectos.html#hotel-insectos",
    etiqueta: "Proyecto 01 · Material reutilizado"
  }
];
