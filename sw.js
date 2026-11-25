/* Service worker: guarda todo para jugar sin internet.
   Si agregás o renombrás archivos (por ejemplo tus fondos .jpg),
   sumalos a ARCHIVOS y subí el número de VERSION. */
const VERSION = "cuarto-revuelto-v3";
const ARCHIVOS = [
  "./",
  "index.html",
  "datos.js",
  "manifest.webmanifest",
  "css/estilos.css",
  "js/sonidos.js",
  "js/juego.js",
  "fuentes/lilita-one.woff2",
  "fuentes/andika-400.woff2",
  "fuentes/andika-700.woff2",
  "img/portada.png",
  "iconos/icono-192.png",
  "iconos/icono-512.png",
  "iconos/icono-maskable-512.png",
  "iconos/apple-touch-icon.png",
  "fondos/cuarto.webp",
  "fondos/cocina.webp",
  "fondos/plaza.webp",
  "fondos/playa.webp",
  "fondos/granja.webp",
  "fondos/bano.webp",
  "fondos/aula.webp",
  "fondos/supermercado.webp",
  "fondos/bosque.webp",
  "fondos/zoologico.webp"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Responde al instante desde la copia guardada y, si hay internet,
   la actualiza por detrás (así tus cambios en datos.js llegan solos). */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const guardado = await cache.match(e.request, { ignoreSearch: true });
      const deRed = fetch(e.request)
        .then((resp) => { if (resp && resp.ok) cache.put(e.request, resp.clone()); return resp; })
        .catch(() => guardado);
      return guardado || deRed;
    })
  );
});
