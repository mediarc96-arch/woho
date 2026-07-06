import { Review } from '../../domain/entities/review.entity';

export class ReviewResponseDto {
  id: string;
  bookingId: string;
  tourId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: Date;

  private constructor(review: Review) {
    this.id = review.id;
    this.bookingId = review.bookingId;
    this.tourId = review.tourId;
    this.authorId = review.authorId;
    this.rating = review.rating.value;
    this.comment = review.comment;
    this.createdAt = review.createdAt;
  }

  static fromEntity(review: Review): ReviewResponseDto {
    return new ReviewResponseDto(review);
  }
}
