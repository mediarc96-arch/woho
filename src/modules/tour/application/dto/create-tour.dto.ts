import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AfterTourOption, TourCategory } from '../../domain/entities/tour.entity';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(TourCategory)
  category!: TourCategory;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  priceAmount!: number;

  @IsOptional()
  @IsString()
  priceCurrency?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  durationMinutes!: number;

  @IsString()
  @IsNotEmpty()
  meetingPoint!: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(AfterTourOption, { each: true })
  afterTourOptions?: AfterTourOption[];
}
