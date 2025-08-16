import { MessageBody, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ path: '/ws', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer() server!: Server;
	constructor(private readonly chat: ChatService) {}

	async handleConnection(client: Socket) {
		const user = await this.chat.authenticate(client.handshake.auth?.token);
		if (!user) return client.disconnect();
		await this.chat.setPresence(user.id, client.id, true);
		client.on('disconnect', () => this.chat.setPresence(user.id, client.id, false));
	}

	@SubscribeMessage('message:send')
	async onMessageSend(@ConnectedSocket() client: Socket, @MessageBody() body: { clientId: string; chatId: string; ciphertext: string; header: string; }) {
		const user = await this.chat.authenticate(client.handshake.auth?.token);
		if (!user) return;
		const saved = await this.chat.persistMessage({ chatId: body.chatId, senderId: user.id, ciphertext: body.ciphertext, header: body.header });
		client.emit('message:ack', { clientId: body.clientId, id: saved.id, createdAt: saved.createdAt });
		await this.chat.fanout(saved);
		return true;
	}
}