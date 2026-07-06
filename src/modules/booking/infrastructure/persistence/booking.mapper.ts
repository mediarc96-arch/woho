import { Booking as PrismaBooking, BookingStatus as PrismaBookingStatus } from '@prisma/client';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';

export class BookingMapper {
  static toDomain(record: PrismaBooking): Booking {
    return Booking.reconstitute(record.id, {
      tourId: record.tourId,
      travelerId: record.travelerId,
      scheduledAt: record.scheduledAt,
      headcount: record.headcount,
      totalPrice: Money.create(record.priceAmount, record.priceCurrency),
      status: record.status as unknown as BookingStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(booking: Booking): {
    id: string;
    tourId: string;
    travelerId: string;
    scheduledAt: Date;
    headcount: number;
    priceAmount: number;
    priceCurrency: string;
    status: PrismaBookingStatus;
  } {
    return {
      id: booking.id,
      tourId: booking.tourId,
      travelerId: booking.travelerId,
      scheduledAt: booking.scheduledAt,
      headcount: booking.headcount,
      priceAmount: booking.totalPrice.amount,
      priceCurrency: booking.totalPrice.currency,
      status: booking.status,
    };
  }
}
