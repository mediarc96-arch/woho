import { TourRatingSummary } from '../../domain/repositories/review.repository';

export class TourRatingResponseDto {
  tourId: string;
  average: number;
  count: number;

  private constructor(summary: TourRatingSummary) {
    this.tourId = summary.tourId;
    this.average = summary.average;
    this.count = summary.count;
  }

  static fromSummary(summary: TourRatingSummary): TourRatingResponseDto {
    return new TourRatingResponseDto(summary);
  }
}
