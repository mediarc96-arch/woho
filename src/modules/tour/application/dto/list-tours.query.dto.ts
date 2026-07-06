import { IsOptional, IsString } from 'class-validator';

export class ListToursQueryDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  hostId?: string;
}
