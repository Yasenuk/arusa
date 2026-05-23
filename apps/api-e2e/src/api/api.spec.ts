import { test, expect } from '@playwright/test';

test.describe('Public endpoints', () => {
  test.describe('GET /api/products', () => {
    test('returns paginated result with data array', async ({ request }) => {
      const res = await request.get('/api/products');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('page');
    });

    test('accepts search query', async ({ request }) => {
      const res = await request.get('/api/products?search=test');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('data');
    });

    test('accepts page and limit params', async ({ request }) => {
      const res = await request.get('/api/products?page=1&limit=5');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.data.length).toBeLessThanOrEqual(5);
    });
  });

  test('GET /api/categories returns array', async ({ request }) => {
    const res = await request.get('/api/categories');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/articles returns array', async ({ request }) => {
    const res = await request.get('/api/articles');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

test.describe('NovaPoshta whitelist', () => {
  test('allows Address/getCities', async ({ request }) => {
    const res = await request.post('/api/novaposhta', {
      data: { modelName: 'Address', calledMethod: 'getCities', methodProperties: { FindByString: 'Київ', Limit: '5' } },
    });
    expect(res.status()).toBe(200);
  });

  test('allows Address/getWarehouses', async ({ request }) => {
    const res = await request.post('/api/novaposhta', {
      data: { modelName: 'Address', calledMethod: 'getWarehouses', methodProperties: { CityName: 'Київ', Page: '1', Limit: '3' } },
    });
    expect(res.status()).toBe(200);
  });

  test('blocks disallowed method on allowed model', async ({ request }) => {
    const res = await request.post('/api/novaposhta', {
      data: { modelName: 'Address', calledMethod: 'delete', methodProperties: {} },
    });
    expect(res.status()).toBe(403);
  });

  test('blocks disallowed model entirely', async ({ request }) => {
    const res = await request.post('/api/novaposhta', {
      data: { modelName: 'InternetDocument', calledMethod: 'save', methodProperties: {} },
    });
    expect(res.status()).toBe(403);
  });
});

test.describe('Guest order validation', () => {
  const validGuest = { name: 'Тест', email: 'test@test.com', phone: '+380000000000' };
  const validAddress = { city: 'Київ', np_city_ref: 'ref', np_warehouse: 'test', np_warehouse_ref: 'ref2' };

  test('returns 400 with empty items array', async ({ request }) => {
    const res = await request.post('/api/guest/orders', {
      data: { items: [], guest: validGuest, address: validAddress },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 without guest info', async ({ request }) => {
    const res = await request.post('/api/guest/orders', {
      data: { items: [{ product_variant_id: 1, quantity: 1 }], address: validAddress },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 without address', async ({ request }) => {
    const res = await request.post('/api/guest/orders', {
      data: { items: [{ product_variant_id: 1, quantity: 1 }], guest: validGuest },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe('Admin endpoints — unauthorized', () => {
  test('GET /api/admin/orders returns 401', async ({ request }) => {
    const res = await request.get('/api/admin/orders');
    expect(res.status()).toBe(401);
  });

  test('GET /api/admin/products returns 401', async ({ request }) => {
    const res = await request.get('/api/admin/products');
    expect(res.status()).toBe(401);
  });

  test('POST /api/admin/categories returns 401', async ({ request }) => {
    const res = await request.post('/api/admin/categories', { data: { name: 'Unauthorized' } });
    expect(res.status()).toBe(401);
  });

  test('GET /api/admin/users returns 401', async ({ request }) => {
    const res = await request.get('/api/admin/users');
    expect(res.status()).toBe(401);
  });

  test('GET /api/admin/stats returns 401', async ({ request }) => {
    const res = await request.get('/api/admin/stats');
    expect(res.status()).toBe(401);
  });
});
