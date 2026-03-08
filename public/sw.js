/// <reference lib="webworker" />
// Service Worker for asset-level caching
// Ensures 10K concurrent users only hit edge for initial payload

const CACHE_NAME = "devforge-v1";
const STATIC_ASSETS = ["/", "/index.html"];

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  sw.skipWaiting();
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  sw.clients.claim();
});

sw.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension, data, etc.
  if (!request.url.startsWith("http")) return;

  // Skip ad requests
  if (request.url.includes("googlesyndication") || request.url.includes("doubleclick")) return;

  // Stale-while-revalidate for assets
  if (
    request.url.includes("/assets/") ||
    request.url.endsWith(".js") ||
    request.url.endsWith(".css") ||
    request.url.endsWith(".woff2") ||
    request.url.endsWith(".woff")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached as Response);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Network-first for HTML (SPA routes)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html") as Promise<Response>)
    );
    return;
  }
});
