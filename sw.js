const CACHE_NAME = 'obc-student-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => { return cache.add(new Request(OFFLINE_URL, { cache: 'reload' })); }));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((names) => { return Promise.all(names.map((name) => { if (name !== CACHE_NAME) { return caches.delete(name); } })); }));
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request).catch(() => { return caches.match(OFFLINE_URL); }));
    }
});
