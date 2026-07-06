import { Message as PrismaMessage } from '@prisma/client';
import { Message } from '../../domain/entities/message.entity';

export class MessageMapper {
  static toDomain(record: PrismaMessage): Message {
    return Message.reconstitute(record.id, {
      conversationId: record.conversationId,
      senderId: record.senderId,
      content: record.content,
      createdAt: record.createdAt,
    });
  }

  static toPersistence(message: Message): {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: Date;
  } {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    };
  }
}
