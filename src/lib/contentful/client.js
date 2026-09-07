import { env } from '$env/dynamic/private';

/**
 * @typedef {Object} ContentfulClientOptions
 * @property {boolean} preview - Whether to use preview API
 */

/**
 * Resolve Link objects in a Contentful response using the includes maps.
 * Mirrors the behaviour of the official SDK's automatic link resolution.
 * Depth limit prevents infinite loops from circular references.
 * @param {{ items: Array, includes?: { Entry?: Array, Asset?: Array } }} data
 * @returns {{ items: Array, total: number }}
 */
function resolveResponse(data) {
	const entryMap = /** @type {Record<string, object>} */ ({});
	const assetMap = /** @type {Record<string, object>} */ ({});

	for (const e of data.includes?.Entry || []) entryMap[e.sys.id] = e;
	for (const a of data.includes?.Asset || []) assetMap[a.sys.id] = a;
	for (const e of data.items || []) entryMap[e.sys.id] = e;

	function resolve(value, depth) {
		if (depth > 8 || value === null || typeof value !== 'object') return value;

		if (value.sys?.type === 'Link') {
			const target =
				value.sys.linkType === 'Asset' ? assetMap[value.sys.id] : entryMap[value.sys.id];
			return target ? resolve(target, depth + 1) : value;
		}

		if (Array.isArray(value)) return value.map((v) => resolve(v, depth));

		const out = /** @type {Record<string, unknown>} */ ({});
		for (const k of Object.keys(value)) out[k] = resolve(value[k], depth + 1);
		return out;
	}

	return {
		...data,
		items: (data.items || []).map((item) => resolve(item, 0))
	};
}

/**
 * Creates a Contentful client that uses native fetch (no Axios/SDK).
 * Returns the same getEntries/getEntry interface as the official SDK.
 * @param {ContentfulClientOptions} options
 */
export function getContentfulClient(options = { preview: false }) {
	const space = env.CONTENTFUL_SPACE_ID;
	const environment = env.CONTENTFUL_ENVIRONMENT || 'master';
	const host = options.preview ? 'preview.contentful.com' : 'cdn.contentful.com';
	const token = options.preview
		? env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
		: env.CONTENTFUL_ACCESS_TOKEN;
	const base = `https://${host}/spaces/${space}/environments/${environment}`;
	const headers = {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/vnd.contentful.delivery.v1+json'
	};

	return {
		/** @param {Record<string, unknown>} params */
		async getEntries(params = {}) {
			const qs = new URLSearchParams(
				Object.entries(params).map(([k, v]) => [k, String(v)])
			).toString();
			const res = await fetch(`${base}/entries?${qs}`, { headers });
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(`Contentful getEntries ${res.status}: ${text.slice(0, 200)}`);
			}
			return resolveResponse(await res.json());
		},

		/** @param {string} id */
		async getEntry(id) {
			const res = await fetch(`${base}/entries/${id}`, { headers });
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(`Contentful getEntry ${res.status}: ${text.slice(0, 200)}`);
			}
			return res.json();
		}
	};
}

/**
 * @typedef {Object} Page
 * @property {string} title
 * @property {string} slug
 * @property {Array<Object>} sections
 */

/**
 * @param {string} slug
 * @param {boolean} preview
 * @returns {Promise<Page|null>}
 */
export async function getPageBySlug(slug, preview = false) {
	const client = getContentfulClient({ preview });
	try {
		const response = await client.getEntries({
			content_type: 'page',
			'fields.slug': slug,
			include: 3,
			limit: 1
		});
		return response.items.length > 0 ? response.items[0] : null;
	} catch (error) {
		console.error('Error fetching page:', error);
		throw error;
	}
}

/**
 * @param {boolean} preview
 * @returns {Promise<Array<Page>>}
 */
export async function getAllPages(preview = false) {
	const client = getContentfulClient({ preview });
	try {
		const response = await client.getEntries({ content_type: 'page', include: 1 });
		return response.items;
	} catch (error) {
		console.error('Error fetching pages:', error);
		throw error;
	}
}

/**
 * @param {string} id
 * @param {boolean} preview
 * @returns {Promise<Object|null>}
 */
export async function getNavigationBar(id, preview = false) {
	const client = getContentfulClient({ preview });
	try {
		return await client.getEntry(id);
	} catch (error) {
		console.error('Error fetching navigation bar:', error);
		throw error;
	}
}
