import { Message } from '../entities/message.entity';

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');

export interface FindMessagesOptions {
  limit: number;
  /** Return messages created strictly before this timestamp (cursor pagination). */
  before?: Date;
}

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findByConversation(conversationId: string, options: FindMessagesOptions): Promise<Message[]>;
}
