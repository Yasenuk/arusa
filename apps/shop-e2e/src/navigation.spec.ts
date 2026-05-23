import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Arusa/);
  });

  test('/shop has correct title', async ({ page }) => {
    await page.goto('/shop');
    await expect(page).toHaveTitle(/Магазин/);
  });

  test('/about has correct title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Про нас/);
  });

  test('/blog has correct title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Блог/);
  });

  test('/contact has correct title', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Контакти/);
  });

  test('skip link is present on homepage', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('main content landmark exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

test.describe('404 page', () => {
  test('shows 404 for unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-at-all');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Сторінку не знайдено')).toBeVisible();
  });

  test('404 page has a link back to homepage', async ({ page }) => {
    await page.goto('/totally-unknown-path');
    const homeLink = page.getByRole('link', { name: /на головну/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('shows 404 for deeply nested unknown path', async ({ page }) => {
    await page.goto('/a/b/c/d');
    await expect(page.getByText('404')).toBeVisible();
  });
});
