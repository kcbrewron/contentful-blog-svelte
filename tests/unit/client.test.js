/**
 * Unit tests for src/lib/contentful/client.js
 *
 * `getContentfulClient` uses native `fetch` (no SDK), so tests stub the
 * global `fetch` and assert on the request it makes plus how the response
 * is resolved.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getContentfulClient } from '../../src/lib/contentful/client.js';

function jsonResponse(body, ok = true, status = 200) {
	return {
		ok,
		status,
		json: async () => body,
		text: async () => JSON.stringify(body)
	};
}

describe('getContentfulClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('uses the preview host and preview access token when preview is true', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await getContentfulClient({ preview: true }).getEntries({ content_type: 'blogPost' });

		const [url, opts] = fetchMock.mock.calls[0];
		expect(url).toContain('https://preview.contentful.com/');
		expect(opts.headers.Authorization).toBe('Bearer test-preview-token');
	});

	it('uses the CDN host and delivery access token when preview is false', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await getContentfulClient({ preview: false }).getEntries({ content_type: 'blogPost' });

		const [url, opts] = fetchMock.mock.calls[0];
		expect(url).toContain('https://cdn.contentful.com/');
		expect(opts.headers.Authorization).toBe('Bearer test-access-token');
	});

	it('resolves Link objects in items using the includes maps', async () => {
		const category = { sys: { id: 'cat1' }, fields: { name: 'Cloud' } };
		const post = {
			sys: { id: 'post1' },
			fields: { category: { sys: { type: 'Link', linkType: 'Entry', id: 'cat1' } } }
		};
		const fetchMock = vi
			.fn()
			.mockResolvedValue(jsonResponse({ items: [post], includes: { Entry: [category] } }));
		vi.stubGlobal('fetch', fetchMock);

		const response = await getContentfulClient({ preview: false }).getEntries({
			content_type: 'blogPost'
		});

		expect(response.items[0].fields.category.fields.name).toBe('Cloud');
	});

	// Regression test: the Delivery API strips `sys` from every item when a
	// `select` query is used unless `sys` is explicitly included in the list.
	// Previously `getCategoryPostCounts` (and other `select`-based queries)
	// sent `select=fields.category` without `sys`, so every returned item had
	// `item.sys === undefined`. `resolveResponse` then threw while indexing
	// `entryMap[e.sys.id]`, the error was swallowed by the caller's try/catch,
	// and article counts silently came back as `{}` (rendered as "0 articles").
	it('adds sys to the select param so items keep their sys.id', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await getContentfulClient({ preview: false }).getEntries({
			content_type: 'blogPost',
			select: 'fields.category'
		});

		const [url] = fetchMock.mock.calls[0];
		const select = new URL(url).searchParams.get('select');
		expect(select.split(',')).toContain('sys');
	});

	it('does not duplicate sys when the caller already included it', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await getContentfulClient({ preview: false }).getEntries({
			content_type: 'blogPost',
			select: 'sys,fields.category'
		});

		const [url] = fetchMock.mock.calls[0];
		const select = new URL(url).searchParams.get('select');
		expect(select).toBe('sys,fields.category');
	});

	it('does not resolve items without sys.id into a crash (defensive against missing sys)', async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			jsonResponse({ items: [{ fields: { category: { sys: { type: 'Link', id: 'x' } } } }] })
		);
		vi.stubGlobal('fetch', fetchMock);

		await expect(
			getContentfulClient({ preview: false }).getEntries({ content_type: 'blogPost' })
		).resolves.not.toThrow();
	});

	it('throws a descriptive error when the response is not ok', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse('space not found', false, 404));
		vi.stubGlobal('fetch', fetchMock);

		await expect(
			getContentfulClient({ preview: false }).getEntries({ content_type: 'blogPost' })
		).rejects.toThrow(/Contentful getEntries 404/);
	});
});
