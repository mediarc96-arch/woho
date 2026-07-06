import { Review } from '../entities/review.entity';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export interface RatingSummary {
  average: number; // 0 when there are no reviews
  count: number;
}

export interface TourRatingSummary extends RatingSummary {
  tourId: string;
}

export interface ReviewRepository {
  save(review: Review): Promise<Review>;
  findByBookingId(bookingId: string): Promise<Review | null>;
  findByTour(tourId: string): Promise<Review[]>;
  getTourRatingSummary(tourId: string): Promise<TourRatingSummary>;
  /** Aggregate rating across many tours (e.g. all tours owned by a host). */
  getRatingSummaryForTours(tourIds: string[]): Promise<RatingSummary>;
}
