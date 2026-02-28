/**
 * Unit tests for src/lib/contentful/queries.js
 *
 * The Contentful client module (`./client.js`) is mocked so that every call
 * to `getContentfulClient()` returns a fake client whose `getEntries` method
 * can be configured per-test.  No network calls are ever made.
 *
 * Naming convention: each describe block maps 1-to-1 with an exported
 * function; each `it` block reads as a plain-English specification.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock the client module BEFORE any source module imports it.
// vi.mock calls are hoisted to the top of the file by Vitest's transformer,
// so the mock is guaranteed to be in place when queries.js is evaluated.
// ---------------------------------------------------------------------------
vi.mock('../../src/lib/contentful/client.js', () => {
	// The mock factory creates a shared `getEntries` spy so individual tests
	// can swap its implementation with `mockResolvedValueOnce` or
	// `mockImplementation` without importing the spy separately.
	const mockGetEntries = vi.fn();
	const mockGetEntry = vi.fn();
	const getContentfulClient = vi.fn(() => ({
		getEntries: mockGetEntries,
		getEntry: mockGetEntry
	}));
	return { getContentfulClient };
});

// Import the mocked module so tests can reach the underlying spies.
import { getContentfulClient } from '../../src/lib/contentful/client.js';

// Import the functions under test AFTER the mock is registered.
import {
	getPostsByCategory,
	getRecentPosts,
	getCategoryPostCounts,
	getAllCategories,
	getCategoryBySlug,
	getBlogPostBySlug
} from '../../src/lib/contentful/queries.js';

// ---------------------------------------------------------------------------
// Helpers — build minimal Contentful entry shapes
// ---------------------------------------------------------------------------

/**
 * Creates a fake blogPost or externalArticle entry.
 *
 * @param {string} id          - Unique entry sys id
 * @param {string} publishedDate - ISO date string
 * @param {string|null} categoryId - Category sys id, or null for no category
 * @returns {Object} Minimal Contentful entry shape
 */
function makeEntry(id, publishedDate, categoryId = null) {
	return {
		sys: { id },
		fields: {
			publishedDate,
			category: categoryId ? { sys: { id: categoryId } } : undefined
		}
	};
}

// ---------------------------------------------------------------------------
// Shared setup
// ---------------------------------------------------------------------------
beforeEach(() => {
	vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getPostsByCategory
// ---------------------------------------------------------------------------
describe('getPostsByCategory', () => {
	it('merges blogPosts and externalArticles and returns them sorted descending by publishedDate', async () => {
		// Arrange: two blog posts and one external article with mixed dates.
		// After merging and sorting the order should be March → February → January.
		const blogPosts = [
			makeEntry('bp-old', '2024-01-01'),
			makeEntry('bp-new', '2024-03-01')
		];
		const externalArticles = [makeEntry('ext-mid', '2024-02-01')];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })       // first call → blogPost
			.mockResolvedValueOnce({ items: externalArticles }); // second call → externalArticle

		// Act
		const result = await getPostsByCategory('cat-1');

		// Assert: three items returned in descending date order
		expect(result).toHaveLength(3);
		expect(result[0].sys.id).toBe('bp-new');   // 2024-03-01
		expect(result[1].sys.id).toBe('ext-mid');  // 2024-02-01
		expect(result[2].sys.id).toBe('bp-old');   // 2024-01-01
	});

	it('queries both content types with the supplied categoryId', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValue({ items: [] });

		await getPostsByCategory('my-category-id');

		// getEntries should have been called twice (blogPost + externalArticle)
		expect(mockGetEntries).toHaveBeenCalledTimes(2);

		const firstCallArgs = mockGetEntries.mock.calls[0][0];
		const secondCallArgs = mockGetEntries.mock.calls[1][0];

		expect(firstCallArgs['fields.category.sys.id']).toBe('my-category-id');
		expect(secondCallArgs['fields.category.sys.id']).toBe('my-category-id');
	});

	it('passes preview=true to getContentfulClient when requested', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValue({ items: [] });

		await getPostsByCategory('cat-1', true);

		expect(getContentfulClient).toHaveBeenCalledWith({ preview: true });
	});
});

