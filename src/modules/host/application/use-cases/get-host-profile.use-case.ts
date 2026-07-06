import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Tour, TourStatus } from '../../../tour/domain/entities/tour.entity';
import { TOUR_REPOSITORY, TourRepository } from '../../../tour/domain/repositories/tour.repository';
import { User, UserRole } from '../../../user/domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import {
  RatingSummary,
  REVIEW_REPOSITORY,
  ReviewRepository,
} from '../../../review/domain/repositories/review.repository';

export interface HostProfile {
  host: User;
  rating: RatingSummary;
  publishedTours: Tour[];
}

@Injectable()
export class GetHostProfileUseCase implements UseCase<string, HostProfile> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(hostId: string): Promise<HostProfile> {
    const host = await this.userRepository.findById(hostId);
    if (!host || host.role !== UserRole.HOST) {
      throw new EntityNotFoundException('Host', hostId);
    }

    const tours = await this.tourRepository.findMany({ hostId });

    // Reputation spans every tour the host has run, even archived ones.
    const rating = await this.reviewRepository.getRatingSummaryForTours(
      tours.map((tour) => tour.id),
    );

    // Only published tours are shown to visitors.
    const publishedTours = tours.filter((tour) => tour.status === TourStatus.PUBLISHED);

    return { host, rating, publishedTours };
  }
}
