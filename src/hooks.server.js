// Cloudflare Workers rejects fetch({ cache: 'default' }) — strip it so the
// Contentful SDK (which uses Axios with that default) works on the edge.
const _originalFetch = globalThis.fetch;
globalThis.fetch = function (url, init) {
	if (init?.cache === 'default') {
		const { cache: _cache, ...rest } = init;
		return _originalFetch.call(this, url, rest);
	}
	return _originalFetch.call(this, url, init);
};

// See https://kit.svelte.dev/docs/hooks#server-hooks for more information
export const handle = async ({ event, resolve }) => {
	return resolve(event);
};
