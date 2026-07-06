import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { TourStatus } from '../../../tour/domain/entities/tour.entity';
import { TOUR_REPOSITORY, TourRepository } from '../../../tour/domain/repositories/tour.repository';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import { Booking } from '../../domain/entities/booking.entity';
import {
  HostCannotBookOwnTourException,
  TourNotBookableException,
} from '../../domain/exceptions/booking.exceptions';
import {
  BOOKING_REPOSITORY,
  BookingRepository,
} from '../../domain/repositories/booking.repository';
import { CreateBookingDto } from '../dto/create-booking.dto';

/** The authenticated traveler id is supplied by the controller from the JWT, not the request body. */
export type CreateBookingCommand = CreateBookingDto & { travelerId: string };

@Injectable()
export class CreateBookingUseCase implements UseCase<CreateBookingCommand, Booking> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateBookingCommand): Promise<Booking> {
    const traveler = await this.userRepository.findById(input.travelerId);
    if (!traveler) {
      throw new EntityNotFoundException('User', input.travelerId);
    }

    const tour = await this.tourRepository.findById(input.tourId);
    if (!tour) {
      throw new EntityNotFoundException('Tour', input.tourId);
    }
    if (tour.status !== TourStatus.PUBLISHED) {
      throw new TourNotBookableException(tour.id);
    }
    if (tour.hostId === traveler.id) {
      throw new HostCannotBookOwnTourException();
    }

    const booking = Booking.create(randomUUID(), {
      tourId: tour.id,
      travelerId: traveler.id,
      scheduledAt: input.scheduledAt,
      headcount: input.headcount,
      totalPrice: tour.price.multiply(input.headcount),
    });

    return this.bookingRepository.save(booking);
  }
}
