import { Module } from '@nestjs/common';
import { TourModule } from '../tour/tour.module';
import { UserModule } from '../user/user.module';
import { CancelBookingUseCase } from './application/use-cases/cancel-booking.use-case';
import { CompleteBookingUseCase } from './application/use-cases/complete-booking.use-case';
import { ConfirmBookingUseCase } from './application/use-cases/confirm-booking.use-case';
import { CreateBookingUseCase } from './application/use-cases/create-booking.use-case';
import { GetBookingUseCase } from './application/use-cases/get-booking.use-case';
import { ListBookingsUseCase } from './application/use-cases/list-bookings.use-case';
import { BOOKING_REPOSITORY } from './domain/repositories/booking.repository';
import { BookingPrismaRepository } from './infrastructure/persistence/booking.prisma.repository';
import { BookingController } from './presentation/booking.controller';

@Module({
  imports: [UserModule, TourModule],
  controllers: [BookingController],
  providers: [
    CreateBookingUseCase,
    GetBookingUseCase,
    ListBookingsUseCase,
    ConfirmBookingUseCase,
    CancelBookingUseCase,
    CompleteBookingUseCase,
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingPrismaRepository,
    },
  ],
  exports: [BOOKING_REPOSITORY],
})
export class BookingModule {}
