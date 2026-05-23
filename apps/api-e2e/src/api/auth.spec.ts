import { test, expect } from '@playwright/test';
import { randomEmail } from '../support/auth-helper';

const PASSWORD = 'TestPass123!';

test.describe('POST /api/auth/register', () => {
  test('creates a new user and returns access token', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { email: randomEmail(), password: PASSWORD, password_confirm: PASSWORD, first_name: 'Тест', last_name: 'Юзер' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('accessToken');
    expect(typeof data.accessToken).toBe('string');
  });

  test('returns 400 when passwords do not match', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { email: randomEmail(), password: PASSWORD, password_confirm: 'different', first_name: 'A', last_name: 'B' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('returns 409 on duplicate email', async ({ request }) => {
    const email = randomEmail();
    const body = { email, password: PASSWORD, password_confirm: PASSWORD, first_name: 'A', last_name: 'B' };
    await request.post('/api/auth/register', { data: body });
    const res = await request.post('/api/auth/register', { data: body });
    expect(res.status()).toBe(409);
  });
});

test.describe('POST /api/auth/login', () => {
  let email: string;

  test.beforeAll(async ({ request }) => {
    email = randomEmail();
    await request.post('/api/auth/register', {
      data: { email, password: PASSWORD, password_confirm: PASSWORD, first_name: 'Тест', last_name: 'Юзер' },
    });
  });

  test('returns access token on valid credentials', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: { email, password: PASSWORD } });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('accessToken');
    expect(typeof data.accessToken).toBe('string');
  });

  test('returns 401 on wrong password', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: { email, password: 'wrongpassword' } });
    expect(res.status()).toBe(401);
  });

  test('returns 401 for non-existent user', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: { email: 'nobody@arusa-test.com', password: PASSWORD } });
    expect(res.status()).toBe(401);
  });
});

test.describe('POST /api/auth/refresh', () => {
  test('returns 401 without refresh cookie', async ({ request }) => {
    const res = await request.post('/api/auth/refresh');
    expect(res.status()).toBe(401);
  });
});
