import { Review as PrismaReview } from '@prisma/client';
import { Review } from '../../domain/entities/review.entity';
import { Rating } from '../../domain/value-objects/rating.vo';

export class ReviewMapper {
  static toDomain(record: PrismaReview): Review {
    return Review.reconstitute(record.id, {
      bookingId: record.bookingId,
      tourId: record.tourId,
      authorId: record.authorId,
      rating: Rating.create(record.rating),
      comment: record.comment,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(review: Review): {
    id: string;
    bookingId: string;
    tourId: string;
    authorId: string;
    rating: number;
    comment: string;
  } {
    return {
      id: review.id,
      bookingId: review.bookingId,
      tourId: review.tourId,
      authorId: review.authorId,
      rating: review.rating.value,
      comment: review.comment,
    };
  }
}
