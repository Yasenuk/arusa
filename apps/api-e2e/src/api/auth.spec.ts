import axios from 'axios';
import { randomEmail } from '../support/auth-helper';

const PASSWORD = 'TestPass123!';

describe('POST /api/auth/register', () => {
  it('creates a new user and returns access token', async () => {
    const res = await axios.post('/api/auth/register', {
      email: randomEmail(),
      password: PASSWORD,
      password_confirm: PASSWORD,
      first_name: 'Тест',
      last_name: 'Юзер',
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('accessToken');
    expect(typeof res.data.accessToken).toBe('string');
  });

  it('returns 400 when passwords do not match', async () => {
    try {
      await axios.post('/api/auth/register', {
        email: randomEmail(),
        password: PASSWORD,
        password_confirm: 'different',
        first_name: 'A',
        last_name: 'B',
      });
      fail('Expected error');
    } catch (err: any) {
      expect(err.response.status).toBeGreaterThanOrEqual(400);
    }
  });

  it('returns 409 on duplicate email', async () => {
    const email = randomEmail();
    const body = { email, password: PASSWORD, password_confirm: PASSWORD, first_name: 'A', last_name: 'B' };
    await axios.post('/api/auth/register', body);
    try {
      await axios.post('/api/auth/register', body);
      fail('Expected 409');
    } catch (err: any) {
      expect(err.response.status).toBe(409);
    }
  });
});

describe('POST /api/auth/login', () => {
  let email: string;

  beforeAll(async () => {
    email = randomEmail();
    await axios.post('/api/auth/register', {
      email,
      password: PASSWORD,
      password_confirm: PASSWORD,
      first_name: 'Тест',
      last_name: 'Юзер',
    });
  });

  it('returns access token on valid credentials', async () => {
    const res = await axios.post('/api/auth/login', { email, password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('accessToken');
    expect(typeof res.data.accessToken).toBe('string');
  });

  it('returns 401 on wrong password', async () => {
    try {
      await axios.post('/api/auth/login', { email, password: 'wrongpassword' });
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });

  it('returns 401 for non-existent user', async () => {
    try {
      await axios.post('/api/auth/login', { email: 'nobody@arusa-test.com', password: PASSWORD });
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });
});

describe('POST /api/auth/refresh', () => {
  it('returns 401 without refresh cookie', async () => {
    try {
      await axios.post('/api/auth/refresh');
      fail('Expected 401');
    } catch (err: any) {
      expect(err.response.status).toBe(401);
    }
  });
});
