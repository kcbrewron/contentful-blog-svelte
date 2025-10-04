import { getBlogPostBySlug } from '$lib/contentful/queries.js';
import { error } from '@sveltejs/kit';

/**
 * Load blog post by slug
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - Blog post slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{post: Object}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	try {
		const post = await getBlogPostBySlug(params.slug, preview);

		if (!post) {
			throw error(404, {
				message: 'Blog post not found'
			});
		}

		return {
			post
		};
	} catch (err) {
		console.error('Error loading blog post:', err);
		throw error(500, {
			message: 'Failed to load blog post'
		});
	}
}
