type Listener = (token: string | null) => void;
let _accessToken: string | null = null;
const listeners: Listener[] = [];

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string) => {
    _accessToken = token;
    listeners.forEach(l => l(token));
  },
  clear: () => {
    _accessToken = null;
    listeners.forEach(l => l(null));
  },
  subscribe: (fn: Listener) => {
    listeners.push(fn);
    return () => listeners.splice(listeners.indexOf(fn), 1);
  }
};

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = tokenStore.get();

	if (!token) throw new Error("Unauthorized [Cart]");

	let res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...options.headers
		}
	});

	if (res.status === 401) {
		const errorData = await res.json();

		if (errorData.error === "Token expired") {
			const refreshRes = await fetch("/api/auth/refresh", {
				method: "POST",
				credentials: "include"
			});

			if (!refreshRes.ok) {
				tokenStore.clear();
				throw new Error("Session expired");
			}

			const data = await refreshRes.json();
			tokenStore.set(data.accessToken);

			res = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${data.accessToken}`,
					...options.headers
				}
			});
		} else {
			throw new Error("Unauthorized 12");
		}
	}

	return res;
}

export async function loadData(url: string) {
	try {
		const res = await fetchWithAuth(url);
		if (!res) return;
		return await res.json();
	} catch (err) {
		console.error(err);
	}
}