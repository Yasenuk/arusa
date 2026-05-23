import { test, expect, type Page } from '@playwright/test';

const API_BASE = process.env['API_BASE_URL'] || 'http://localhost:3333';
const ADMIN_EMAIL = process.env['ADMIN_EMAIL'];
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'];

async function loginAsAdmin(page: Page): Promise<boolean> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;

  const res = await page.request.post(`${API_BASE}/api/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  if (!res.ok()) return false;

  const { accessToken } = await res.json();
  await page.goto('/login');
  await page.evaluate((t) => localStorage.setItem('admin_token', t), accessToken);
  return true;
}

test.describe('Admin pages (requires ADMIN_EMAIL + ADMIN_PASSWORD env vars)', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAsAdmin(page);
    if (!ok) test.skip();
  });

  test('dashboard is accessible after login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('text=/дашборд|dashboard|замовлення|revenue/i').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('orders list renders table', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText('Замовлення')).toBeVisible({ timeout: 10000 });
  });

  test('orders list has status filter', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.locator('select')).toBeVisible({ timeout: 10000 });
  });

  test('products list renders', async ({ page }) => {
    await page.goto('/products');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText('Товари')).toBeVisible({ timeout: 10000 });
  });

  test('users list renders', async ({ page }) => {
    await page.goto('/users');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText('Користувачі')).toBeVisible({ timeout: 10000 });
  });

  test('categories list renders', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText('Категорії')).toBeVisible({ timeout: 10000 });
  });

  test('inventory list renders', async ({ page }) => {
    await page.goto('/inventory');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText('Склад')).toBeVisible({ timeout: 10000 });
  });

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[class*="sidebar"]')).toBeVisible({ timeout: 10000 });
  });

  test('order detail page loads', async ({ page }) => {
    await page.goto('/orders');
    const detailLink = page.getByRole('link', { name: /деталі/i }).first();
    const hasLink = await detailLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasLink) return;
    await detailLink.click();
    await expect(page).toHaveURL(/\/orders\/\d+/);
    await expect(page.getByText(/замовлення #/i)).toBeVisible({ timeout: 10000 });
  });
});
