import {
	getRecentPosts,
	getAllCategories,
	getCategoryPostCounts,
	getPostsByCategory
} from '$lib/contentful/queries.js';
import { fail } from '@sveltejs/kit';
import { generateToken } from '$lib/subscribe/tokens.js';
import { verifyTurnstile, TURNSTILE_ALWAYS_PASSES_SECRET } from '$lib/subscribe/turnstile.js';
import { sendConfirmationEmail } from '$lib/subscribe/email.js';
import { VALID_TOPIC_SLUGS } from '$lib/subscribe/topics.js';

/**
 * Load homepage content
 * @param {Object} params
 * @param {Object} params.url - Request URL
 * @returns {Promise<{ recentPosts: Array, categories: Array, categoryPostCounts: Object, categoryPosts: Object }>}
 */
export async function load({ url }) {
	const preview = url.searchParams.get('preview') === 'true';

	try {
		// Fetch recent posts and categories first
		const [recentPosts, categories, categoryPostCounts] = await Promise.all([
			getRecentPosts(12, preview),
			getAllCategories(preview),
			getCategoryPostCounts(preview)
		]);

		// Fetch posts for each category
		const categoryPostsPromises = categories.map(async (category) => {
			const posts = await getPostsByCategory(category.sys.id, preview);
			return {
				categoryId: category.sys.id,
				posts: posts.slice(0, 2) // Limit to 2 posts per category
			};
		});

		const categoryPostsArray = await Promise.all(categoryPostsPromises);

		// Convert to object keyed by category ID
		const categoryPosts = {};
		categoryPostsArray.forEach(({ categoryId, posts }) => {
			categoryPosts[categoryId] = posts;
		});

		// Extract featured images from recent posts (up to 4 for collage)
		const featuredImages = recentPosts
			.slice(0, 4)
			.map((post) => {
				const file = post.fields.featuredImage?.fields?.file;
				if (!file?.url) return null;
				return {
					url: file.url,
					width: file.details?.image?.width ?? null,
					height: file.details?.image?.height ?? null
				};
			})
			.filter(Boolean);

		// Calculate total article count
		const totalArticleCount = Object.values(categoryPostCounts).reduce((sum, count) => sum + count, 0);

		return {
			recentPosts: recentPosts || [],
			categories: categories || [],
			categoryPostCounts: categoryPostCounts || {},
			categoryPosts: categoryPosts || {},
			featuredImages: featuredImages || [],
			totalArticleCount
		};
	} catch (error) {
		console.error('Error loading homepage:', error);
		return {
			recentPosts: [],
			categories: [],
			categoryPostCounts: {},
			categoryPosts: {},
			featuredImages: []
		};
	}
}

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
	/**
	 * Handles newsletter subscription form submission.
	 * Validates Turnstile, inserts a pending subscriber into D1,
	 * and sends a double opt-in confirmation email.
	 */
	subscribe: async ({ request, platform }) => {
		const env = platform?.env;
		const formData = await request.formData();

		const email = /** @type {string} */ (formData.get('email') ?? '').trim().toLowerCase();
		const rawTopics = formData.getAll('topics').map(String);
		const turnstileToken = /** @type {string} */ (formData.get('cf-turnstile-response') ?? '');
		const ip = request.headers.get('CF-Connecting-IP');

		// Validate email format
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(422, { error: 'Please enter a valid email address.' });
		}

		// Filter to known slugs only
		const selectedTopics = rawTopics.filter((t) => VALID_TOPIC_SLUGS.has(t));
		if (selectedTopics.length === 0) {
			return fail(422, { error: 'Please select at least one topic.' });
		}

		// Verify Turnstile (skip in local dev when the always-passes test secret is used)
		if (env?.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY !== TURNSTILE_ALWAYS_PASSES_SECRET) {
			const valid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
			if (!valid) {
				return fail(422, { error: 'Security check failed. Please try again.' });
			}
		}

		// D1 is only available in the Cloudflare runtime
		if (!env?.SUBSCRIBERS_DB) {
			console.warn('SUBSCRIBERS_DB not available — subscribe action skipped in local dev');
			return { success: true };
		}

		try {
			const id = generateToken();
			const confirmationToken = generateToken();
			const unsubscribeToken = generateToken();

			// Atomic UPSERT: insert new subscriber, or update confirmation token for pending re-subscribe.
			// The WHERE clause prevents overwriting a confirmed subscriber (meta.changes === 0 in that case).
			const result = await env.SUBSCRIBERS_DB.prepare(
				`INSERT INTO subscribers (id, email, topics, confirmation_token, unsubscribe_token)
				 VALUES (?, ?, ?, ?, ?)
				 ON CONFLICT(email) DO UPDATE SET
				   confirmation_token = excluded.confirmation_token,
				   topics = excluded.topics
				 WHERE subscribers.status != 'confirmed'`
			)
				.bind(id, email, JSON.stringify(selectedTopics), confirmationToken, unsubscribeToken)
				.run();

			if (result.meta.changes === 0) {
				return fail(409, { error: 'This email is already subscribed.' });
			}

			await sendConfirmationEmail(env, { email, confirmationToken });

			return { success: true };
		} catch (error) {
			console.error('Subscribe error:', error);
			return fail(500, { error: 'Something went wrong. Please try again.' });
		}
	}
};
