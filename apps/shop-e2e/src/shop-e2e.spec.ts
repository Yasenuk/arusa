import { test, expect } from '@playwright/test';

// Basic smoke test kept for backwards compatibility
test('homepage returns 200', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
});
