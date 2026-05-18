export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
