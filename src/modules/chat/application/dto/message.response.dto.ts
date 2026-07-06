import { Message } from '../../domain/entities/message.entity';

export class MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;

  private constructor(message: Message) {
    this.id = message.id;
    this.conversationId = message.conversationId;
    this.senderId = message.senderId;
    this.content = message.content;
    this.createdAt = message.createdAt;
  }

  static fromEntity(message: Message): MessageResponseDto {
    return new MessageResponseDto(message);
  }
}
