import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { AiModule } from './ai/ai.module';
import { PrismaService } from './prisma/prisma.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { KeysController } from './keys/keys.controller';

@Module({
	imports: [AuthModule, MediaModule, AiModule],
	controllers: [KeysController],
	providers: [PrismaService, ChatGateway, ChatService],
})
export class AppModule {}