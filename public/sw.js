const CACHE_NAME = 'taskflow-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/vite.svg'
];

// Kill switch: If we need to disable the service worker entirely
const DISABLED = true;

self.addEventListener('install', (event) => {
  if (DISABLED) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  if (DISABLED) {
    event.waitUntil(
      self.registration.unregister().then(() => self.clients.matchAll()).then((clients) => {
        clients.forEach(client => client.navigate(client.url));
      })
    );
    return;
  }
});

self.addEventListener('fetch', (event) => {
  if (DISABLED) return;

  const url = new URL(event.request.url);

  // Skip API requests, non-GET requests, and browser extensions
  if (
    url.pathname.startsWith('/api/') || 
    event.request.method !== 'GET' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // Skip Vite HMR and development files
  if (url.pathname.includes('@vite') || url.pathname.includes('@react-refresh')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch((err) => {
        console.warn('[SW] Fetch failed for:', event.request.url);
        // We could return a custom offline page here
        return null;
      });
    })
  );
});
