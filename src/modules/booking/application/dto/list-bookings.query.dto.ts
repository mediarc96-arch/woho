import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../domain/entities/booking.entity';

export class ListBookingsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
