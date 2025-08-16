'use client';
import { useState } from 'react';

export default function Page() {
	const [identifier, setIdentifier] = useState('');
	const [otp, setOtp] = useState('');
	const [token, setToken] = useState<string | null>(null);

	const requestOtp = async () => {
		await fetch(String(process.env.NEXT_PUBLIC_API_URL) + '/auth/request-otp', {
			method: 'POST', headers: {'Content-Type':'application/json'},
			body: JSON.stringify({ identifier })
		});
	};
	const verifyOtp = async () => {
		const res = await fetch(String(process.env.NEXT_PUBLIC_API_URL) + '/auth/verify-otp', {
			method: 'POST', headers: {'Content-Type':'application/json'},
			body: JSON.stringify({ identifier, otp })
		});
		const data = await res.json();
		setToken(data.accessToken);
	};

	return (
		<main style={{ padding: 24 }}>
			{!token ? (
				<div>
					<input placeholder="email or phone" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
					<button onClick={requestOtp}>Request OTP</button>
					<input placeholder="OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
					<button onClick={verifyOtp}>Sign in</button>
				</div>
			) : <div>Signed in</div>}
		</main>
	);
}