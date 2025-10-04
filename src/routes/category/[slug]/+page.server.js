import { getCategoryBySlug, getPostsByCategory } from '$lib/contentful/queries.js';
import { error } from '@sveltejs/kit';

/**
 * Load category and its posts
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - Category slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{category: Object, posts: Array}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	try {
		const category = await getCategoryBySlug(params.slug, preview);

		if (!category) {
			throw error(404, {
				message: 'Category not found'
			});
		}

		// Fetch all posts in this category
		const posts = await getPostsByCategory(category.sys.id, preview);

		return {
			category,
			posts
		};
	} catch (err) {
		console.error('Error loading category:', err);
		throw error(500, {
			message: 'Failed to load category'
		});
	}
}
