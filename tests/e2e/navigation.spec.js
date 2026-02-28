// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test.describe('Desktop navigation', () => {
		test('page title contains Ron Nelson', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await expect(page).toHaveTitle(/Ron Nelson/i);
		});

		test('nav logo link exists with text containing ron and nelson', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			const nav = page.locator('nav').first();
			const logoLink = nav.locator('a[href="/"]').first();
			await expect(logoLink).toBeVisible();
			const logoText = await logoLink.textContent();
			expect(logoText?.toLowerCase()).toContain('ron');
			expect(logoText?.toLowerCase()).toContain('nelson');
		});

		test('nav has a Home link', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			// The desktop nav Home link lives inside the hidden-md block; target by text
			const homeLink = page.locator('nav a', { hasText: 'Home' }).first();
			await expect(homeLink).toBeAttached();
		});

		test('all nav links have accessible names', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			const navLinks = await page.locator('nav a').all();
			for (const link of navLinks) {
				const ariaLabel = await link.getAttribute('aria-label');
				const innerText = (await link.textContent()) ?? '';
				const hasAccessibleName =
					(ariaLabel && ariaLabel.trim().length > 0) || innerText.trim().length > 0;
				expect(hasAccessibleName, `Nav link missing accessible name`).toBe(true);
			}
		});
	});

	test.describe('Mobile navigation', () => {
		test.use({ viewport: { width: 375, height: 812 } });

		test('hamburger button is visible on mobile', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			const hamburger = page.locator('button[aria-controls="mobile-menu"]');
			await expect(hamburger).toBeVisible();
		});

		test('desktop nav links are hidden on mobile', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			// The desktop nav block uses the class "hidden md:block"
			const desktopNav = page.locator('nav .hidden.md\\:block');
			await expect(desktopNav).toBeHidden();
		});

		test('clicking hamburger opens the mobile menu panel', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			const hamburger = page.locator('button[aria-controls="mobile-menu"]');
			await hamburger.click();
			const mobileMenu = page.locator('#mobile-menu');
			await expect(mobileMenu).toBeVisible();
		});

		test('clicking a nav link inside the mobile menu closes the menu', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			const hamburger = page.locator('button[aria-controls="mobile-menu"]');
			await hamburger.click();
			const mobileMenu = page.locator('#mobile-menu');
			await expect(mobileMenu).toBeVisible();

			// Click the Home link inside the mobile menu
			const mobileHomeLink = mobileMenu.locator('a', { hasText: 'Home' }).first();
			await mobileHomeLink.click();

			// Menu should now be gone (Svelte removes the element when menuOpen = false)
			await expect(mobileMenu).toBeHidden();
		});
	});
});
