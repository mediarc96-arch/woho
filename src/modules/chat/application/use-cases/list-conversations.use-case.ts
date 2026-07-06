import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Conversation } from '../../domain/entities/conversation.entity';
import {
  CONVERSATION_REPOSITORY,
  ConversationRepository,
} from '../../domain/repositories/conversation.repository';

@Injectable()
export class ListConversationsUseCase implements UseCase<string, Conversation[]> {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByParticipant(userId);
  }
}
