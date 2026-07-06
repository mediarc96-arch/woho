import { Module } from '@nestjs/common';
import { TourModule } from '../tour/tour.module';
import { UserModule } from '../user/user.module';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { ListConversationsUseCase } from './application/use-cases/list-conversations.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { StartConversationUseCase } from './application/use-cases/start-conversation.use-case';
import { CONVERSATION_REPOSITORY } from './domain/repositories/conversation.repository';
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { ConversationPrismaRepository } from './infrastructure/persistence/conversation.prisma.repository';
import { MessagePrismaRepository } from './infrastructure/persistence/message.prisma.repository';
import { ChatController } from './presentation/chat.controller';
import { ChatGateway } from './presentation/chat.gateway';

@Module({
  imports: [UserModule, TourModule],
  controllers: [ChatController],
  providers: [
    StartConversationUseCase,
    ListConversationsUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
    ChatGateway,
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: ConversationPrismaRepository,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessagePrismaRepository,
    },
  ],
})
export class ChatModule {}
