// See https://kit.svelte.dev/docs/service-workers for more information
self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', () => {
	self.clients.claim();
});
