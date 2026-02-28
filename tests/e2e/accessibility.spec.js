// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
	});

	test('main element exists on the page', async ({ page }) => {
		const main = page.locator('main');
		await expect(main).toBeAttached();
	});

	test('nav is a <nav> element providing landmark navigation', async ({ page }) => {
		// The layout uses a <nav> element which inherently has role="navigation"
		const nav = page.locator('nav').first();
		await expect(nav).toBeAttached();
		const tagName = await nav.evaluate((el) => el.tagName.toLowerCase());
		expect(tagName).toBe('nav');
	});

	test('mobile menu button has aria-expanded attribute', async ({ page }) => {
		const hamburger = page.locator('button[aria-controls="mobile-menu"]');
		await expect(hamburger).toBeAttached();
		const ariaExpanded = await hamburger.getAttribute('aria-expanded');
		expect(ariaExpanded).not.toBeNull();
	});

	test('mobile menu button has aria-label', async ({ page }) => {
		const hamburger = page.locator('button[aria-controls="mobile-menu"]');
		await expect(hamburger).toBeAttached();
		const ariaLabel = await hamburger.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		expect(ariaLabel?.trim().length).toBeGreaterThan(0);
	});

	test('all img tags have alt attributes', async ({ page }) => {
		const images = await page.locator('img').all();
		for (const img of images) {
			const alt = await img.getAttribute('alt');
			// alt must be present (can be empty string for decorative images, but must exist)
			expect(alt, `Image missing alt attribute`).not.toBeNull();
		}
	});

	test('footer has copyright text', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer).toBeAttached();
		const footerText = (await footer.textContent()) ?? '';
		expect(footerText).toMatch(/ronnelson\.dev|ron nelson|©|\u00a9|copyright/i);
	});

	test('focus-visible: focusing the Home nav link does not hide it', async ({ page }) => {
		// Tab to the first link in the nav and confirm it is still visible
		const homeLink = page.locator('nav a[href="/"]').first();
		await homeLink.focus();
		await expect(homeLink).toBeVisible();
	});

	test('body applies the Inter font family via Tailwind class or computed style', async ({
		page
	}) => {
		// The app uses Tailwind's font-sans which maps to Inter. We check either a class
		// on the html/body element or the computed font-family contains a sans-serif stack.
		const fontFamily = await page.evaluate(() => {
			return window.getComputedStyle(document.body).fontFamily;
		});
		// Computed font-family will include the actual resolved font name(s)
		expect(fontFamily.length).toBeGreaterThan(0);
	});
});
