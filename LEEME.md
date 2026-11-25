# CUARTO REVUELTO

PWA estática: no necesita servidor ni compilar nada.

## Publicar
- **Netlify:** arrastrá la carpeta `cuarto-revuelto` a app.netlify.com/drop.
- **GitHub Pages:** subí el contenido de la carpeta a un repo → Settings → Pages → rama `main`, carpeta `/ (root)`.

Para instalarla: abrir la URL en la tablet con Chrome → menú ⋮ → *Instalar app* (o *Agregar a pantalla principal*). La primera vez tiene que abrirse con internet; después funciona offline.

## Qué editar
| Quiero cambiar… | Archivo |
|---|---|
| Vidas, pistas, cada cuántos niveles cambia el escenario | `datos.js` → `partida` |
| Curva de dificultad | `datos.js` → `niveles` |
| Objetos, palabras, parecidos, zona donde caen | `datos.js` → `escenarios` |
| Fondos y área de piso | `fondos/` + `fondo` y `piso` en `datos.js` + lista en `sw.js` |
| Imagen de portada | `img/portada.png` (PNG con fondo transparente) |

**Fondos:** diorama con fondo transparente (WEBP o PNG). Se muestra entero y centrado. Con `piso` en `datos.js` marcás el contorno del piso libre donde caen los objetos.

**Si agregás o renombrás archivos:** sumalos a `ARCHIVOS` en `sw.js` y cambiá `VERSION` (por ejemplo `v1` → `v2`). Si solo editás `datos.js`, no hace falta: el cambio llega solo la segunda vez que abren la app con internet.

## Fuentes
Lilita One (títulos) y Andika (palabras; está diseñada para chicos que aprenden a leer). Son de Google Fonts (licencia SIL OFL) y están guardadas dentro de `fuentes/`, así funcionan sin internet.

## Ajustes
El engranaje de la pantalla de inicio permite activar o desactivar la lectura en voz alta y borrar el récord (pide confirmación).
