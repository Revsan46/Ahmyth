import React, { useEffect, useRef, useState } from 'react';
import { FlatList, TextInput, View, Text, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getSocket } from '../../src/ws/socket';
import { upsertMessage, db } from '../../src/db/sqlite';
import { v4 as uuid } from 'uuid';

export default function ChatThread() {
	const { chatId } = useLocalSearchParams<{ chatId: string }>();
	const [input, setInput] = useState('');
	const [items, setItems] = useState<any[]>([]);
	const listRef = useRef<FlatList>(null);

	useEffect(() => {
		if (!chatId) return;
		db.readTransaction(tx => {
			tx.executeSql(
				`SELECT * FROM messages WHERE chat_id=? ORDER BY created_at DESC LIMIT 100`,
				[chatId],
				(_, { rows }) => setItems(rows._array)
			);
		});
		(async () => {
			const socket = await getSocket();
			socket.on('message:new', (m: any) => {
				upsertMessage({ ...m, status: 'delivered' });
				setItems(prev => [m, ...prev]);
			});
			socket.on('message:ack', (ack: any) => {
				setItems(prev => prev.map(x => x.id === ack.clientId ? { ...x, id: ack.id, created_at: ack.createdAt, status: 'sent' } : x));
			});
		})();
	}, [chatId]);

	const onSend = async () => {
		if (!input.trim() || !chatId) return;
		const tmpId = uuid();
		const now = Date.now();
		const optimistic = { id: tmpId, chat_id: String(chatId), sender_id: 'me', ciphertext: input.trim(), header: '{}', created_at: now, status: 'sending' };
		upsertMessage(optimistic);
		setItems(prev => [optimistic, ...prev]);
		setInput('');
		const socket = await getSocket();
		socket.emit('message:send', { clientId: tmpId, chatId, ciphertext: optimistic.ciphertext, header: optimistic.header }, (serverAck: any) => {
			if (serverAck?.id) {
				setItems(prev => prev.map(x => x.id === tmpId ? { ...x, id: serverAck.id, created_at: serverAck.createdAt, status: 'sent' } : x));
			}
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				ref={listRef}
				data={items}
				inverted
				keyExtractor={(m) => m.id}
				renderItem={({ item }) => <Text style={{ padding: 8 }}>{item.ciphertext}</Text>}
			/>
			<View style={{ flexDirection: 'row', padding: 8 }}>
				<TextInput style={{ flex: 1, borderWidth: 1 }} value={input} onChangeText={setInput} />
				<Button title="Send" onPress={onSend} />
			</View>
		</View>
	);
}