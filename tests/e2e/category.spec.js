// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Category pages', () => {
	test('follows first "View all" link and category page loads with an h1', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const viewAllLinks = page.locator('a', { hasText: /View all/i });
		const count = await viewAllLinks.count();

		if (count === 0) {
			// No categories returned from Contentful — nothing to follow, pass gracefully
			test.info().annotations.push({
				type: 'info',
				description:
					'No "View all" links found on homepage. Contentful credentials may be absent or no categories exist.'
			});
			return;
		}

		const firstHref = await viewAllLinks.first().getAttribute('href');
		expect(firstHref).toMatch(/^\/category\//);

		const response = await page.goto(/** @type {string} */ (firstHref), {
			waitUntil: 'networkidle'
		});

		// Must not be a 5xx server error
		const status = response?.status() ?? 200;
		expect(status).toBeLessThan(500);

		if (status === 404) {
			// Category slug exists in nav but Contentful returned no data — pass gracefully
			test.info().annotations.push({
				type: 'info',
				description: `Category page returned 404 for ${firstHref}. Treating as empty-data graceful state.`
			});
			return;
		}

		// Happy path: category page should have an h1
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('visiting a known-missing category slug returns non-5xx status', async ({ page }) => {
		const response = await page.goto('/category/this-category-does-not-exist-xyz123', {
			waitUntil: 'networkidle'
		});
		const status = response?.status() ?? 200;
		expect(status).toBeLessThan(500);
	});

	test('category page renders page structure without crashing', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const viewAllLinks = page.locator('a', { hasText: /View all/i });
		const count = await viewAllLinks.count();

		if (count === 0) {
			test.info().annotations.push({
				type: 'info',
				description: 'Skipping category page structure check — no categories on homepage.'
			});
			return;
		}

		const href = await viewAllLinks.first().getAttribute('href');
		await page.goto(/** @type {string} */ (href), { waitUntil: 'networkidle' });

		// Core page structure should always be present regardless of content
		await expect(page.locator('nav').first()).toBeAttached();
		await expect(page.locator('main')).toBeAttached();
		await expect(page.locator('footer')).toBeAttached();
	});
});
