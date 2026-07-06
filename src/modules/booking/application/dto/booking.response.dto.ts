import { Booking, BookingStatus } from '../../domain/entities/booking.entity';

export class BookingResponseDto {
  id: string;
  tourId: string;
  travelerId: string;
  scheduledAt: Date;
  headcount: number;
  totalPriceAmount: number;
  totalPriceCurrency: string;
  status: BookingStatus;
  createdAt: Date;

  private constructor(booking: Booking) {
    this.id = booking.id;
    this.tourId = booking.tourId;
    this.travelerId = booking.travelerId;
    this.scheduledAt = booking.scheduledAt;
    this.headcount = booking.headcount;
    this.totalPriceAmount = booking.totalPrice.amount;
    this.totalPriceCurrency = booking.totalPrice.currency;
    this.status = booking.status;
    this.createdAt = booking.createdAt;
  }

  static fromEntity(booking: Booking): BookingResponseDto {
    return new BookingResponseDto(booking);
  }
}
