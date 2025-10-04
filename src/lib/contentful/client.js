import { createClient } from 'contentful';
import { env } from '$env/dynamic/private';

/**
 * @typedef {Object} ContentfulClientOptions
 * @property {boolean} preview - Whether to use preview API
 */

/**
 * Creates a Contentful client instance
 * @param {ContentfulClientOptions} options - Client configuration options
 * @returns {import('contentful').ContentfulClientApi} Contentful client
 */
function getContentfulClient(options = { preview: false }) {
	return createClient({
		space: env.CONTENTFUL_SPACE_ID,
		accessToken: options.preview ? env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : env.CONTENTFUL_ACCESS_TOKEN,
		environment: env.CONTENTFUL_ENVIRONMENT || 'master',
		host: options.preview ? 'preview.contentful.com' : 'cdn.contentful.com'
	});
}

/**
 * @typedef {Object} Page
 * @property {string} title
 * @property {string} slug
 * @property {Array<Object>} sections
 * @property {Object} [navigationBar]
 * @property {Object} [seoMetadata]
 */

/**
 * Fetches a page by slug
 * @param {string} slug - Page slug
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Page|null>} Page data or null if not found
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

		if (response.items.length === 0) {
			return null;
		}

		return response.items[0];
	} catch (error) {
		console.error('Error fetching page:', error);
		throw error;
	}
}

/**
 * Fetches all pages
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array<Page>>} Array of pages
 */
export async function getAllPages(preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'page',
			include: 1
		});

		return response.items;
	} catch (error) {
		console.error('Error fetching pages:', error);
		throw error;
	}
}

/**
 * Fetches navigation bar
 * @param {string} id - Navigation bar ID
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Object|null>} Navigation bar data
 */
export async function getNavigationBar(id, preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const entry = await client.getEntry(id);
		return entry;
	} catch (error) {
		console.error('Error fetching navigation bar:', error);
		throw error;
	}
}

export { getContentfulClient };
