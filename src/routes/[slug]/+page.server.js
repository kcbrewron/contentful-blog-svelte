import { getCategoryBySlug, getPostsByCategory } from '$lib/contentful/queries.js';
import { getPageBySlug } from '$lib/contentful/client.js';
import { error } from '@sveltejs/kit';

/**
 * Load a category landing page or a generic Contentful page by slug.
 * Categories take precedence — if the slug matches a category it renders
 * the category landing; otherwise falls back to a generic page entry.
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - URL slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{type: 'category', category: Object, posts: Array}|{type: 'page', page: Object}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	// Try as a category first
	const category = await getCategoryBySlug(params.slug, preview);
	if (category) {
		const posts = await getPostsByCategory(category.sys.id, preview);
		return { type: 'category', category, posts };
	}

	// Fall back to a generic Contentful page
	const page = await getPageBySlug(params.slug, preview);
	if (page) {
		return { type: 'page', page };
	}

	throw error(404, { message: 'Not found' });
}
