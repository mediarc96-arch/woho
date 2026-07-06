import { Module } from '@nestjs/common';
import { BookingModule } from '../booking/booking.module';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { GetTourRatingUseCase } from './application/use-cases/get-tour-rating.use-case';
import { GetTourReviewsUseCase } from './application/use-cases/get-tour-reviews.use-case';
import { REVIEW_REPOSITORY } from './domain/repositories/review.repository';
import { ReviewPrismaRepository } from './infrastructure/persistence/review.prisma.repository';
import { ReviewController } from './presentation/review.controller';

@Module({
  imports: [BookingModule],
  controllers: [ReviewController],
  providers: [
    CreateReviewUseCase,
    GetTourReviewsUseCase,
    GetTourRatingUseCase,
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewPrismaRepository,
    },
  ],
  exports: [REVIEW_REPOSITORY],
})
export class ReviewModule {}
