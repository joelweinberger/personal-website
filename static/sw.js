console.log("Running ServiceWorker");

importScripts('/js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'site-cache-v1';
var urlsToCache = [
	'/css/generic/basic-page.css',
	'/css/generic/header.css',
	'/css/page/index.css',
	'/img/greetings from newark.jpg',
	'/img/joel-weinberger-headshot.jpg'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			}));
});

self.addEventListener('fetch', function(event) {
	if (navigator.onLine) {
		event.respondWith(fetch(event.request));
		return;
	}

	// The offline case
	event.respondWith(caches.match('img/joel-weinberger-headshot.jpg')
		.then(function(response) {
			if (response) {
				return response;
			}

			var fetchRequest = event.request.clone();

			return fetch(fetchRequest).then(
				function(response) {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					var responseToCache = response.clone();
					caches.open(CACHE_NAME)
						.then(function(cache) {
							cache.put(event.request, responseToCache);
						});
					return response;
				}
			);
		}))
});
