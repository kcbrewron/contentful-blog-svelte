import { getBlogPostBySlug } from '$lib/contentful/queries.js';
import { error } from '@sveltejs/kit';

/**
 * Load blog post by category and article slug
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.categorySlug - Category slug
 * @param {string} params.params.articleSlug - Article slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{post: Object}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	const post = await getBlogPostBySlug(params.articleSlug, preview);

	if (!post) {
		throw error(404, { message: 'Article not found' });
	}

	// Validate the article belongs to the requested category
	const postCategorySlug = post.fields.category?.fields?.slug;
	if (postCategorySlug !== params.categorySlug) {
		throw error(404, { message: 'Article not found in this category' });
	}

	return { post };
}
