
const cacheName = "whitenoisecache";

const cachedResources = [
    "index.html",
    "site.js",
    "site.css",
    "icon.png",
    "manifest.json"
]

self.addEventListener('install', (e) => {
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(cachedResources);
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) {
            return cachedResponse;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
    })());
});