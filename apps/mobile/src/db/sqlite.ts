import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('chat.db');

export async function initOrMigrate() {
	db.transaction(tx => {
		tx.executeSql(`CREATE TABLE IF NOT EXISTS messages(
			id TEXT PRIMARY KEY NOT NULL,
			chat_id TEXT NOT NULL,
			sender_id TEXT NOT NULL,
			ciphertext TEXT NOT NULL,
			header TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			status TEXT NOT NULL
		);`);
		tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at DESC);`);
	});
}

export function upsertMessage(m: {
	id: string; chat_id: string; sender_id: string; ciphertext: string; header: string; created_at: number; status: string;
}) {
	db.transaction(tx => {
		tx.executeSql(
			`INSERT OR REPLACE INTO messages (id, chat_id, sender_id, ciphertext, header, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[m.id, m.chat_id, m.sender_id, m.ciphertext, m.header, m.created_at, m.status]
		);
	});
}