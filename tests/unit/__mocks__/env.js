/**
 * Mock for $env/static/private (and $env/dynamic/private via alias) so Vitest
 * can import SvelteKit source files without a full runtime context.
 *
 * These values are intentionally fake — they are never sent to the real
 * Contentful API because the `contentful` package itself is also mocked.
 */
export const env = {
	CONTENTFUL_SPACE_ID: 'test-space-id',
	CONTENTFUL_ACCESS_TOKEN: 'test-access-token',
	CONTENTFUL_PREVIEW_ACCESS_TOKEN: 'test-preview-token',
	CONTENTFUL_ENVIRONMENT: 'master'
};
