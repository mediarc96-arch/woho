import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { ValueObject } from '../../../../shared/domain/value-object.base';

interface RatingProps {
  value: number;
}

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export class Rating extends ValueObject<RatingProps> {
  private constructor(props: RatingProps) {
    super(props);
  }

  static create(value: number): Rating {
    if (!Number.isInteger(value)) {
      throw new InvalidArgumentException('Rating must be an integer');
    }
    if (value < MIN_RATING || value > MAX_RATING) {
      throw new InvalidArgumentException(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
    }
    return new Rating({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
