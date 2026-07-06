import { Conversation as PrismaConversation } from '@prisma/client';
import { Conversation } from '../../domain/entities/conversation.entity';

export class ConversationMapper {
  static toDomain(record: PrismaConversation): Conversation {
    return Conversation.reconstitute(record.id, {
      tourId: record.tourId,
      hostId: record.hostId,
      travelerId: record.travelerId,
      lastMessageAt: record.lastMessageAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(conversation: Conversation): {
    id: string;
    tourId: string;
    hostId: string;
    travelerId: string;
    lastMessageAt: Date | null;
  } {
    return {
      id: conversation.id,
      tourId: conversation.tourId,
      hostId: conversation.hostId,
      travelerId: conversation.travelerId,
      lastMessageAt: conversation.lastMessageAt,
    };
  }
}
