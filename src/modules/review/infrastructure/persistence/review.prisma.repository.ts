import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Review } from '../../domain/entities/review.entity';
import {
  RatingSummary,
  ReviewRepository,
  TourRatingSummary,
} from '../../domain/repositories/review.repository';
import { ReviewMapper } from './review.mapper';

@Injectable()
export class ReviewPrismaRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review);
    const record = await this.prisma.review.create({ data });
    return ReviewMapper.toDomain(record);
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    const record = await this.prisma.review.findUnique({ where: { bookingId } });
    return record ? ReviewMapper.toDomain(record) : null;
  }

  async findByTour(tourId: string): Promise<Review[]> {
    const records = await this.prisma.review.findMany({
      where: { tourId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => ReviewMapper.toDomain(record));
  }

  async getTourRatingSummary(tourId: string): Promise<TourRatingSummary> {
    const summary = await this.getRatingSummaryForTours([tourId]);
    return { tourId, ...summary };
  }

  async getRatingSummaryForTours(tourIds: string[]): Promise<RatingSummary> {
    if (tourIds.length === 0) {
      return { average: 0, count: 0 };
    }

    const result = await this.prisma.review.aggregate({
      where: { tourId: { in: tourIds } },
      _avg: { rating: true },
      _count: true,
    });

    const average = result._avg.rating ?? 0;
    return {
      average: Math.round(average * 10) / 10,
      count: result._count,
    };
  }
}
