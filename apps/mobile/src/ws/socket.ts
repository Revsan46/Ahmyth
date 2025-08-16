import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
	if (socket) return socket;
	const token = await SecureStore.getItemAsync('auth_token');
	socket = io(process.env.EXPO_PUBLIC_WS_URL!, {
		transports: ['websocket'],
		auth: { token },
	});
	return socket;
}