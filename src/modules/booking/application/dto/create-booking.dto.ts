import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tourId!: string;

  @IsDate()
  @Type(() => Date)
  scheduledAt!: Date;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  headcount!: number;
}
