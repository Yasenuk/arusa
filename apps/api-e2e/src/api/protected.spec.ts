import { test, expect } from '@playwright/test';
import { randomEmail, registerAndLogin } from '../support/auth-helper';

const PASSWORD = 'TestPass123!';

test.describe('Protected routes', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const email = randomEmail();
    const data = await registerAndLogin(request, email, PASSWORD);
    token = data.accessToken;
  });

  const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

  test.describe('Cart', () => {
    test('GET /api/cart returns 200 with valid token', async ({ request }) => {
      const res = await request.get('/api/cart', { headers: auth(token) });
      expect(res.status()).toBe(200);
    });

    test('GET /api/cart without token returns 401', async ({ request }) => {
      const res = await request.get('/api/cart');
      expect(res.status()).toBe(401);
    });

    test('POST /api/cart with non-existent variant returns 404', async ({ request }) => {
      const res = await request.post('/api/cart', {
        data: { product_variant_id: 999999999 },
        headers: auth(token),
      });
      expect([400, 404]).toContain(res.status());
    });
  });

  test.describe('Orders', () => {
    test('GET /api/orders returns array', async ({ request }) => {
      const res = await request.get('/api/orders', { headers: auth(token) });
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('GET /api/orders without token returns 401', async ({ request }) => {
      const res = await request.get('/api/orders');
      expect(res.status()).toBe(401);
    });

    test('GET /api/orders/:id with invalid id returns 404', async ({ request }) => {
      const res = await request.get('/api/orders/999999999', { headers: auth(token) });
      expect(res.status()).toBe(404);
    });

    test('POST /api/orders with empty cart returns 400', async ({ request }) => {
      const res = await request.post('/api/orders', {
        data: { address_id: null },
        headers: auth(token),
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('Addresses', () => {
    let createdId: number;

    test('GET /api/addresses returns array', async ({ request }) => {
      const res = await request.get('/api/addresses', { headers: auth(token) });
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('GET /api/addresses without token returns 401', async ({ request }) => {
      const res = await request.get('/api/addresses');
      expect(res.status()).toBe(401);
    });

    test('POST /api/addresses creates address', async ({ request }) => {
      const res = await request.post('/api/addresses', {
        data: {
          city: 'Київ',
          np_city_ref: '8d5a980d-391c-11dd-90d9-001a92567626',
          np_warehouse: 'Відділення №1',
          np_warehouse_ref: 'a9f18b29-e1f2-11e7-8a35-005056801329',
        },
        headers: auth(token),
      });
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('id');
      createdId = data.id;
    });

    test('DELETE /api/addresses/:id removes address', async ({ request }) => {
      if (!createdId) test.skip();
      const res = await request.delete(`/api/addresses/${createdId}`, { headers: auth(token) });
      expect(res.status()).toBe(200);
    });
  });

  test.describe('Payments', () => {
    test('GET /api/payments returns array', async ({ request }) => {
      const res = await request.get('/api/payments', { headers: auth(token) });
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('GET /api/payments without token returns 401', async ({ request }) => {
      const res = await request.get('/api/payments');
      expect(res.status()).toBe(401);
    });

    test('GET /api/payments/:id/receipt with invalid id returns 404', async ({ request }) => {
      const res = await request.get('/api/payments/999999999/receipt', { headers: auth(token) });
      expect(res.status()).toBe(404);
    });
  });

  test.describe('User profile', () => {
    test('GET /api/me returns user data', async ({ request }) => {
      const res = await request.get('/api/me', { headers: auth(token) });
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('email');
    });

    test('GET /api/me without token returns 401', async ({ request }) => {
      const res = await request.get('/api/me');
      expect(res.status()).toBe(401);
    });
  });
});
