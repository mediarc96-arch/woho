import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Rating } from '../value-objects/rating.vo';

export const MAX_COMMENT_LENGTH = 2000;

export interface ReviewProps {
  bookingId: string;
  tourId: string;
  authorId: string;
  rating: Rating;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewProps {
  bookingId: string;
  tourId: string;
  authorId: string;
  rating: Rating;
  comment: string;
}

export class Review extends Entity<ReviewProps> {
  private constructor(id: string, props: ReviewProps) {
    super(id, props);
  }

  static create(id: string, props: CreateReviewProps): Review {
    const comment = props.comment.trim();
    if (comment.length > MAX_COMMENT_LENGTH) {
      throw new InvalidArgumentException(
        `Review comment cannot exceed ${MAX_COMMENT_LENGTH} characters`,
      );
    }

    const now = new Date();
    return new Review(id, {
      bookingId: props.bookingId,
      tourId: props.tourId,
      authorId: props.authorId,
      rating: props.rating,
      comment,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: ReviewProps): Review {
    return new Review(id, props);
  }

  get bookingId(): string {
    return this.props.bookingId;
  }

  get tourId(): string {
    return this.props.tourId;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get rating(): Rating {
    return this.props.rating;
  }

  get comment(): string {
    return this.props.comment;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
