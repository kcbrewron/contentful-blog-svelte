import { getContentfulClient } from './client.js';

/**
 * Fetches a category by slug
 * @param {string} slug - Category slug
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Object|null>} Category data or null if not found
 */
export async function getCategoryBySlug(slug, preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'category',
			'fields.slug': slug,
			include: 3,
			limit: 1
		});

		if (response.items.length === 0) {
			return null;
		}

		return response.items[0];
	} catch (error) {
		console.error('Error fetching category:', error);
		throw error;
	}
}

/**
 * Fetches all posts for a category (both internal blog posts and external articles)
 * @param {string} categoryId - Category ID
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array>} Array of blog posts and external articles
 */
export async function getPostsByCategory(categoryId, preview = false) {
	const client = getContentfulClient({ preview });

	try {
		// Fetch blog posts
		const blogPostsResponse = await client.getEntries({
			content_type: 'blogPost',
			'fields.category.sys.id': categoryId,
			order: '-fields.publishedDate',
			include: 2
		});

		// Fetch external articles
		const externalArticlesResponse = await client.getEntries({
			content_type: 'externalArticle',
			'fields.category.sys.id': categoryId,
			order: '-fields.publishedDate',
			include: 2
		});

		// Combine and sort by published date
		const allPosts = [...blogPostsResponse.items, ...externalArticlesResponse.items];
		allPosts.sort((a, b) => {
			const dateA = new Date(a.fields.publishedDate);
			const dateB = new Date(b.fields.publishedDate);
			return dateB - dateA;
		});

		return allPosts;
	} catch (error) {
		console.error('Error fetching posts by category:', error);
		throw error;
	}
}

/**
 * Fetches a blog post by slug
 * @param {string} slug - Post slug
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Object|null>} Blog post data or null if not found
 */
export async function getBlogPostBySlug(slug, preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'blogPost',
			'fields.slug': slug,
			include: 3,
			limit: 1
		});

		if (response.items.length === 0) {
			return null;
		}

		return response.items[0];
	} catch (error) {
		console.error('Error fetching blog post:', error);
		throw error;
	}
}

/**
 * Fetches all categories
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array>} Array of categories
 */
export async function getAllCategories(preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'category',
			order: 'fields.displayOrder',
			include: 1
		});

		return response.items;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw error;
	}
}

/**
 * Fetches recent posts (both blog posts and external articles)
 * @param {number} limit - Number of posts to fetch
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array>} Array of recent posts and articles
 */
export async function getRecentPosts(limit = 6, preview = false) {
	const client = getContentfulClient({ preview });

	try {
		// Fetch blog posts
		const blogPostsResponse = await client.getEntries({
			content_type: 'blogPost',
			order: '-fields.publishedDate',
			limit: limit * 2,
			include: 2
		});

		// Fetch external articles
		const externalArticlesResponse = await client.getEntries({
			content_type: 'externalArticle',
			order: '-fields.publishedDate',
			limit: limit * 2,
			include: 2
		});

		// Combine and sort by published date
		const allPosts = [...blogPostsResponse.items, ...externalArticlesResponse.items];
		allPosts.sort((a, b) => {
			const dateA = new Date(a.fields.publishedDate);
			const dateB = new Date(b.fields.publishedDate);
			return dateB - dateA;
		});

		return allPosts.slice(0, limit);
	} catch (error) {
		console.error('Error fetching recent posts:', error);
		throw error;
	}
}

/**
 * Get post counts by category
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Object<string, number>>} Object mapping category IDs to post counts
 */
export async function getCategoryPostCounts(preview = false) {
	const client = getContentfulClient({ preview });

	try {
		// Fetch all blog posts
		const blogPostsResponse = await client.getEntries({
			content_type: 'blogPost',
			select: 'fields.category',
			limit: 1000
		});

		// Fetch all external articles
		const externalArticlesResponse = await client.getEntries({
			content_type: 'externalArticle',
			select: 'fields.category',
			limit: 1000
		});

		// Count posts per category
		const counts = {};
		const allPosts = [...blogPostsResponse.items, ...externalArticlesResponse.items];

		allPosts.forEach((post) => {
			const categoryId = post.fields.category?.sys?.id;
			if (categoryId) {
				counts[categoryId] = (counts[categoryId] || 0) + 1;
			}
		});

		return counts;
	} catch (error) {
		console.error('Error fetching category post counts:', error);
		return {};
	}
}
/**
 * Fetches all blog post slugs
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array<string>>} Array of slug strings
 */
export async function getAllBlogSlugs(preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'blogPost',
			select: 'fields.slug',
			limit: 1000
		});

		return response.items.map((item) => item.fields.slug);
	} catch (error) {
		console.error('Error fetching all blog slugs:', error);
		throw error;
	}
}

/**
 * Fetches all blog posts with their category slugs for sitemap generation
 * @param {boolean} preview - Use preview API
 * @returns {Promise<Array<{slug: string, categorySlug: string}>>}
 */
export async function getAllBlogPostsForSitemap(preview = false) {
	const client = getContentfulClient({ preview });

	try {
		const response = await client.getEntries({
			content_type: 'blogPost',
			select: 'fields.slug,fields.category',
			include: 1,
			limit: 1000
		});

		return response.items
			.map((item) => ({
				slug: item.fields.slug,
				categorySlug: item.fields.category?.fields?.slug
			}))
			.filter((item) => item.slug && item.categorySlug);
	} catch (error) {
		console.error('Error fetching blog posts for sitemap:', error);
		throw error;
	}
}