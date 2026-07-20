import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { Booking, BookingStatus } from '../../../booking/domain/entities/booking.entity';
import { BookingRepository } from '../../../booking/domain/repositories/booking.repository';
import { Review } from '../../domain/entities/review.entity';
import {
  BookingNotCompletedException,
  NotBookingOwnerException,
  ReviewAlreadyExistsException,
} from '../../domain/exceptions/review.exceptions';
import {
  RatingSummary,
  ReviewRepository,
  TourRatingSummary,
} from '../../domain/repositories/review.repository';
import { Rating } from '../../domain/value-objects/rating.vo';
import { CreateReviewUseCase } from './create-review.use-case';

class FakeReviewRepository implements ReviewRepository {
  public readonly saved: Review[] = [];
  private readonly byBooking = new Map<string, Review>();
  seedForBooking(bookingId: string, review: Review): void {
    this.byBooking.set(bookingId, review);
  }
  save(review: Review): Promise<Review> {
    this.saved.push(review);
    this.byBooking.set(review.bookingId, review);
    return Promise.resolve(review);
  }
  findByBookingId(bookingId: string): Promise<Review | null> {
    return Promise.resolve(this.byBooking.get(bookingId) ?? null);
  }
  findByTour(): Promise<Review[]> {
    return Promise.resolve([]);
  }
  getTourRatingSummary(tourId: string): Promise<TourRatingSummary> {
    return Promise.resolve({ tourId, average: 0, count: 0 });
  }
  getRatingSummaryForTours(): Promise<RatingSummary> {
    return Promise.resolve({ average: 0, count: 0 });
  }
}

class FakeBookingRepository implements BookingRepository {
  private readonly bookings = new Map<string, Booking>();
  add(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }
  save(booking: Booking): Promise<Booking> {
    this.bookings.set(booking.id, booking);
    return Promise.resolve(booking);
  }
  findById(id: string): Promise<Booking | null> {
    return Promise.resolve(this.bookings.get(id) ?? null);
  }
  findForUser(): Promise<Booking[]> {
    return Promise.resolve([]);
  }
}

function booking(status: BookingStatus, travelerId = 'trav'): Booking {
  const now = new Date();
  return Booking.reconstitute('b1', {
    tourId: 't1',
    travelerId,
    scheduledAt: new Date(Date.now() + 86_400_000),
    headcount: 1,
    totalPrice: Money.create(2500),
    status,
    createdAt: now,
    updatedAt: now,
  });
}

describe('CreateReviewUseCase', () => {
  let reviews: FakeReviewRepository;
  let bookings: FakeBookingRepository;
  let useCase: CreateReviewUseCase;

  beforeEach(() => {
    reviews = new FakeReviewRepository();
    bookings = new FakeBookingRepository();
    useCase = new CreateReviewUseCase(reviews, bookings);
  });

  const cmd = (over = {}) => ({ bookingId: 'b1', authorId: 'trav', rating: 5, ...over });

  it('throws when the booking does not exist', async () => {
    await expect(useCase.execute(cmd())).rejects.toThrow(EntityNotFoundException);
  });

  it('rejects a reviewer who is not the booking owner', async () => {
    bookings.add(booking(BookingStatus.COMPLETED, 'someone-else'));
    await expect(useCase.execute(cmd())).rejects.toThrow(NotBookingOwnerException);
  });

  it('rejects reviewing a booking that is not completed', async () => {
    bookings.add(booking(BookingStatus.CONFIRMED));
    await expect(useCase.execute(cmd())).rejects.toThrow(BookingNotCompletedException);
  });

  it('rejects a duplicate review for the same booking', async () => {
    bookings.add(booking(BookingStatus.COMPLETED));
    reviews.seedForBooking(
      'b1',
      Review.create('r0', {
        bookingId: 'b1',
        tourId: 't1',
        authorId: 'trav',
        rating: Rating.create(4),
        comment: 'prior',
      }),
    );
    await expect(useCase.execute(cmd())).rejects.toThrow(ReviewAlreadyExistsException);
  });

  it('creates a review for a completed booking by its owner', async () => {
    bookings.add(booking(BookingStatus.COMPLETED));
    const review = await useCase.execute(cmd({ comment: 'Great!' }));
    expect(review.rating.value).toBe(5);
    expect(review.tourId).toBe('t1');
    expect(reviews.saved).toHaveLength(1);
  });
});
