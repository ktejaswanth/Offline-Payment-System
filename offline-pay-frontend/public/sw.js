const CACHE_NAME = 'offline-pay-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// Install event: cache static assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: network first, then cache
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Cache new assets on the fly
                const r = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, r);
                });
                return response;
            })
            .catch(() => {
                // Fallback to cache if offline
                return caches.match(e.request).then((response) => {
                    if (response) return response;
                    // If we are looking for a page and it's not in cache, returning index.html for SPA routing
                    if (e.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
