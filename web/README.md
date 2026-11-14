# Hexápoda — Entomología para todos

Sitio web didáctico de Nicolás Ayala Tovar. HTML, CSS y JavaScript puros: sin dependencias ni compilación.

## Páginas
| Archivo | Contenido |
|---|---|
| `index.html` | Inicio + noticias de entomología en Colombia |
| `entomofauna.html` | Fichas de insectos de Bogotá, cada una con un concepto biológico |
| `herramientas.html` | Calculadora de biomasa (versión web de `R/Biomass calculator`) y números de Hill (q0, q1, q2) |
| `juegos.html` | Juego "¿Es un insecto?" y próximos juegos |
| `portafolio.html` | Perfil y proyectos |
| `tienda.html` | Productos de la colmena (próximamente) |

## Cómo editar
- **Noticias y especies:** `js/datos.js` (arreglos `NOTICIAS` y `ESPECIES`).
- **Menú y pie de página:** `js/layout.js` (arreglo `PAGINAS`).
- **Colores y formas:** variables al inicio de `css/styles.css` (`--miel`, `--abeja`, `--hex-btn`…).
- **Preguntas del juego:** `js/juego.js` (arreglo `PREGUNTAS`).
- **Carga de datos (pegar / subir .csv):** componente común en `js/importar.js`; cada herramienta define sus columnas y su ejemplo (`js/biomasa.js`, `js/diversidad.js`).

## Verlo en tu computador
```bash
python -m http.server 8765 --directory web
```
Luego abre http://localhost:8765

## Publicarlo gratis
Sube la carpeta `web/` a un repositorio de GitHub y activa **GitHub Pages** (Settings → Pages), o arrástrala a Netlify.
