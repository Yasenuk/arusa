import axios from 'axios';

export function randomEmail(): string {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@arusa-test.com`;
}

export async function registerAndLogin(
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  await axios.post('/api/auth/register', {
    email,
    password,
    password_confirm: password,
    first_name: 'Test',
    last_name: 'User',
  });
  const res = await axios.post('/api/auth/login', { email, password });
  return res.data;
}
