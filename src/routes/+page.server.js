import {
	getRecentPosts,
	getAllCategories,
	getCategoryPostCounts,
	getPostsByCategory
} from '$lib/contentful/queries.js';

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
			.map((post) => post.fields.featuredImage?.fields?.file?.url)
			.filter(Boolean);

		return {
			recentPosts: recentPosts || [],
			categories: categories || [],
			categoryPostCounts: categoryPostCounts || {},
			categoryPosts: categoryPosts || {},
			featuredImages: featuredImages || []
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
