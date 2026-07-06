import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { TOUR_REPOSITORY, TourRepository } from '../../../tour/domain/repositories/tour.repository';
import { Booking } from '../../domain/entities/booking.entity';
import {
  BOOKING_REPOSITORY,
  BookingRepository,
} from '../../domain/repositories/booking.repository';
import { BookingActionCommand } from '../dto/booking-action.command';
import { assertTourHost } from '../policies/booking-access.policy';

@Injectable()
export class CompleteBookingUseCase implements UseCase<BookingActionCommand, Booking> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
  ) {}

  async execute({ bookingId, actorId }: BookingActionCommand): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundException('Booking', bookingId);
    }

    const tour = await this.tourRepository.findById(booking.tourId);
    if (!tour) {
      throw new EntityNotFoundException('Tour', booking.tourId);
    }
    assertTourHost(tour, actorId);

    booking.complete();
    return this.bookingRepository.save(booking);
  }
}
