export async function fetchWithAuth(url: string, options: RequestInit = {}) {
	let token = localStorage.getItem("accessToken");

	if (!token) return;

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
			const refreshToken = localStorage.getItem("refreshToken");

			if (!refreshToken) {
				localStorage.clear();
				return;
			}

			const refreshRes = await fetch("/api/auth/refresh", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken })
			});

			if (!refreshRes.ok) {
				localStorage.clear();
				return;
			}

			const data = await refreshRes.json();
			localStorage.setItem("accessToken", data.accessToken);

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