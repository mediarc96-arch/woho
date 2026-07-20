import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
  PostType,
} from '../../domain/entities/community-post.entity';

export class CreatePostDto {
  @IsEnum(PostType)
  type!: PostType;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  travelDate?: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_POST_TITLE_LENGTH)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_POST_CONTENT_LENGTH)
  content!: string;
}
