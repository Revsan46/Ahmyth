export const api = {
	async post<T>(path: string, body: any, init?: RequestInit): Promise<{ data: T }> {
		const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}` , {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
			body: JSON.stringify(body),
			...init,
		});
		if (!res.ok) throw new Error('Request failed');
		return { data: await res.json() };
	}
};