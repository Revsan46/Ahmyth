export async function post<T>(path: string, body: any, init?: RequestInit): Promise<T> {
	const res = await fetch(String(process.env.NEXT_PUBLIC_API_URL) + path, {
		method: 'POST', headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) }, body: JSON.stringify(body), ...init
	});
	if (!res.ok) throw new Error('Request failed');
	return res.json();
}