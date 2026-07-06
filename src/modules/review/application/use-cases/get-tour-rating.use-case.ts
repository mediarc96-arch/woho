import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  REVIEW_REPOSITORY,
  ReviewRepository,
  TourRatingSummary,
} from '../../domain/repositories/review.repository';

@Injectable()
export class GetTourRatingUseCase implements UseCase<string, TourRatingSummary> {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(tourId: string): Promise<TourRatingSummary> {
    return this.reviewRepository.getTourRatingSummary(tourId);
  }
}
