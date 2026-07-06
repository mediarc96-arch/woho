import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { BookingStatus } from '../../../booking/domain/entities/booking.entity';
import {
  BOOKING_REPOSITORY,
  BookingRepository,
} from '../../../booking/domain/repositories/booking.repository';
import { Review } from '../../domain/entities/review.entity';
import {
  BookingNotCompletedException,
  NotBookingOwnerException,
  ReviewAlreadyExistsException,
} from '../../domain/exceptions/review.exceptions';
import { REVIEW_REPOSITORY, ReviewRepository } from '../../domain/repositories/review.repository';
import { Rating } from '../../domain/value-objects/rating.vo';
import { CreateReviewDto } from '../dto/create-review.dto';

/** The authenticated author id is supplied by the controller from the JWT, not the request body. */
export type CreateReviewCommand = CreateReviewDto & { authorId: string };

@Injectable()
export class CreateReviewUseCase implements UseCase<CreateReviewCommand, Review> {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(input: CreateReviewCommand): Promise<Review> {
    const booking = await this.bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new EntityNotFoundException('Booking', input.bookingId);
    }
    if (booking.travelerId !== input.authorId) {
      throw new NotBookingOwnerException(input.authorId);
    }
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BookingNotCompletedException(booking.id);
    }

    const existing = await this.reviewRepository.findByBookingId(booking.id);
    if (existing) {
      throw new ReviewAlreadyExistsException(booking.id);
    }

    const review = Review.create(randomUUID(), {
      bookingId: booking.id,
      tourId: booking.tourId,
      authorId: input.authorId,
      rating: Rating.create(input.rating),
      comment: input.comment ?? '',
    });

    return this.reviewRepository.save(review);
  }
}
