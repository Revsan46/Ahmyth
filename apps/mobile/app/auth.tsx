import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/auth/AuthProvider';

export default function Auth() {
	const { signInWithOtp } = useAuth();
	const [identifier, setIdentifier] = useState('');
	const [otp, setOtp] = useState('');
	const router = useRouter();

	return (
		<View style={{ flex: 1, padding: 24, gap: 12 }}>
			<TextInput placeholder="email or phone" value={identifier} onChangeText={setIdentifier} style={{ borderWidth: 1, padding: 8 }} />
			<TextInput placeholder="otp" value={otp} onChangeText={setOtp} style={{ borderWidth: 1, padding: 8 }} />
			<Button title="Sign in" onPress={async () => { await signInWithOtp(identifier, otp); router.replace('/'); }} />
		</View>
	);
}