// ---------------------------------------------------------------------------
// getRecentPosts
// ---------------------------------------------------------------------------
describe('getRecentPosts', () => {
	it('slices the merged+sorted result to exactly the requested limit', async () => {
		// Arrange: 4 blog posts and 4 external articles (8 total).
		// Only the 3 most recent should be returned when limit=3.
		const blogPosts = [
			makeEntry('bp-1', '2024-01-01'),
			makeEntry('bp-2', '2024-02-01'),
			makeEntry('bp-3', '2024-05-01'),
			makeEntry('bp-4', '2024-07-01')
		];
		const externalArticles = [
			makeEntry('ext-1', '2024-03-01'),
			makeEntry('ext-2', '2024-04-01'),
			makeEntry('ext-3', '2024-06-01'),
			makeEntry('ext-4', '2024-08-01') // most recent overall
		];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: externalArticles });

		// Act
		const result = await getRecentPosts(3);

		// Assert
		expect(result).toHaveLength(3);
	});

	it('returns the 3 most recent items when limit=3 across both content types', async () => {
		// The three most recent across both sets should be:
		//   ext-4 (2024-08-01), bp-4 (2024-07-01), ext-3 (2024-06-01)
		const blogPosts = [
			makeEntry('bp-1', '2024-01-01'),
			makeEntry('bp-2', '2024-02-01'),
			makeEntry('bp-3', '2024-05-01'),
			makeEntry('bp-4', '2024-07-01')
		];
		const externalArticles = [
			makeEntry('ext-1', '2024-03-01'),
			makeEntry('ext-2', '2024-04-01'),
			makeEntry('ext-3', '2024-06-01'),
			makeEntry('ext-4', '2024-08-01')
		];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: externalArticles });

		const result = await getRecentPosts(3);

		expect(result[0].sys.id).toBe('ext-4'); // 2024-08-01
		expect(result[1].sys.id).toBe('bp-4');  // 2024-07-01
		expect(result[2].sys.id).toBe('ext-3'); // 2024-06-01
	});

	it('sorts the merged result descending by publishedDate across content types', async () => {
		// Interleaved dates: blog posts on odd months, external articles on even months.
		// The sort must compare dates across both content types, not just within each set.
		const blogPosts = [
			makeEntry('bp-jan', '2024-01-15'),
			makeEntry('bp-mar', '2024-03-15'),
			makeEntry('bp-may', '2024-05-15')
		];
		const externalArticles = [
			makeEntry('ext-feb', '2024-02-15'),
			makeEntry('ext-apr', '2024-04-15'),
			makeEntry('ext-jun', '2024-06-15')
		];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: externalArticles });

		const result = await getRecentPosts(6);

		// Full sorted order: Jun, May, Apr, Mar, Feb, Jan
		expect(result.map((e) => e.sys.id)).toEqual([
			'ext-jun',
			'bp-may',
			'ext-apr',
			'bp-mar',
			'ext-feb',
			'bp-jan'
		]);
	});

	it('returns an empty array when both content types have no items', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValue({ items: [] });

		const result = await getRecentPosts(5);
		expect(result).toEqual([]);
	});

	it('uses default limit of 6 when no limit argument is supplied', async () => {
		// Build 10 entries so the slice would matter if limit is wrong.
		const entries = Array.from({ length: 10 }, (_, i) =>
			makeEntry(`entry-${i}`, `2024-${String(i + 1).padStart(2, '0')}-01`)
		);

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: entries })
			.mockResolvedValueOnce({ items: [] });

		const result = await getRecentPosts();
		expect(result).toHaveLength(6);
	});
});

