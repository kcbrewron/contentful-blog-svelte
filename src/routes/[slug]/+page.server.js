import { getPageBySlug } from '$lib/contentful/client.js';
import { error } from '@sveltejs/kit';

/**
 * @typedef {Object} PageData
 * @property {Object} page - The page content from Contentful
 */

/**
 * Load page data by slug
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - Page slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<PageData>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	try {
		const page = await getPageBySlug(params.slug, preview);

		if (!page) {
			throw error(404, {
				message: 'Page not found'
			});
		}

		return {
			page
		};
	} catch (err) {
		console.error('Error loading page:', err);
		throw error(500, {
			message: 'Failed to load page content'
		});
	}
}
