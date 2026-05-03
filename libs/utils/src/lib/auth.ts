// Модульний стор для accessToken — доступний з будь-якого місця без React
// Ніколи не передається в localStorage
let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string) => { _accessToken = token; },
  clear: () => { _accessToken = null; }
};

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = tokenStore.get();

	if (!token) throw new Error("Unauthorized");

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
			// refreshToken — в httpOnly cookie, браузер надсилає автоматично
			const refreshRes = await fetch("/api/auth/refresh", {
				method: "POST",
				credentials: "include" // необхідно для передачі cookie
			});

			if (!refreshRes.ok) {
				tokenStore.clear();
				throw new Error("Session expired");
			}

			const data = await refreshRes.json();
			tokenStore.set(data.accessToken);

			// Повторюємо оригінальний запит з новим токеном
			res = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${data.accessToken}`,
					...options.headers
				}
			});
		} else {
			throw new Error("Unauthorized");
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