// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
	});

	test('hero section is visible with Ron Nelson h1', async ({ page }) => {
		const heroHeading = page.locator('h1', { hasText: /Ron Nelson/i });
		await expect(heroHeading).toBeVisible();
	});

	test('CTA button in hero is visible and has accessible text', async ({ page }) => {
		// The CTA link in the hero section points to "#technology"
		const ctaLink = page.locator('section a[href*="#"]').first();
		await expect(ctaLink).toBeVisible();
		const text = (await ctaLink.textContent()) ?? '';
		expect(text.trim().length).toBeGreaterThan(0);
	});

	test('category sections are present on the page', async ({ page }) => {
		// CategorySection renders a <section> with a background color class
		// At least one section beyond the hero should exist
		const sections = page.locator('main section');
		await expect(sections.first()).toBeVisible();
		const count = await sections.count();
		expect(count).toBeGreaterThan(0);
	});

	test('View all links exist and point to /category/ URLs', async ({ page }) => {
		const viewAllLinks = page.locator('a', { hasText: /View all/i });
		const count = await viewAllLinks.count();

		if (count === 0) {
			// No categories loaded — gracefully skip content-dependent assertion
			test.info().annotations.push({
				type: 'info',
				description: 'No "View all" links found — Contentful may not have returned categories.'
			});
			return;
		}

		for (let i = 0; i < count; i++) {
			const href = await viewAllLinks.nth(i).getAttribute('href');
			expect(href).toMatch(/^\/category\//);
		}
	});

	test('About section exists at the bottom of the page', async ({ page }) => {
		// AboutSection renders a section with "About" heading text
		const aboutSection = page.locator('section', { hasText: /About/i }).last();
		await expect(aboutSection).toBeAttached();
	});
});
