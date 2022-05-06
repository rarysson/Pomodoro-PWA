let cacheName = 'pomodoro';
let filesToCache = [
	'/Pomodoro-PWA/',
	'/Pomodoro-PWA/index.html',
	'/Pomodoro-PWA/css/style.css',
	'/Pomodoro-PWA/js/main.js',
	'/Pomodoro-PWA/js/localStorage.js',
	'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
	'https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css',
	'https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/fonts/forkawesome-webfont.woff2?v=1.2.0'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => cache.addAll(filesToCache))
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => response || fetch(event.request))
	);
});
