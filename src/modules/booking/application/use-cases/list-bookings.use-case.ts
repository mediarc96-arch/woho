import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import {
  BOOKING_REPOSITORY,
  BookingRepository,
} from '../../domain/repositories/booking.repository';

export interface ListBookingsQuery {
  userId: string;
  status?: BookingStatus;
}

@Injectable()
export class ListBookingsUseCase implements UseCase<ListBookingsQuery, Booking[]> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(query: ListBookingsQuery): Promise<Booking[]> {
    return this.bookingRepository.findForUser(query);
  }
}