// ---------------------------------------------------------------------------
// getCategoryPostCounts
// ---------------------------------------------------------------------------
describe('getCategoryPostCounts', () => {
	it('counts posts per category from both content types combined', async () => {
		// Arrange: two posts in cat1 (one from each content type) and one in cat2.
		const blogPosts = [
			makeEntry('bp-1', '2024-01-01', 'cat1'),
			makeEntry('bp-2', '2024-02-01', 'cat2')
		];
		const externalArticles = [makeEntry('ext-1', '2024-03-01', 'cat1')];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: externalArticles });

		// Act
		const counts = await getCategoryPostCounts();

		// Assert
		expect(counts).toEqual({ cat1: 2, cat2: 1 });
	});

	it('excludes posts that have no category attached', async () => {
		// A post with `category: undefined` should not appear in the counts at all.
		const blogPosts = [
			makeEntry('bp-cat', '2024-01-01', 'cat1'),
			makeEntry('bp-nocat', '2024-01-02', null) // no category
		];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: [] });

		const counts = await getCategoryPostCounts();

		// Only cat1 should appear; the uncategorised post must be omitted.
		expect(counts).toEqual({ cat1: 1 });
		expect(Object.keys(counts)).not.toContain('undefined');
	});

	it('returns an empty object when both content types return no items', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValue({ items: [] });

		const counts = await getCategoryPostCounts();

		expect(counts).toEqual({});
	});

	it('accumulates counts correctly when a single category has many posts', async () => {
		// Five blog posts all belonging to the same category.
		const blogPosts = Array.from({ length: 5 }, (_, i) =>
			makeEntry(`bp-${i}`, `2024-01-0${i + 1}`, 'popular-cat')
		);

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries
			.mockResolvedValueOnce({ items: blogPosts })
			.mockResolvedValueOnce({ items: [] });

		const counts = await getCategoryPostCounts();

		expect(counts['popular-cat']).toBe(5);
	});
});

// ---------------------------------------------------------------------------
// getAllCategories
// ---------------------------------------------------------------------------
describe('getAllCategories', () => {
	it('returns the items array from the Contentful response', async () => {
		const mockCategories = [
			{ sys: { id: 'cat1' }, fields: { title: 'Tech', slug: 'tech' } },
			{ sys: { id: 'cat2' }, fields: { title: 'Design', slug: 'design' } }
		];

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: mockCategories });

		const result = await getAllCategories();

		expect(result).toEqual(mockCategories);
	});

	it('queries the category content type', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		await getAllCategories();

		expect(mockGetEntries).toHaveBeenCalledWith(
			expect.objectContaining({ content_type: 'category' })
		);
	});
});

// ---------------------------------------------------------------------------
// getCategoryBySlug
// ---------------------------------------------------------------------------
describe('getCategoryBySlug', () => {
	it('returns null when no category matches the slug', async () => {
		// When Contentful returns an empty items array the function should signal
		// "not found" by returning null rather than throwing or returning undefined.
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		const result = await getCategoryBySlug('non-existent-slug');

		expect(result).toBeNull();
	});

	it('returns the first item when a matching category is found', async () => {
		const mockCategory = {
			sys: { id: 'cat-abc' },
			fields: { title: 'Technology', slug: 'technology' }
		};

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [mockCategory] });

		const result = await getCategoryBySlug('technology');

		expect(result).toEqual(mockCategory);
	});

	it('queries Contentful with the supplied slug and content_type category', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		await getCategoryBySlug('my-slug');

		expect(mockGetEntries).toHaveBeenCalledWith(
			expect.objectContaining({
				content_type: 'category',
				'fields.slug': 'my-slug'
			})
		);
	});
});

// ---------------------------------------------------------------------------
// getBlogPostBySlug
// ---------------------------------------------------------------------------
describe('getBlogPostBySlug', () => {
	it('returns null when no blog post matches the slug', async () => {
		// A missing post should resolve to null, not throw.
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		const result = await getBlogPostBySlug('does-not-exist');

		expect(result).toBeNull();
	});

	it('returns the first item when a matching post is found', async () => {
		const mockPost = {
			sys: { id: 'post-xyz' },
			fields: {
				title: 'Hello World',
				slug: 'hello-world',
				publishedDate: '2024-06-01'
			}
		};

		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [mockPost] });

		const result = await getBlogPostBySlug('hello-world');

		expect(result).toEqual(mockPost);
	});

	it('queries the blogPost content type with the supplied slug', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		await getBlogPostBySlug('some-post-slug');

		expect(mockGetEntries).toHaveBeenCalledWith(
			expect.objectContaining({
				content_type: 'blogPost',
				'fields.slug': 'some-post-slug'
			})
		);
	});

	it('passes preview=true to getContentfulClient when requested', async () => {
		const mockGetEntries = getContentfulClient().getEntries;
		mockGetEntries.mockResolvedValueOnce({ items: [] });

		await getBlogPostBySlug('any-slug', true);

		expect(getContentfulClient).toHaveBeenCalledWith({ preview: true });
	});
});
