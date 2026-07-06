import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  EntityNotFoundException,
  ForbiddenActionException,
} from '../../../../shared/domain/exceptions/domain.exception';
import { Tour } from '../../domain/entities/tour.entity';
import { TOUR_REPOSITORY, TourRepository } from '../../domain/repositories/tour.repository';

export interface PublishTourCommand {
  tourId: string;
  actorId: string;
}

@Injectable()
export class PublishTourUseCase implements UseCase<PublishTourCommand, Tour> {
  constructor(
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
  ) {}

  async execute({ tourId, actorId }: PublishTourCommand): Promise<Tour> {
    const tour = await this.tourRepository.findById(tourId);
    if (!tour) {
      throw new EntityNotFoundException('Tour', tourId);
    }
    if (tour.hostId !== actorId) {
      throw new ForbiddenActionException('Only the host can publish this tour');
    }

    tour.publish();
    return this.tourRepository.save(tour);
  }
}
