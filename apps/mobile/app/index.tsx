import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../src/auth/AuthProvider';

export default function Home() {
	const router = useRouter();
	const { token } = useAuth();
	const chats = [{ id: 'demo-1', name: 'General' }];

	if (!token) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Link href="/auth">Sign in</Link>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={chats}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<View style={{ padding: 16, borderBottomWidth: 1 }}>
						<Text style={{ fontSize: 18 }}>{item.name}</Text>
						<Button title="Open" onPress={() => router.push(`/chat/${item.id}`)} />
					</View>
				)}
			/>
		</View>
	);
}