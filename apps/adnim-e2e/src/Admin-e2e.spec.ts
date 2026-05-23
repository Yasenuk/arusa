import { test, expect } from '@playwright/test';

// Basic smoke test
test('admin app returns 200', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
});
