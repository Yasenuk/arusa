// test
import { test, expect } from '@playwright/test';

test('should return 200', async ({ request }) => {
	const response = await request.get('/api');
	expect(response.status()).toBe(200);
});