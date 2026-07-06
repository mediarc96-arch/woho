import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { Principal } from '../../auth/presentation/principal';
import { BookingResponseDto } from '../application/dto/booking.response.dto';
import { CreateBookingDto } from '../application/dto/create-booking.dto';
import { ListBookingsQueryDto } from '../application/dto/list-bookings.query.dto';
import { CancelBookingUseCase } from '../application/use-cases/cancel-booking.use-case';
import { CompleteBookingUseCase } from '../application/use-cases/complete-booking.use-case';
import { ConfirmBookingUseCase } from '../application/use-cases/confirm-booking.use-case';
import { CreateBookingUseCase } from '../application/use-cases/create-booking.use-case';
import { GetBookingUseCase } from '../application/use-cases/get-booking.use-case';
import { ListBookingsUseCase } from '../application/use-cases/list-bookings.use-case';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingUseCase: GetBookingUseCase,
    private readonly listBookingsUseCase: ListBookingsUseCase,
    private readonly confirmBookingUseCase: ConfirmBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly completeBookingUseCase: CompleteBookingUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: Principal,
    @Body() dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.createBookingUseCase.execute({
      ...dto,
      travelerId: user.userId,
    });
    return BookingResponseDto.fromEntity(booking);
  }

  @Get()
  async findAll(
    @CurrentUser() user: Principal,
    @Query() query: ListBookingsQueryDto,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.listBookingsUseCase.execute({
      userId: user.userId,
      status: query.status,
    });
    return bookings.map((booking) => BookingResponseDto.fromEntity(booking));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.getBookingUseCase.execute({ bookingId: id, actorId: user.userId });
    return BookingResponseDto.fromEntity(booking);
  }

  @Patch(':id/confirm')
  async confirm(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.confirmBookingUseCase.execute({
      bookingId: id,
      actorId: user.userId,
    });
    return BookingResponseDto.fromEntity(booking);
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.cancelBookingUseCase.execute({
      bookingId: id,
      actorId: user.userId,
    });
    return BookingResponseDto.fromEntity(booking);
  }

  @Patch(':id/complete')
  async complete(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.completeBookingUseCase.execute({
      bookingId: id,
      actorId: user.userId,
    });
    return BookingResponseDto.fromEntity(booking);
  }
}
