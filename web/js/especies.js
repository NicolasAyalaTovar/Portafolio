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
    Hemiptera:    { emoji: "🐛", comun: "chinches, pulgones, chicharritas y escamas" },
    Thysanoptera: { emoji: "🐛", comun: "trips" },
    Neuroptera:   { emoji: "🐛", comun: "crisopas" },
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
  { nombre: "Avispa sierra del sauce", cientifico: "Euura respondens", familia: "Tenthredinidae", orden: "Hymenoptera",
    foto: "img/Euura respondens.jpg", habitats: ["humedales", "parques"], dieta: ["herbivoro"], desarrollo: "holo",
    dietaNota: "Sus larvas, parecidas a orugas, se comen las hojas de los sauces.",
    descripcion: "Pariente de las abejas y avispas, pero sin aguijón. La hembra usa su ovipositor en forma de sierra para poner los huevos dentro de las hojas del sauce." },

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
  { nombre: "Polilla diurna andina", cientifico: "Drymoea veliterna", familia: "Geometridae", orden: "Lepidoptera",
    foto: "img/Drymoea veliterna.jpg", habitats: ["cerros"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Polilla de colores vistosos que vuela de día en los bosques y páramos andinos. Sus orugas son “medidoras”: avanzan arqueando el cuerpo como si midieran el camino." },

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
  { nombre: "Escarabajos de las hojas", cientifico: "Chrysomelidae", familia: "Chrysomelidae", orden: "Coleoptera",
    foto: "img/Chrysomelidae.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "holo",
    descripcion: "Una de las familias de escarabajos más diversas, muchas veces de colores metálicos o brillantes. Adultos y larvas comen hojas, por eso se ven agujeros en las plantas donde viven." },
  { nombre: "Mariquita roja", cientifico: "Cycloneda sanguinea", familia: "Coccinellidae", orden: "Coleoptera",
    foto: "img/Cycloneda sanguinea.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador"], desarrollo: "holo",
    descripcion: "Mariquita nativa, roja y sin puntos. Larvas y adultos devoran pulgones: es una aliada natural de jardines y huertas." },
  { nombre: "Mariquita grande andina", cientifico: "Neda norrisi", familia: "Coccinellidae", orden: "Coleoptera",
    foto: "img/Neda norrisi.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador"], desarrollo: "holo",
    descripcion: "Una de las mariquitas más grandes de la sabana de Bogotá. Nativa de los Andes, controla pulgones en jardines, parques y huertas." },
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

  // ---------- Hemiptera ----------
  { nombre: "Pulgones", cientifico: "Aphididae", familia: "Aphididae", orden: "Hemiptera",
    foto: "img/Aphididae.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "hemi",
    dietaNota: "Chupan la savia de las plantas y expulsan melaza, un líquido dulce que atrae hormigas.",
    descripcion: "Pequeños insectos de cuerpo blando que forman colonias en tallos y hojas. Muchas hembras tienen crías sin necesidad de machos (partenogénesis), por eso se multiplican tan rápido." },
  { nombre: "Chicharritas", cientifico: "Cicadellidae", familia: "Cicadellidae", orden: "Hemiptera",
    foto: "img/Cicadellidae.jpg", habitats: ["parques", "cultivos"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Insectos pequeños y alargados que saltan con gran agilidad cuando se les toca. Chupan la savia de pastos, arbustos y cultivos." },
  { nombre: "Membrácido anaranjado", cientifico: "Heranice sp.", familia: "Membracidae", orden: "Hemiptera",
    foto: "img/Heranice sp.jpg", habitats: ["parques", "cerros"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Membrácido de alas anaranjadas con venas oscuras. Los membrácidos se alimentan de savia y son famosos por las formas sorprendentes de su pronoto." },
  { nombre: "Espinita amarilla", cientifico: "Aconophora elongatiformis", familia: "Membracidae", orden: "Hemiptera",
    foto: "img/Aconophora elongatiformis.jpg", habitats: ["parques"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "También llamada “periquito”, tiene el pronoto prolongado en forma de espina. Vive en grupos sobre árboles del arbolado urbano, como el flor amarillo, de cuya savia se alimenta." },
  { nombre: "Escama de cera", cientifico: "Ceroplastes mosquerai", familia: "Coccidae", orden: "Hemiptera",
    foto: "img/Ceroplastes mosquerai.jpg", habitats: ["parques"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Las hembras viven fijas en ramas y hojas, protegidas por una gruesa capa de cera. Chupan la savia de los árboles urbanos y pueden debilitarlos cuando sus poblaciones crecen." },
  { nombre: "Chinche de encaje", cientifico: "Corythucha sp.", familia: "Tingidae", orden: "Hemiptera",
    foto: "img/Corythucha sp.jpg", habitats: ["parques"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Diminuta chinche con alas y pronoto transparentes que parecen un encaje. Vive en el envés de las hojas de los árboles, que se ven decoloradas por su alimentación." },
  { nombre: "Chinche del aguacate", cientifico: "Monalonion velezangeli", familia: "Miridae", orden: "Hemiptera",
    foto: "img/Monalonion velezangeli.jpg", habitats: ["cultivos", "parques"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Chinche de cuerpo delgado y colores llamativos. Se alimenta de brotes y frutos de plantas como el aguacate, y también ataca árboles urbanos como el falso pimiento." },

  // ---------- Thysanoptera ----------
  { nombre: "Trips de los invernaderos", cientifico: "Heliothrips haemorrhoidalis", familia: "Thripidae", orden: "Thysanoptera",
    foto: "img/Heliothrips haemorrhoidalis.jpg", habitats: ["cultivos", "parques"], dieta: ["herbivoro"], desarrollo: "hemi",
    descripcion: "Insecto de apenas 1 a 2 mm con alas en forma de pluma. Raspa las hojas y chupa su contenido, dejándolas plateadas; es común en invernaderos y jardines." },

  // ---------- Neuroptera ----------
  { nombre: "Crisopa", cientifico: "Chrysoperla sp.", familia: "Chrysopidae", orden: "Neuroptera",
    foto: "img/Chrysoperla sp.jpg", habitats: ["parques", "cultivos"], dieta: ["depredador", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas, llamadas “leones de los pulgones”, devoran pulgones; los adultos comen néctar, polen y melaza.",
    descripcion: "Insecto verde de alas transparentes y ojos dorados. Pone sus huevos sobre finos tallitos para protegerlos, y es muy usado en control biológico." },

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
  { nombre: "Mosca de la humedad", cientifico: "Psychodidae", familia: "Psychodidae", orden: "Diptera",
    foto: "img/Psychodidae.jpg", habitats: ["viviendas"], dieta: ["detritivoro"], desarrollo: "holo",
    dietaNota: "Sus larvas viven en desagües y lugares húmedos, comiendo materia orgánica.",
    descripcion: "Pequeña mosca peluda con alas en forma de corazón que se ve en baños y cocinas. Es inofensiva e indica que hay humedad o desagües con residuos." },
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
  { nombre: "Sírfido avispa", cientifico: "Mimocalla giganteus", familia: "Syrphidae", orden: "Diptera",
    foto: "img/Mimocalla giganteus.jpeg", habitats: ["parques", "cerros"], dieta: ["depredador", "herbivoro"], desarrollo: "holo",
    dietaNota: "Las larvas cazan pequeños insectos; los adultos se alimentan de néctar y polen.",
    descripcion: "Mosca de las flores de abdomen largo y cintura estrecha, con manchas oscuras en las alas: imita a una avispa para que sus depredadores la eviten." },
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
