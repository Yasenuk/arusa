import axios from 'axios';

describe('Public endpoints', () => {
  describe('GET /api/products', () => {
    it('returns paginated result with products array', async () => {
      const res = await axios.get('/api/products');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('products');
      expect(Array.isArray(res.data.products)).toBe(true);
    });

    it('accepts search query', async () => {
      const res = await axios.get('/api/products?search=test');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('products');
    });

    it('accepts page and limit params', async () => {
      const res = await axios.get('/api/products?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.data.products.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/categories', () => {
    it('returns categories array', async () => {
      const res = await axios.get('/api/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe('GET /api/articles', () => {
    it('returns articles array', async () => {
      const res = await axios.get('/api/articles');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });
});

describe('NovaPoshta whitelist', () => {
  it('allows Address/getCities', async () => {
    const res = await axios.post('/api/novaposhta', {
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: { FindByString: 'Київ', Limit: '5' },
    });
    expect(res.status).toBe(200);
  });

  it('allows Address/getWarehouses', async () => {
    const res = await axios.post('/api/novaposhta', {
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: { CityName: 'Київ', Page: '1', Limit: '3' },
    });
    expect(res.status).toBe(200);
  });

  it('blocks disallowed method on allowed model', async () => {
    try {
      await axios.post('/api/novaposhta', {
        modelName: 'Address',
        calledMethod: 'delete',
        methodProperties: {},
      });
      fail('Expected 403');
    } catch (err: any) {
      expect(err.response.status).toBe(403);
    }
  });

  it('blocks disallowed model entirely', async () => {
    try {
      await axios.post('/api/novaposhta', {
        modelName: 'InternetDocument',
        calledMethod: 'save',
        methodProperties: {},
      });
      fail('Expected 403');
    } catch (err: any) {
      expect(err.response.status).toBe(403);
    }
  });
});

describe('Guest order validation', () => {
  it('returns 400 with empty items array', async () => {
    try {
      await axios.post('/api/guest/orders', {
        items: [],
        guest: { name: 'Тест', email: 'test@test.com', phone: '+380000000000' },
        address: { city: 'Київ', np_city_ref: 'ref', np_warehouse: 'test', np_warehouse_ref: 'ref2' },
      });
      fail('Expected 400');
    } catch (err: any) {
      expect(err.response.status).toBe(400);
    }
  });

  it('returns 400 without guest info', async () => {
    try {
      await axios.post('/api/guest/orders', {
        items: [{ product_variant_id: 1, quantity: 1 }],
        address: { city: 'Київ', np_city_ref: 'ref', np_warehouse: 'w', np_warehouse_ref: 'r' },
      });
      fail('Expected 400');
    } catch (err: any) {
      expect(err.response.status).toBe(400);
    }
  });

  it('returns 400 without address', async () => {
    try {
      await axios.post('/api/guest/orders', {
        items: [{ product_variant_id: 1, quantity: 1 }],
        guest: { name: 'Тест', email: 'test@test.com', phone: '+380000000000' },
      });
      fail('Expected 400');
    } catch (err: any) {
      expect(err.response.status).toBe(400);
    }
  });
});

describe('Admin endpoints — unauthorized access', () => {
  it('GET /api/admin/orders returns 401', async () => {
    try {
      await axios.get('/api/admin/orders');
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });

  it('GET /api/admin/products returns 401', async () => {
    try {
      await axios.get('/api/admin/products');
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });

  it('POST /api/admin/categories returns 401', async () => {
    try {
      await axios.post('/api/admin/categories', { name: 'Unauthorized' });
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });

  it('GET /api/admin/users returns 401', async () => {
    try {
      await axios.get('/api/admin/users');
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });

  it('GET /api/admin/stats returns 401', async () => {
    try {
      await axios.get('/api/admin/stats');
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });
});
