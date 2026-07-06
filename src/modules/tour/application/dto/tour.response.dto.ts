import { AfterTourOption, Tour, TourCategory, TourStatus } from '../../domain/entities/tour.entity';

export class TourResponseDto {
  id: string;
  hostId: string;
  title: string;
  description: string;
  category: TourCategory;
  city: string;
  priceAmount: number;
  priceCurrency: string;
  durationMinutes: number;
  meetingPoint: string;
  afterTourOptions: AfterTourOption[];
  status: TourStatus;
  createdAt: Date;

  private constructor(tour: Tour) {
    this.id = tour.id;
    this.hostId = tour.hostId;
    this.title = tour.title;
    this.description = tour.description;
    this.category = tour.category;
    this.city = tour.city;
    this.priceAmount = tour.price.amount;
    this.priceCurrency = tour.price.currency;
    this.durationMinutes = tour.durationMinutes;
    this.meetingPoint = tour.meetingPoint;
    this.afterTourOptions = tour.afterTourOptions;
    this.status = tour.status;
    this.createdAt = tour.createdAt;
  }

  static fromEntity(tour: Tour): TourResponseDto {
    return new TourResponseDto(tour);
  }
}
