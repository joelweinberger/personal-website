console.log("Running ServiceWorker");

importScripts('/js/serviceworker-cache-polyfill.js');

var CACHE_VERSION = 'v2';
var CACHE_NAME = 'joelweinberger.us-cache-v2';
var urlsToCache = [
	'/',
	'/index.html',
	'/publications.html',
	'/css/generic/basic-page.css',
	'/css/generic/header.css',
	'/css/page/index.css',
	'/img/greetings from newark.jpg',
	'/img/joel-weinberger-headshot.jpg',
	'/offline.html'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(urlsToCache);
			}));
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request)
		.then(function(response) {
			var request = event.request;
			var fetchRequest = request.clone();
			var fetchResult = fetch(fetchRequest).then(
				function(response) {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					var responseToCache = response.clone();
					caches.open(CACHE_NAME)
						.then(function(cache) {
							cache.put(request, responseToCache);
						});
					return response;
				}
			).catch(function() {
				console.log("Failed to fetch " + fetchRequest.url);
				return caches.match('/offline.html');
			});

			if (response) {
				return response;
			}

			return fetchResult;
		}))
});
