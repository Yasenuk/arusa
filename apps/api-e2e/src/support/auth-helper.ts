import { type APIRequestContext } from '@playwright/test';

export function randomEmail(): string {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@arusa-test.com`;
}

export async function registerAndLogin(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  await request.post('/api/auth/register', {
    data: { email, password, password_confirm: password, first_name: 'Test', last_name: 'User' },
  });
  const res = await request.post('/api/auth/login', {
    data: { email, password },
  });
  return res.json();
}
