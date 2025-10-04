import { getAllCategories } from '$lib/contentful/queries.js';

/**
 * Load global data for all pages
 * @returns {Promise<{categories: Array}>}
 */
export async function load() {
	try {
		const categories = await getAllCategories();

		return {
			categories: categories || []
		};
	} catch (error) {
		console.error('Error loading categories:', error);
		return {
			categories: []
		};
	}
}
