import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/auth/AuthProvider';

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack>
				<Stack.Screen name="index" options={{ title: 'Chats' }} />
				<Stack.Screen name="auth" options={{ title: 'Sign In' }} />
				<Stack.Screen name="chat/[chatId]" options={{ title: 'Chat' }} />
			</Stack>
		</AuthProvider>
	);
}