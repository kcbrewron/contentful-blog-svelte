import { getAllCategories } from '$lib/contentful/queries.js';

/**
 * Load global data for all pages
 * @param {{ platform?: { env?: { TURNSTILE_SITE_KEY?: string } } }} event
 * @returns {Promise<{categories: Array, turnstileSiteKey: string}>}
 */
export async function load({ platform }) {
	try {
		const categories = await getAllCategories();

		return {
			categories: categories || [],
			turnstileSiteKey: platform?.env?.TURNSTILE_SITE_KEY ?? ''
		};
	} catch (error) {
		console.error('Error loading categories:', error);
		return {
			categories: [],
			turnstileSiteKey: platform?.env?.TURNSTILE_SITE_KEY ?? ''
		};
	}
}
