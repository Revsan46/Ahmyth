export type MessagePayload = {
	id: string;
	chatId: string;
	senderId: string;
	header: string;
	ciphertext: string;
	createdAt: string;
};

export type SendMessageRequest = {
	clientId: string;
	chatId: string;
	header: string;
	ciphertext: string;
};