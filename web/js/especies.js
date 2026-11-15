/* =========================================================
   ENTOMOFAUNA BOGOTANA — fichas tipo álbum
   Para añadir una especie: deja su foto en img/ y copia un bloque { ... }.
   El número de la ficha se asigna según la posición en el arreglo.
   ========================================================= */

/* Leyenda: códigos que se usan en cada ficha */
window.LEYENDA = {
  ordenes: {
    Hymenoptera:  { emoji: "🐝", comun: "abejas, avispas y hormigas" },
    Lepidoptera:  { emoji: "🦋", comun: "mariposas y polillas" },
    Coleoptera:   { emoji: "🪲", comun: "escarabajos" },
    Orthoptera:   { emoji: "🦗", comun: "saltamontes y grillos" },
    Diptera:      { emoji: "🪰", comun: "moscas y zancudos" },
    Odonata:      { emoji: "🐛", comun: "libélulas y caballitos del diablo" },
    Siphonaptera: { emoji: "🐛", comun: "pulgas" },
    Dermaptera:   { emoji: "🐛", comun: "tijeretas" },
    Zygentoma:    { emoji: "🐛", comun: "pececillos de plata" }
  },
  habitats: {
    parques:   { emoji: "🌳", nombre: "Parques y jardines" },
    humedales: { emoji: "💧", nombre: "Humedales" },
    cerros:    { emoji: "⛰️", nombre: "Cerros orientales" },
    cultivos:  { emoji: "🌾", nombre: "Cultivos y potreros" },
    viviendas: { emoji: "🏠", nombre: "Viviendas" }
  },
  dietas: {
    herbivoro:   { emoji: "🌿", nombre: "Herbívoro", desc: "se alimenta de plantas, néctar o polen" },
    depredador:  { emoji: "🎯", nombre: "Depredador", desc: "caza otros animales" },
    hematofago:  { emoji: "🩸", nombre: "Hematófago", desc: "se alimenta de sangre" },
    detritivoro: { emoji: "🍂", nombre: "Detritívoro", desc: "come materia orgánica en descomposición" },
    omnivoro:    { emoji: "🍽️", nombre: "Omnívoro", desc: "come plantas y animales" }
  },
  desarrollo: {
    holo:  { simbolo: "Ho", nombre: "Holometábolo", desc: "metamorfosis completa: huevo, larva, pupa y adulto" },
    hemi:  { simbolo: "He", nombre: "Hemimetábolo", desc: "metamorfosis incompleta: huevo, ninfa y adulto" },
    ameta: { simbolo: "Am", nombre: "Ametábolo", desc: "sin metamorfosis: las crías son adultos en miniatura" }
  }
};

/* Campos: nombre, cientifico, familia, orden, foto, habitats[], dieta[], dietaNota (opcional),
   desarrollo (holo | hemi | ameta), descripcion */
