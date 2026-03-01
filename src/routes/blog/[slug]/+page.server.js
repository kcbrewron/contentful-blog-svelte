import { getBlogPostBySlug } from '$lib/contentful/queries.js';
import { error, redirect } from '@sveltejs/kit';

/**
 * Redirect legacy /blog/{slug} URLs to the new /{categorySlug}/{slug} structure.
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - Post slug
 * @param {Object} params.url - Request URL
 */
export async function load({ params, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	const post = await getBlogPostBySlug(params.slug, preview);

	if (!post) {
		throw error(404, { message: 'Blog post not found' });
	}

	const categorySlug = post.fields.category?.fields?.slug;
	if (!categorySlug) {
		throw error(404, { message: 'Blog post has no category' });
	}

	const newUrl = `/${categorySlug}/${params.slug}${preview ? '?preview=true' : ''}`;
	throw redirect(301, newUrl);
}
