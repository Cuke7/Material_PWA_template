"use strict";

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v2";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles/my-theme.css",
    "/styles/style.css",
    "/scripts/app.js",
    "/scripts/install.js",
    "/icons/favicon.ico",
    "/icons/maskable_icon.png"
];

self.addEventListener("install", (evt) => {
    console.log("[ServiceWorker] Install");
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Pre-caching offline page");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
    console.log("[ServiceWorker] Activate");
    // Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("[ServiceWorker] Removing old cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
    console.log("[ServiceWorker] Fetch", evt.request.url);
    if (evt.request.url.includes("/reqres.in/api/products/3")) {
        //console.log("[Service Worker] Fetch (data)", evt.request.url);
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(evt.request)
                    .then((response) => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch((err) => {
                        return cache.match(evt.request);
                    });
            })
        );
        return;
    }
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            });
        })
    );
});

// Notifications code
/*
self.addEventListener("push", function (event) {
    console.log("[Service Worker] Push Received.");
    console.log(`[Service Worker] Push had this data 2: "${event.data.text()}"`);

    const title = "Notification title";
    const options = {
        body: event.data.text(),
        icon: "images/icon.png",
        badge: "images/badge.svg",
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    console.log("[Service Worker] Notification click received.");
    event.notification.close();
    event.waitUntil(clients.openWindow("https://google.com"));
});
*/
