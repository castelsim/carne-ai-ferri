/* Service worker — cache statica per uso offline/installata.
   IMPORTANTE: a ogni release incrementare VERSIONE insieme al
   query string ?v= in index.html. */
const VERSIONE = "20260712c";
const CACHE = `carneaiferri-${VERSIONE}`;

const PRECACHE = [
  "./",
  "index.html",
  `style.css?v=${VERSIONE}`,
  `script.js?v=${VERSIONE}`,
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: false }).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return res;
      }).catch(() =>
        e.request.mode === "navigate" ? caches.match("index.html") : Response.error()
      )
    )
  );
});
