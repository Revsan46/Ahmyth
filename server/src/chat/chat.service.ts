import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type SavedMessage = { id: string; chatId: string; senderId: string; ciphertext: string; header: string; createdAt: string };

const messages: SavedMessage[] = [];

@Injectable()
export class ChatService {
	async authenticate(token?: string): Promise<{ id: string } | null> {
		if (!token) return null;
		return { id: 'demo-user' };
	}

	async setPresence(userId: string, socketId: string, online: boolean) {
		// TODO: store in Redis sets
	}

	async persistMessage(input: { chatId: string; senderId: string; ciphertext: string; header: string }): Promise<SavedMessage> {
		const saved: SavedMessage = { id: randomUUID(), chatId: input.chatId, senderId: input.senderId, ciphertext: input.ciphertext, header: input.header, createdAt: new Date().toISOString() };
		messages.push(saved);
		return saved;
	}

	async fanout(message: SavedMessage) {
		// TODO: use Redis pub/sub for multi-instance
	}
}