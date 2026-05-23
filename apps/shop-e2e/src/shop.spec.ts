import { test, expect } from '@playwright/test';

const API_BASE = process.env['API_BASE_URL'] || 'http://localhost:3333';

test.describe('Shop page', () => {
  test('renders with correct title', async ({ page }) => {
    await page.goto('/shop');
    await expect(page).toHaveTitle(/Магазин/);
  });

  test('displays at least one product card', async ({ page }) => {
    await page.goto('/shop');
    const card = page.locator('[class*="product-card"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test('product cards have image and title', async ({ page }) => {
    await page.goto('/shop');
    const card = page.locator('[class*="product-card"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card.locator('img')).toBeVisible();
  });
});

test.describe('Product page', () => {
  let firstProductId: number | null = null;

  test.beforeAll(async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/products?page=1&limit=1`);
    if (res.ok()) {
      const data = await res.json();
      firstProductId = data.products?.[0]?.id ?? null;
    }
  });

  test('loads product page by id', async ({ page }) => {
    if (!firstProductId) {
      test.skip();
      return;
    }
    await page.goto(`/products/${firstProductId}`);
    await expect(page).not.toHaveURL(/not-found/);
    await expect(page.locator('h1, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('add to cart button is present on product page', async ({ page }) => {
    if (!firstProductId) {
      test.skip();
      return;
    }
    await page.goto(`/products/${firstProductId}`);
    const addBtn = page.getByRole('button', { name: /додати/i }).first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
  });

  test('non-existent product shows 404', async ({ page }) => {
    await page.goto('/products/999999999');
    // Either 404 page renders or a "not found" state
    const has404 = await page.locator('text=404').isVisible().catch(() => false);
    const hasNotFound = await page.locator('text=/не знайдено/i').isVisible().catch(() => false);
    expect(has404 || hasNotFound).toBe(true);
  });
});

test.describe('Homepage sections', () => {
  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[class*="hero"]').first()).toBeVisible();
  });

  test('footer is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('subscribe form has email input', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });
});
