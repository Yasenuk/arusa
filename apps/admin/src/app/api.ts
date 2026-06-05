let refreshPromise: Promise<string | null> | null = null;

async function refreshAdminToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (!res.ok) return null;
      const { accessToken } = await res.json();
      localStorage.setItem('admin_token', accessToken);
      return accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('admin_token');

  const makeRequest = (t: string | null) => fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  });

  let res = await makeRequest(token);

  if (res.status === 401) {
    const newToken = await refreshAdminToken();
    if (!newToken) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      return res;
    }
    res = await makeRequest(newToken);
  }

  return res;
}
