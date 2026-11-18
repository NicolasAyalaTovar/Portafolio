# La Colmena — Entomología para todos

Dominio: **lacolmena.site**

Sitio web didáctico de Nicolás Ayala Tovar. HTML, CSS y JavaScript puros: sin dependencias ni compilación.

## Páginas
| Archivo | Contenido |
|---|---|
| `index.html` | Inicio + noticias de entomología en Colombia |
| `entomofauna.html` | Fichas de insectos de Bogotá con fotografía (fotos en `img/`, ruta en `js/datos.js`) |
| `herramientas.html` | Calculadora de biomasa (versión web de `R/Biomass calculator`) y números de Hill (q0, q1, q2) |
| `clave.html` | Clave dicotómica interactiva de órdenes y diccionario etimológico (`js/clave.js`: `PASOS` y `ORDENES`) |
| `proyectos.html` | Proyectos (hotel para abejas e insectos, con tres fotos `img/Hotel para insectos*.jpg`) |
| `juegos.html` | Juego "¿Es un insecto?" y próximos juegos |
| `portafolio.html` | Perfil y proyectos |
| `tienda.html` | Productos de la colmena (próximamente) |
| `privacidad.html`, `terminos.html` | Páginas legales (vacías; solo enlazadas desde el pie de página) |

## Cómo editar
- **Noticias:** `js/datos.js` (arreglo `NOTICIAS`).
- **Especies y leyenda:** `js/especies.js`. Deja la foto en `img/` y añade un bloque con su ruta en `foto`.
- **Buscador (en el encabezado de todas las páginas):** `js/buscador.js`, lo crea `layout.js` (las especies y productos se agregan solos; las demás entradas en `PAGINAS_BUSCABLES`).
- **Juegos por nivel:** paneles `#primaria`, `#bachillerato` y `#pregrado` en `juegos.html`.
- **Collage del inicio:** lista `ELEGIDAS` en `index.html`.
- **Productos:** `js/productos.js`. Los que tengan `masVendido: true` aparecen en el inicio.
- **SEO:** `robots.txt` y `sitemap.xml` (actualiza `lastmod` cuando cambies una página).
- **Menú y pie de página:** `js/layout.js` (arreglo `PAGINAS`).
- **Colores y formas:** variables al inicio de `css/styles.css` (`--miel`, `--abeja`, `--hex-btn`…).
- **Preguntas del juego:** `js/juego.js` (arreglo `PREGUNTAS`).
- **Juego del ciclo de vida:** `js/ciclo.js` (arreglo `ETAPAS`, en orden correcto).
- **La ruta del polen:** `js/polen.js` (`TIPOS` de flor, `SITIOS` del jardín y `POR_TIPO`). Fondo: `img/Fondo juego 3.jpg`.
- **Detective del humedal:** `js/humedal.js` (`FAMILIAS` con puntajes BMWP/Col y `CASOS`).
- **Proyectos del inicio:** arreglo `PROYECTOS` en `js/datos.js` (carrusel).
- **Tienda oculta:** en `js/layout.js` la página tiene `oculta: true`; en `js/buscador.js`, `TIENDA_VISIBLE`. Para mostrarla de nuevo, cambia ambos y vuelve a añadirla al sitemap.
- **Referencias:** sección `<section class="referencias">` con `<ul class="lista-referencias">` al final de cada página (formato APA, orden alfabético).
- **Carga de datos (pegar / subir .csv):** componente común en `js/importar.js`; cada herramienta define sus columnas y su ejemplo (`js/biomasa.js`, `js/diversidad.js`).

## Verlo en tu computador
```bash
python -m http.server 8765 --directory web
```
Luego abre http://localhost:8765

## Publicarlo gratis
Sube la carpeta `web/` a un repositorio de GitHub y activa **GitHub Pages** (Settings → Pages), o arrástrala a Netlify.
