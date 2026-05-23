import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
});

test.describe('Cart — guest', () => {
  test('cart button is visible in header', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /кошик/i }).first();
    await expect(cartBtn).toBeVisible();
  });

  test('cart opens when button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /кошик/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('empty guest cart shows correct message', async ({ page }) => {
    await page.getByRole('button', { name: /кошик/i }).first().click();
    await expect(page.getByText('Кошик порожній')).toBeVisible();
  });

  test('cart closes on Escape key', async ({ page }) => {
    await page.getByRole('button', { name: /кошик/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('checkout button disabled when cart is empty', async ({ page }) => {
    await page.getByRole('button', { name: /кошик/i }).first().click();
    const checkoutBtn = page.getByRole('button', { name: /перейти до замовлення/i });
    await expect(checkoutBtn).toBeDisabled();
  });

  test('cart item count badge shows 0 initially', async ({ page }) => {
    const badge = page.locator('[class*="cart__quantity"]');
    await expect(badge).toHaveText('0');
  });
});

test.describe('Cart — payment success toast', () => {
  test('shows success toast after guest payment redirect', async ({ page }) => {
    await page.goto('/?guest_paid=42');
    await expect(page.getByText(/замовлення #42/i)).toBeVisible({ timeout: 5000 });
  });

  test('success toast clears guest_paid from URL', async ({ page }) => {
    await page.goto('/?guest_paid=99');
    await expect(page).not.toHaveURL(/guest_paid/);
  });

  test('shows success toast after auth payment redirect', async ({ page }) => {
    await page.goto('/?paid=15');
    await expect(page.getByText(/замовлення #15/i)).toBeVisible({ timeout: 5000 });
  });
});
