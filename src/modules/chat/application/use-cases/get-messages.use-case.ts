import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Message } from '../../domain/entities/message.entity';
import { NotConversationParticipantException } from '../../domain/exceptions/chat.exceptions';
import {
  CONVERSATION_REPOSITORY,
  ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import {
  MESSAGE_REPOSITORY,
  MessageRepository,
} from '../../domain/repositories/message.repository';

export interface GetMessagesInput {
  conversationId: string;
  /** Authenticated caller — must be a participant of the conversation. */
  actorId: string;
  limit?: number;
  before?: Date;
}

const DEFAULT_LIMIT = 50;

@Injectable()
export class GetMessagesUseCase implements UseCase<GetMessagesInput, Message[]> {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: GetMessagesInput): Promise<Message[]> {
    const conversation = await this.conversationRepository.findById(input.conversationId);
    if (!conversation) {
      throw new EntityNotFoundException('Conversation', input.conversationId);
    }
    if (!conversation.isParticipant(input.actorId)) {
      throw new NotConversationParticipantException(input.actorId);
    }

    return this.messageRepository.findByConversation(conversation.id, {
      limit: input.limit ?? DEFAULT_LIMIT,
      before: input.before,
    });
  }
}
