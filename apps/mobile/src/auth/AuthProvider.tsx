import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';
import { initOrMigrate } from '../db/sqlite';
import { ensureDeviceKeysUploaded } from '../e2ee/keys';

type AuthContextType = {
	token: string | null;
	signInWithOtp: (identifier: string, otp: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			await initOrMigrate();
			const t = await SecureStore.getItemAsync('auth_token');
			if (t) setToken(t);
		})();
	}, []);

	const signInWithOtp = async (identifier: string, otp: string) => {
		const { data } = await api.post<{ accessToken: string }>(`/auth/verify-otp`, { identifier, otp });
		await SecureStore.setItemAsync('auth_token', data.accessToken);
		setToken(data.accessToken);
		await ensureDeviceKeysUploaded(data.accessToken);
	};

	const signOut = async () => {
		await SecureStore.deleteItemAsync('auth_token');
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, signInWithOtp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};