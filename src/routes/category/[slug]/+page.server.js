import { redirect } from '@sveltejs/kit';

/**
 * Redirect legacy /category/{slug} URLs to the new /{slug} structure.
 * @param {Object} params
 * @param {Object} params.params - Route parameters
 * @param {string} params.params.slug - Category slug
 */
export async function load({ params }) {
	throw redirect(301, `/${params.slug}`);
}
