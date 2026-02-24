const CACHE_VERSION = 'v3';
const CACHE_NAME = `offline-pay-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// ============================================================
// INSTALL — pre-cache all static shell assets
// ============================================================
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// ============================================================
// ACTIVATE — delete ALL old cache versions immediately
// ============================================================
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// ============================================================
// FETCH strategy:
//   - API calls (/api/*) → Network Only (never cache sensitive data)
//   - Navigate requests → Network first, fallback to /index.html
//   - Everything else  → Network first, then cache fallback (stale-while-revalidate)
// ============================================================
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // Never intercept non-GET or API requests – let them go to network directly
    if (e.request.method !== 'GET') return;
    if (url.pathname.startsWith('/api/')) return;

    // Chrome extension urls — ignore
    if (url.protocol === 'chrome-extension:') return;

    // SPA navigation — network first, fallback to cached index.html
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Static assets — network first, update cache, then cache fallback
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});

// ============================================================
// BACKGROUND SYNC — sync offline transactions when back online
// ============================================================
self.addEventListener('sync', (e) => {
    if (e.tag === 'sync-offline-transactions') {
        e.waitUntil(
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'SYNC_REQUESTED' });
                });
            })
        );
    }
});

// ============================================================
// PUSH NOTIFICATIONS (scaffold — extend when backend adds push)
// ============================================================
self.addEventListener('push', (e) => {
    const data = e.data ? e.data.json() : {};
    e.waitUntil(
        self.registration.showNotification(data.title || 'OfflinePay', {
            body: data.body || 'You have a new notification.',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'offlinepay-notification',
            renotify: true
        })
    );
});

self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        self.clients.openWindow('/')
    );
});
