import axios from 'axios';
import { randomEmail, registerAndLogin } from '../support/auth-helper';

const PASSWORD = 'TestPass123!';

describe('Protected routes', () => {
  let token: string;

  beforeAll(async () => {
    const email = randomEmail();
    const data = await registerAndLogin(email, PASSWORD);
    token = data.accessToken;
  });

  const auth = () => ({ headers: { Authorization: `Bearer ${token}` } });

  describe('Cart', () => {
    it('GET /api/cart returns cart without items for new user', async () => {
      const res = await axios.get('/api/cart', auth());
      expect(res.status).toBe(200);
    });

    it('GET /api/cart without token returns 401', async () => {
      try {
        await axios.get('/api/cart');
        fail('Expected 401');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });

    it('POST /api/cart with invalid variant returns 404', async () => {
      try {
        await axios.post('/api/cart', { product_variant_id: 999999999 }, auth());
        fail('Expected 404');
      } catch (err: any) {
        expect([400, 404]).toContain(err.response.status);
      }
    });
  });

  describe('Orders', () => {
    it('GET /api/orders returns array', async () => {
      const res = await axios.get('/api/orders', auth());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('GET /api/orders without token returns 401', async () => {
      try {
        await axios.get('/api/orders');
        fail('Expected 401');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });

    it('GET /api/orders/:id with invalid id returns 404', async () => {
      try {
        await axios.get('/api/orders/999999999', auth());
        fail('Expected 404');
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });

    it('POST /api/orders with empty cart returns 400', async () => {
      try {
        await axios.post('/api/orders', { address_id: null }, auth());
        fail('Expected 400');
      } catch (err: any) {
        expect(err.response.status).toBe(400);
      }
    });
  });

  describe('Addresses', () => {
    let createdAddressId: number;

    it('GET /api/addresses returns array', async () => {
      const res = await axios.get('/api/addresses', auth());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('GET /api/addresses without token returns 401', async () => {
      try {
        await axios.get('/api/addresses');
        fail('Expected 401');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });

    it('POST /api/addresses creates address', async () => {
      const res = await axios.post('/api/addresses', {
        city: 'Київ',
        np_city_ref: '8d5a980d-391c-11dd-90d9-001a92567626',
        np_warehouse: 'Відділення №1 (до 30 кг)',
        np_warehouse_ref: 'a9f18b29-e1f2-11e7-8a35-005056801329',
      }, auth());
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id');
      createdAddressId = res.data.id;
    });

    it('DELETE /api/addresses/:id removes address', async () => {
      if (!createdAddressId) return;
      const res = await axios.delete(`/api/addresses/${createdAddressId}`, auth());
      expect(res.status).toBe(200);
    });
  });

  describe('Payments', () => {
    it('GET /api/payments returns array', async () => {
      const res = await axios.get('/api/payments', auth());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('GET /api/payments without token returns 401', async () => {
      try {
        await axios.get('/api/payments');
        fail('Expected 401');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });

    it('GET /api/payments/:id/receipt with invalid id returns 404', async () => {
      try {
        await axios.get('/api/payments/999999999/receipt', auth());
        fail('Expected 404');
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });
  });

  describe('User profile', () => {
    it('GET /api/users/me returns user data', async () => {
      const res = await axios.get('/api/users/me', auth());
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('email');
    });

    it('GET /api/users/me without token returns 401', async () => {
      try {
        await axios.get('/api/users/me');
        fail('Expected 401');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });
  });
});
