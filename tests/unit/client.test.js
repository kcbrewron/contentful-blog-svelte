/**
 * Unit tests for src/lib/contentful/client.js
 *
 * The Contentful SDK (`contentful` package) is mocked so no real network
 * calls are ever made.  The only thing being verified here is that
 * `getContentfulClient` calls `createClient` with the correct arguments
 * depending on whether preview mode is requested.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock the `contentful` package before importing any source module that uses it
// ---------------------------------------------------------------------------
vi.mock('contentful', () => {
	// `createClient` is the sole function we need to spy on.
	// It returns a plain object that acts as a stand-in for the real client.
	const createClient = vi.fn(() => ({ _isMockClient: true }));
	return { createClient };
});

// Import AFTER vi.mock so the hoisted mock is already in place.
import { createClient } from 'contentful';
import { getContentfulClient } from '../../src/lib/contentful/client.js';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getContentfulClient', () => {
	beforeEach(() => {
		// Reset call history between tests so assertions are always fresh.
		vi.clearAllMocks();
	});

	it('uses the preview host and preview access token when preview is true', () => {
		// Calling with explicit `preview: true` should select the preview
		// CDN endpoint and the preview-specific access token.
		getContentfulClient({ preview: true });

		expect(createClient).toHaveBeenCalledOnce();

		const calledWith = createClient.mock.calls[0][0];
		expect(calledWith.host).toBe('preview.contentful.com');
		expect(calledWith.accessToken).toBe('test-preview-token');
		expect(calledWith.space).toBe('test-space-id');
		expect(calledWith.environment).toBe('master');
	});

	it('uses the CDN host and delivery access token when preview is false', () => {
		// Calling with explicit `preview: false` should select the production
		// CDN endpoint and the standard delivery token.
		getContentfulClient({ preview: false });

		expect(createClient).toHaveBeenCalledOnce();

		const calledWith = createClient.mock.calls[0][0];
		expect(calledWith.host).toBe('cdn.contentful.com');
		expect(calledWith.accessToken).toBe('test-access-token');
		expect(calledWith.space).toBe('test-space-id');
		expect(calledWith.environment).toBe('master');
	});

	it('defaults to the CDN (non-preview) host when called with no arguments', () => {
		// The function signature is `getContentfulClient(options = { preview: false })`,
		// so omitting the argument should behave identically to passing `{ preview: false }`.
		getContentfulClient();

		expect(createClient).toHaveBeenCalledOnce();

		const calledWith = createClient.mock.calls[0][0];
		expect(calledWith.host).toBe('cdn.contentful.com');
		expect(calledWith.accessToken).toBe('test-access-token');
	});

	it('returns the value produced by createClient', () => {
		// `getContentfulClient` is a thin factory — it should pass the return
		// value of `createClient` straight back to the caller.
		const result = getContentfulClient({ preview: false });
		expect(result).toEqual({ _isMockClient: true });
	});
});
