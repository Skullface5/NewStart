// sw.js – Service Worker for Rosa Fragrances
const CACHE_NAME = 'rosa-products-v2';
const PRODUCTS_URL_PATTERN = /\/rest\/v1\/products/;

// Install event – precache nothing, just log
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate event – clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event – intercept Supabase products API calls
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isProductsRequest = PRODUCTS_URL_PATTERN.test(url) && event.request.method === 'GET';

  if (isProductsRequest) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          // Return cached response immediately, then update cache in background
          event.waitUntil(
            (async () => {
              try {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                  await cache.put(event.request, networkResponse.clone());
                }
              } catch (err) {
                console.warn('[SW] Background fetch failed', err);
              }
            })()
          );
          return cachedResponse;
        }

        // No cache – fetch from network and store
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          event.waitUntil(cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      })()
    );
  }
  // For all other requests, normal fetch (no service worker handling)
});