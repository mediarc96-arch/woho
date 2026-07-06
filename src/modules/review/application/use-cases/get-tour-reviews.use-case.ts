import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Review } from '../../domain/entities/review.entity';
import { REVIEW_REPOSITORY, ReviewRepository } from '../../domain/repositories/review.repository';

@Injectable()
export class GetTourReviewsUseCase implements UseCase<string, Review[]> {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(tourId: string): Promise<Review[]> {
    return this.reviewRepository.findByTour(tourId);
  }
}
