// sw.js – improved version that caches all product requests under a single key
const CACHE_NAME = 'rosa-products-v3';
const PRODUCTS_URL_PATTERN = /\/rest\/v1\/products/;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (PRODUCTS_URL_PATTERN.test(url) && event.request.method === 'GET') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        // Use a single cache key for all product requests (strip query parameters)
        const cacheKey = '/rest/v1/products';
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
          // Return cached response immediately, refresh in background
          event.waitUntil(
            (async () => {
              try {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                  // Update cache with fresh data (still using same cacheKey)
                  await cache.put(cacheKey, networkResponse.clone());
                }
              } catch (err) { console.warn('Background fetch failed', err); }
            })()
          );
          return cachedResponse;
        }

        // First time – fetch and store
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          await cache.put(cacheKey, networkResponse.clone());
        }
        return networkResponse;
      })()
    );
  }
});