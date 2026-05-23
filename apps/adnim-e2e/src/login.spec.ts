import { test, expect } from '@playwright/test';

test.describe('Auth guard', () => {
  test('root / redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/dashboard redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/orders redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/products redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders Arusa Admin heading', async ({ page }) => {
    await expect(page.getByText('Arusa Admin')).toBeVisible();
  });

  test('has email and password inputs', async ({ page }) => {
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Пароль')).toBeVisible();
  });

  test('has login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Увійти' })).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('wrong@email.com');
    await page.getByPlaceholder('Пароль').fill('wrongpassword');
    await page.getByRole('button', { name: 'Увійти' }).click();
    await expect(page.getByText('Невірний email або пароль')).toBeVisible({ timeout: 6000 });
  });

  test('shows error on empty submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Увійти' }).click();
    await expect(page.getByText('Невірний email або пароль')).toBeVisible({ timeout: 6000 });
  });

  test('submits on Enter key in password field', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Пароль').fill('wrong');
    await page.getByPlaceholder('Пароль').press('Enter');
    await expect(page.getByText('Невірний email або пароль')).toBeVisible({ timeout: 6000 });
  });
});
