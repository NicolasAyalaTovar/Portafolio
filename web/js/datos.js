/* =========================================================
   DATOS EDITABLES DEL SITIO
   Para actualizar noticias o especies, edita estos arreglos.
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

/* Entomofauna bogotana.
   Cada especie se usa para enseñar un concepto biológico.
   Campos: nombre, cientifico, orden, emoji, habitat, descripcion, concepto, conceptoTexto */
window.ESPECIES = [
  {
    nombre: "Abejorro común",
    cientifico: "Bombus atratus",
    orden: "Hymenoptera",
    emoji: "🐝",
    habitat: "Jardines, parques y bordes de humedal",
    descripcion: "Abejorro nativo, grande y peludo, frecuente en jardines y flores de la sabana.",
    concepto: "Termorregulación",
    conceptoTexto: "Hace vibrar sus músculos de vuelo para calentarse: por eso puede volar en las mañanas frías de Bogotá, cuando otros insectos aún no se activan."
  },
  {
    nombre: "Abeja melífera",
    cientifico: "Apis mellifera",
    orden: "Hymenoptera",
    emoji: "🍯",
    habitat: "Parques, cultivos y apiarios urbanos",
    descripcion: "Especie introducida de enorme importancia agrícola y la fuente de la miel, el polen y la cera.",
    concepto: "Eusocialidad",
    conceptoTexto: "Vive en colonias con división del trabajo: una reina reproductora, obreras estériles y zánganos. Es un modelo clásico para enseñar comportamiento social."
  },
  {
    nombre: "Mariposa blanca de la col",
    cientifico: "Leptophobia aripa",
    orden: "Lepidoptera",
    emoji: "🦋",
    habitat: "Huertas urbanas y jardines",
    descripcion: "Una de las mariposas más vistas en la ciudad; sus orugas se alimentan de coles y otras crucíferas.",
    concepto: "Metamorfosis completa",
    conceptoTexto: "Huevo, larva (oruga), pupa y adulto: cada etapa tiene un cuerpo y un papel ecológico distinto. Ideal para observar en una huerta escolar."
  },
  {
    nombre: "Mariposa amarilla andina",
    cientifico: "Colias dimera",
    orden: "Lepidoptera",
    emoji: "🌼",
    habitat: "Potreros y pastizales de alta montaña",
    descripcion: "Mariposa amarillo-anaranjada de vuelo bajo, típica de zonas abiertas andinas.",
    concepto: "Adaptación a la altitud",
    conceptoTexto: "Se calienta al sol con las alas como paneles solares (comportamiento de asoleo) para alcanzar la temperatura necesaria para volar."
  },
  {
    nombre: "Cucarrón de mayo",
    cientifico: "Ancognatha scarabaeoides",
    orden: "Coleoptera",
    emoji: "🪲",
    habitat: "Prados, potreros y alumbrado nocturno",
    descripcion: "Escarabajo que aparece en masa durante las lluvias; sus larvas viven bajo el suelo.",
    concepto: "Ciclos de vida y estacionalidad",
    conceptoTexto: "Los adultos emergen sincronizados con la temporada de lluvias. Sirve para explicar cómo el clima regula las poblaciones."
  },
  {
    nombre: "Chiza",
    cientifico: "Clavipalpus ursinus",
    orden: "Coleoptera",
    emoji: "🐛",
    habitat: "Suelos de pastos y cultivos de la sabana",
    descripcion: "Larva blanca en forma de “C” que se alimenta de raíces; el adulto es un escarabajo.",
    concepto: "Insectos y agricultura",
    conceptoTexto: "Lo que para un agricultor es plaga, para un ecosistema es alimento de aves y mamíferos. Abre la discusión sobre control biológico."
  },
  {
    nombre: "Libélula de los humedales",
    cientifico: "Rhionaeschna marchali",
    orden: "Odonata",
    emoji: "🪽",
    habitat: "Humedales bogotanos (Juan Amarillo, La Conejera…)",
    descripcion: "Gran libélula depredadora; sus ninfas viven bajo el agua.",
    concepto: "Bioindicadores",
    conceptoTexto: "Sus ninfas necesitan agua de buena calidad. Su presencia nos habla de la salud del humedal."
  },
  {
    nombre: "Mariquita roja",
    cientifico: "Cycloneda sanguinea",
    orden: "Coleoptera",
    emoji: "🐞",
    habitat: "Jardines, rosales y huertas",
    descripcion: "Mariquita nativa, roja y sin puntos, gran consumidora de áfidos (pulgones).",
    concepto: "Control biológico",
    conceptoTexto: "Una sola larva puede comer cientos de pulgones. Es la aliada natural de la huerta urbana."
  },
  {
    nombre: "Mariquita arlequín",
    cientifico: "Harmonia axyridis",
    orden: "Coleoptera",
    emoji: "⚠️",
    habitat: "Zonas urbanas y cultivos",
    descripcion: "Mariquita asiática de colores y puntos muy variables, introducida en Colombia.",
    concepto: "Especies invasoras",
    conceptoTexto: "Compite con las mariquitas nativas y puede desplazarlas. Un ejemplo cercano para hablar de cómo las especies introducidas cambian los ecosistemas."
  }
];
