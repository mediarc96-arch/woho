import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { MAX_RATING, MIN_RATING } from '../../domain/value-objects/rating.vo';
import { MAX_COMMENT_LENGTH } from '../../domain/entities/review.entity';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsInt()
  @Min(MIN_RATING)
  @Max(MAX_RATING)
  @Type(() => Number)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_COMMENT_LENGTH)
  comment?: string;
}
