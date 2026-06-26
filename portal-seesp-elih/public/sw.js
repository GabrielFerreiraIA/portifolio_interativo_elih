importScripts('/workbox/workbox-sw.js');

if (self.workbox) {
  // Configure Workbox
  self.workbox.setConfig({ debug: false });

  // Precache core static shell files
  self.workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/manifest.webmanifest', revision: '1' },
    { url: '/favicon.svg', revision: '1' },
    { url: '/registrSW.js', revision: '1' },
    { url: '/logos/elih-logo.png', revision: '1' },
    { url: '/icons/icon-192.png', revision: '1' },
    { url: '/icons/icon-512.png', revision: '1' },
    { url: '/icons/icon-maskable-512.png', revision: '1' }
  ]);

  // Cache JS and CSS build assets (Stale-While-Revalidate)
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: 'elih-assets',
    })
  );

  // Cache Flyers (Cache-First, max 50 entries, 30 days)
  self.workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/flyers/'),
    new self.workbox.strategies.CacheFirst({
      cacheName: 'elih-flyers',
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache Google Fonts (Stale-While-Revalidate)
  self.workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
    })
  );

  // Cache Images (Cache-First, max 60 entries, 30 days)
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new self.workbox.strategies.CacheFirst({
      cacheName: 'elih-images',
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // Clean up old caches
  self.workbox.precaching.cleanupOutdatedCaches();

  // Force activation and control clients immediately
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
} else {
  console.log('Workbox failed to load. Falling back to basic cache strategies.');
  
  const CACHE_NAME = 'elih-fallback-cache-v1';
  const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/registrSW.js',
    '/logos/elih-logo.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-512.png'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  });
}
