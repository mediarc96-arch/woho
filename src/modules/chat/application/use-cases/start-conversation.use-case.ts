import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { TOUR_REPOSITORY, TourRepository } from '../../../tour/domain/repositories/tour.repository';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import {
  CONVERSATION_REPOSITORY,
  ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import { StartConversationDto } from '../dto/start-conversation.dto';

/** The authenticated traveler id is supplied from the JWT, not the request body. */
export type StartConversationCommand = StartConversationDto & { travelerId: string };

@Injectable()
export class StartConversationUseCase implements UseCase<StartConversationCommand, Conversation> {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: StartConversationCommand): Promise<Conversation> {
    const tour = await this.tourRepository.findById(input.tourId);
    if (!tour) {
      throw new EntityNotFoundException('Tour', input.tourId);
    }

    const traveler = await this.userRepository.findById(input.travelerId);
    if (!traveler) {
      throw new EntityNotFoundException('User', input.travelerId);
    }

    // Idempotent: reuse the existing conversation for this tour + traveler pair.
    const existing = await this.conversationRepository.findByTourAndTraveler(tour.id, traveler.id);
    if (existing) {
      return existing;
    }

    const conversation = Conversation.create(randomUUID(), {
      tourId: tour.id,
      hostId: tour.hostId,
      travelerId: traveler.id,
    });

    return this.conversationRepository.save(conversation);
  }
}
