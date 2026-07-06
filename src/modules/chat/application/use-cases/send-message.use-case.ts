import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class SendMessageUseCase implements UseCase<SendMessageDto, Message> {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: SendMessageDto): Promise<Message> {
    const conversation = await this.conversationRepository.findById(input.conversationId);
    if (!conversation) {
      throw new EntityNotFoundException('Conversation', input.conversationId);
    }
    if (!conversation.isParticipant(input.senderId)) {
      throw new NotConversationParticipantException(input.senderId);
    }

    const message = Message.create(randomUUID(), {
      conversationId: conversation.id,
      senderId: input.senderId,
      content: input.content,
    });

    const saved = await this.messageRepository.save(message);

    conversation.registerMessage(saved.createdAt);
    await this.conversationRepository.save(conversation);

    return saved;
  }
}
