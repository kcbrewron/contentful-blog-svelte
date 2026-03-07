import { getBlogPostBySlug, getPostsByCategory } from '$lib/contentful/queries.js';
import { error } from '@sveltejs/kit';

/**
 * Load blog post and related posts from the same category
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.categorySlug - Category slug
 * @param {string} params.params.articleSlug - Article slug
 * @param {Object} params.url - Request URL
 * @returns {Promise<{post: Object, relatedPosts: Array}>}
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	const post = await getBlogPostBySlug(params.articleSlug, preview);

	if (!post) {
		throw error(404, { message: 'Article not found' });
	}

	const postCategorySlug = post.fields.category?.fields?.slug;
	if (postCategorySlug !== params.categorySlug) {
		throw error(404, { message: 'Article not found in this category' });
	}

	const categoryId = post.fields.category?.sys?.id;
	const allCategoryPosts = categoryId ? await getPostsByCategory(categoryId, preview) : [];
	const relatedPosts = allCategoryPosts
		.filter((p) => p.sys.id !== post.sys.id)
		.slice(0, 3);

	return { post, relatedPosts };
}