window.ESPECIES = [
  // ---------- Hymenoptera ----------
  { nombre: "Abejorro común", cientifico: "Bombus atratus", familia: "Apidae", orden: "Hymenoptera",
    foto: "img/Bombus atratus.jpeg", habitats: ["parques", "humedales", "cerros", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Abejorro nativo, grande y peludo, uno de los polinizadores más importantes de Bogotá. Hace vibrar sus músculos de vuelo para calentarse y volar en las mañanas frías de la sabana." },
  { nombre: "Abejorro rojizo de montaña", cientifico: "Bombus rubicundus", familia: "Apidae", orden: "Hymenoptera",
    foto: "img/Bombus rubicundus.jpg", habitats: ["cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Abejorro andino de bosques altoandinos y páramos; su nombre hace referencia a los tonos rojizos de su pelaje. Poliniza plantas nativas de los cerros orientales de Bogotá." },
  { nombre: "Abeja melífera", cientifico: "Apis mellifera", familia: "Apidae", orden: "Hymenoptera",
    foto: "img/Apis melifera.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Abeja introducida que vive en colonias con reina, obreras y zánganos. Produce miel, polen, propóleo y cera, y es clave para la polinización de cultivos." },

  // ---------- Lepidoptera ----------
  { nombre: "Mariposa blanca de la col", cientifico: "Leptophobia aripa", familia: "Pieridae", orden: "Lepidoptera",
    foto: "img/Leptophobia aripa.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Una de las mariposas más comunes de Bogotá. Sus orugas se alimentan de coles, brócoli y otras crucíferas de las huertas urbanas." },
  { nombre: "Blanca andina", cientifico: "Tatochila xanthodice", familia: "Pieridae", orden: "Lepidoptera",
    foto: "img/Tatochila xanthodice.jpg", habitats: ["cerros", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa blanca de alta montaña con las venas de las alas marcadas en oscuro. Vuela en zonas abiertas, páramos y potreros alrededor de Bogotá." },
  { nombre: "Mariposa amarilla andina", cientifico: "Colias dimera", familia: "Pieridae", orden: "Lepidoptera",
    foto: "img/Colias dimera.jpeg", habitats: ["cerros", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa amarillo-anaranjada de vuelo bajo, típica de potreros y pastizales andinos. Se asolea con las alas cerradas para calentarse antes de volar." },
  { nombre: "Amarillita enana", cientifico: "Nathalis plauta", familia: "Pieridae", orden: "Lepidoptera",
    foto: "img/Nathalis plauta.jpg", habitats: ["cerros", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Pequeña mariposa amarilla con manchas negras, de las más diminutas de su familia en los Andes. Frecuente en zonas abiertas y bordes de camino de la sabana de Bogotá." },
  { nombre: "Cola de golondrina negra", cientifico: "Papilio polyxenes americus", familia: "Papilionidae", orden: "Lepidoptera",
    foto: "img/Papilio polyxenes americus.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Gran mariposa negra con bandas amarillas y “colas” en las alas traseras. Sus orugas comen cilantro, perejil, hinojo y zanahoria, por eso aparece en huertas y jardines." },
  { nombre: "Dama pintada andina", cientifico: "Vanessa carye", familia: "Nymphalidae", orden: "Lepidoptera",
    foto: "img/Vanessa carye.jpeg", habitats: ["parques", "cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa anaranjada con manchas negras y blancas, de vuelo rápido. Sus orugas se alimentan de malvas y otras plantas comunes en parques y lotes de Bogotá." },
  { nombre: "Mariposa de la curuba", cientifico: "Dione glycera", familia: "Nymphalidae", orden: "Lepidoptera",
    foto: "img/Dione grycera.jpg", habitats: ["parques", "cultivos", "cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa anaranjada con manchas plateadas en el reverso de las alas. Sus orugas se alimentan de pasifloras como la curuba y la granadilla." },
  { nombre: "Satírida de montaña", cientifico: "Lymanopoda samius", familia: "Nymphalidae", orden: "Lepidoptera",
    foto: "img/Lymanopoda samius.jpg", habitats: ["cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa de tonos oscuros que vuela en los bosques altoandinos de los cerros orientales. Sus orugas se alimentan de gramíneas como el chusque." },
  { nombre: "Satírida naranja andina", cientifico: "Lasiophila circe", familia: "Nymphalidae", orden: "Lepidoptera",
    foto: "img/Lasiophilia cierce.jpg", habitats: ["cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Mariposa de colores pardos y anaranjados de los bosques nublados andinos. Es típica de los senderos de los cerros orientales de Bogotá." },
  { nombre: "Azulita bogotana", cientifico: "Hemiargus hanno bogotana", familia: "Lycaenidae", orden: "Lepidoptera",
    foto: "img/Hemiargus hanno bogotana.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Pequeña mariposa de alas azuladas que vuela cerca del suelo en prados y jardines. Sus orugas se alimentan de flores de leguminosas como el trébol." },
  { nombre: "Mariposa bruja negra", cientifico: "Ascalapha odorata", familia: "Erebidae", orden: "Lepidoptera",
    foto: "img/Ascalapha odorata.jpg", habitats: ["viviendas", "parques"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Gran polilla nocturna de alas oscuras que a veces entra a las casas. Rodeada de mitos, es inofensiva: sus orugas comen hojas de leguminosas." },

  // ---------- Coleoptera ----------
  { nombre: "Cucarrón de mayo", cientifico: "Ancognatha scarabaeoides", familia: "Scarabaeidae", orden: "Coleoptera",
    foto: "img/Ancognatha scarabaeoides.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Escarabajo que aparece en masa con las lluvias y es atraído por las luces de la ciudad. Sus larvas viven bajo el suelo alimentándose de raíces." },
  { nombre: "Chiza", cientifico: "Clavipalpus ursinus", familia: "Scarabaeidae", orden: "Coleoptera",
    foto: "img/Clavipalpus ursinus.jpg", habitats: ["cultivos", "parques"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Su larva blanca en forma de “C” se alimenta de raíces de pastos y cultivos de la sabana. Es, a la vez, alimento de aves y pequeños mamíferos." },
  { nombre: "Gorgojo", cientifico: "Compsus sp.", familia: "Curculionidae", orden: "Coleoptera",
    foto: "img/Compsus sp.jpg", habitats: ["cultivos", "cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Escarabajo de hocico alargado y cuerpo cubierto de escamas. Los adultos comen hojas y las larvas se alimentan de raíces en el suelo." },
  { nombre: "Mariquita roja", cientifico: "Cycloneda sanguinea", familia: "Coccinellidae", orden: "Coleoptera",
    foto: "img/Cycloneda sanguinea.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador"], desarrollo: "holo",
    descripcion: "Mariquita nativa, roja y sin puntos. Larvas y adultos devoran pulgones: es una aliada natural de jardines y huertas." },
  { nombre: "Mariquita arlequín", cientifico: "Harmonia axyridis", familia: "Coccinellidae", orden: "Coleoptera",
    foto: "img/Harmonia axyridis.jpg", habitats: ["parques", "cultivos", "viviendas"], dieta: ["depredador"], desarrollo: "holo",
    descripcion: "Mariquita asiática introducida en Colombia, de colores y puntos muy variables. Es una especie invasora que compite con las mariquitas nativas." },

  // ---------- Orthoptera ----------
  { nombre: "Saltamontes bogotano", cientifico: "Bogotacris sp.", familia: "Acrididae", orden: "Orthoptera",
    foto: "img/Bogotacris sp.jpg", habitats: ["cerros", "cultivos"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Saltamontes de alta montaña cuyo nombre honra a Bogotá. Vive en pastizales y matorrales de los alrededores de la ciudad." },
  { nombre: "Saltamontes de antenas rojas", cientifico: "Agesander ruficornis", familia: "Acrididae", orden: "Orthoptera",
    foto: "img/Agesander ruficornis.jpg", habitats: ["cerros"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Saltamontes de colores llamativos con antenas rojas, como indica su nombre (ruficornis). Habita en la vegetación de los bosques andinos." },

  // ---------- Odonata ----------
  { nombre: "Libélula de los humedales", cientifico: "Rhionaeschna marchali", familia: "Aeshnidae", orden: "Odonata",
    foto: "img/Rhionaeschna marchali.jpg", habitats: ["humedales"], dieta: ["depredador"], desarrollo: "hemi",
    descripcion: "Gran libélula cazadora de los humedales bogotanos. Sus ninfas viven bajo el agua y necesitan agua limpia: son bioindicadores de la salud del humedal." },
  { nombre: "Caballito del diablo andino", cientifico: "Mesamphiagrion laterale", familia: "Coenagrionidae", orden: "Odonata",
    foto: "img/Mesamphiagrion laterale.jpg", habitats: ["humedales"], dieta: ["depredador"], desarrollo: "hemi",
    descripcion: "Pequeño odonato de cuerpo delgado que pliega las alas sobre el abdomen al posarse. Abunda en la vegetación de las orillas de los humedales de Bogotá." },

  // ---------- Diptera ----------
  { nombre: "Mosca doméstica", cientifico: "Musca domestica", familia: "Muscidae", orden: "Diptera",
    foto: "img/Musca domestica.jpg", habitats: ["viviendas", "cultivos"], dieta: ["detritivoro"], desarrollo: "holo",
    dietaNota: "Sus larvas se desarrollan en materia orgánica en descomposición.",
    descripcion: "La mosca más conocida, presente donde hay personas. Ayuda a descomponer residuos orgánicos, pero también puede transportar microorganismos." },
  { nombre: "Zancudo común", cientifico: "Culex sp.", familia: "Culicidae", orden: "Diptera",
    foto: "img/Culex sp.jpg", habitats: ["humedales", "viviendas"], dieta: ["hematofago"], desarrollo: "holo",
    dietaNota: "Solo las hembras pican: necesitan sangre para producir sus huevos. Los machos toman néctar.",
    descripcion: "El zancudo de las noches bogotanas. Sus larvas viven en aguas quietas, desde charcos hasta canales y humedales." },
  { nombre: "Mosca de las flores", cientifico: "Syrphus sp.", familia: "Syrphidae", orden: "Diptera",
    foto: "img/Syrphus sp.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas cazan pulgones; los adultos se alimentan de néctar y polen.",
    descripcion: "Mosca con rayas amarillas y negras que imita a una avispa, pero no pica. Se queda suspendida en el aire frente a las flores." },
  { nombre: "Mosca de las flores rayada", cientifico: "Allograpta sp.", familia: "Syrphidae", orden: "Diptera",
    foto: "img/Allograpta sp.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas cazan pulgones; los adultos se alimentan de néctar y polen.",
    descripcion: "Pequeño sírfido de abdomen alargado con bandas amarillas. Poliniza flores de jardín y sus larvas controlan plagas de forma natural." },
  { nombre: "Sírfido oscuro", cientifico: "Platycheirus sp.", familia: "Syrphidae", orden: "Diptera",
    foto: "img/Platycheirus sp.jpg", habitats: ["parques", "humedales"], dieta: ["depredador", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas cazan pulgones; los adultos se alimentan de néctar y polen.",
    descripcion: "Mosca de las flores de colores oscuros, frecuente en pastos y flores pequeñas. Un polinizador discreto de los ecosistemas andinos." },
  { nombre: "Sírfido de humedal", cientifico: "Lejops sp.", familia: "Syrphidae", orden: "Diptera",
    foto: "img/Lejops ps.jpg", habitats: ["humedales"], dieta: ["detritivoro", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas viven en el agua comiendo materia orgánica; los adultos visitan flores.",
    descripcion: "Mosca de las flores asociada a la vegetación acuática de los humedales. Sus larvas acuáticas respiran por un tubo, como un esnórquel." },

  // ---------- Siphonaptera ----------
  { nombre: "Pulga del perro", cientifico: "Ctenocephalides canis", familia: "Pulicidae", orden: "Siphonaptera",
    foto: "img/Ctenocephalides canis.jpg", habitats: ["viviendas"], dieta: ["hematofago"], desarrollo: "holo",
    descripcion: "Insecto sin alas, aplanado de lado y gran saltador. Los adultos se alimentan de la sangre de perros y otros mamíferos." },

  // ---------- Dermaptera ----------
  { nombre: "Tijereta", cientifico: "Forficula auricularia", familia: "Forficulidae", orden: "Dermaptera",
    foto: "img/Forficula auricularia.jpg", habitats: ["parques", "cultivos", "viviendas"], dieta: ["omnivoro"], desarrollo: "hemi",
    descripcion: "Reconocible por las pinzas al final del abdomen. Es nocturna, se esconde en lugares húmedos y la hembra cuida de sus huevos y crías." },

  // ---------- Zygentoma ----------
  { nombre: "Pececillo de plata", cientifico: "Lepisma saccharina", familia: "Lepismatidae", orden: "Zygentoma",
    foto: "img/Lepisma saccharina.jpg", habitats: ["viviendas"], dieta: ["detritivoro"], desarrollo: "ameta",
    dietaNota: "Come almidones: papel, pegantes, harinas y restos orgánicos.",
    descripcion: "Insecto sin alas, cubierto de escamas plateadas, de un linaje muy antiguo. No tiene metamorfosis: las crías son adultos en miniatura." }
];
