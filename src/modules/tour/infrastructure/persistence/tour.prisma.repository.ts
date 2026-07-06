import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Tour } from '../../domain/entities/tour.entity';
import { FindToursFilter, TourRepository } from '../../domain/repositories/tour.repository';
import { TourMapper } from './tour.mapper';

@Injectable()
export class TourPrismaRepository implements TourRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tour: Tour): Promise<Tour> {
    const data = TourMapper.toPersistence(tour);
    const record = await this.prisma.tour.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
    return TourMapper.toDomain(record);
  }

  async findById(id: string): Promise<Tour | null> {
    const record = await this.prisma.tour.findUnique({ where: { id } });
    return record ? TourMapper.toDomain(record) : null;
  }

  async findMany(filter: FindToursFilter): Promise<Tour[]> {
    const records = await this.prisma.tour.findMany({
      where: {
        city: filter.city,
        hostId: filter.hostId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => TourMapper.toDomain(record));
  }
}
