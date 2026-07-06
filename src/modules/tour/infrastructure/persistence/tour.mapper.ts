import {
  AfterTourOption as PrismaAfterTourOption,
  Tour as PrismaTour,
  TourCategory as PrismaTourCategory,
  TourStatus as PrismaTourStatus,
} from '@prisma/client';
import { AfterTourOption, Tour, TourCategory, TourStatus } from '../../domain/entities/tour.entity';
import { Money } from '../../../../shared/domain/value-objects/money.vo';

export class TourMapper {
  static toDomain(record: PrismaTour): Tour {
    return Tour.reconstitute(record.id, {
      hostId: record.hostId,
      title: record.title,
      description: record.description,
      category: record.category as unknown as TourCategory,
      city: record.city,
      price: Money.create(record.priceAmount, record.priceCurrency),
      durationMinutes: record.durationMinutes,
      meetingPoint: record.meetingPoint,
      afterTourOptions: record.afterTourOptions as unknown as AfterTourOption[],
      status: record.status as unknown as TourStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(tour: Tour): {
    id: string;
    hostId: string;
    title: string;
    description: string;
    category: PrismaTourCategory;
    city: string;
    priceAmount: number;
    priceCurrency: string;
    durationMinutes: number;
    meetingPoint: string;
    afterTourOptions: PrismaAfterTourOption[];
    status: PrismaTourStatus;
  } {
    return {
      id: tour.id,
      hostId: tour.hostId,
      title: tour.title,
      description: tour.description,
      category: tour.category,
      city: tour.city,
      priceAmount: tour.price.amount,
      priceCurrency: tour.price.currency,
      durationMinutes: tour.durationMinutes,
      meetingPoint: tour.meetingPoint,
      afterTourOptions: tour.afterTourOptions,
      status: tour.status,
    };
  }
}
