// Service worker for the installable apps (NICS Trading, NICS Video).
// Deliberately caches nothing but the offline page: every page, script and
// API call still goes to the network, so a new deploy is live on the next
// open and nobody gets stuck on a stale build. When the network is down, a
// page navigation shows offline.html instead of the browser's error screen.
const CACHE = "nics-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" }))),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL, { cacheName: CACHE })),
  );
});
