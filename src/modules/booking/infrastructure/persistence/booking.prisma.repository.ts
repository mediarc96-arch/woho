import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Booking } from '../../domain/entities/booking.entity';
import {
  BookingRepository,
  FindBookingsForUser,
} from '../../domain/repositories/booking.repository';
import { BookingMapper } from './booking.mapper';

@Injectable()
export class BookingPrismaRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(booking: Booking): Promise<Booking> {
    const data = BookingMapper.toPersistence(booking);
    const record = await this.prisma.booking.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
    return BookingMapper.toDomain(record);
  }

  async findById(id: string): Promise<Booking | null> {
    const record = await this.prisma.booking.findUnique({ where: { id } });
    return record ? BookingMapper.toDomain(record) : null;
  }

  async findForUser(query: FindBookingsForUser): Promise<Booking[]> {
    const records = await this.prisma.booking.findMany({
      where: {
        status: query.status,
        OR: [{ travelerId: query.userId }, { tour: { hostId: query.userId } }],
      },
      orderBy: { scheduledAt: 'asc' },
    });
    return records.map((record) => BookingMapper.toDomain(record));
  }
}
