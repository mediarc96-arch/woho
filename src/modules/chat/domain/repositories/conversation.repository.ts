import { Conversation } from '../entities/conversation.entity';

export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');

export interface ConversationRepository {
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByTourAndTraveler(tourId: string, travelerId: string): Promise<Conversation | null>;
  findByParticipant(userId: string): Promise<Conversation[]>;
}
