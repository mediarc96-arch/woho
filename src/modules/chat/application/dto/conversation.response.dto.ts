import { Conversation } from '../../domain/entities/conversation.entity';

export class ConversationResponseDto {
  id: string;
  tourId: string;
  hostId: string;
  travelerId: string;
  lastMessageAt: Date | null;
  createdAt: Date;

  private constructor(conversation: Conversation) {
    this.id = conversation.id;
    this.tourId = conversation.tourId;
    this.hostId = conversation.hostId;
    this.travelerId = conversation.travelerId;
    this.lastMessageAt = conversation.lastMessageAt;
    this.createdAt = conversation.createdAt;
  }

  static fromEntity(conversation: Conversation): ConversationResponseDto {
    return new ConversationResponseDto(conversation);
  }
}
