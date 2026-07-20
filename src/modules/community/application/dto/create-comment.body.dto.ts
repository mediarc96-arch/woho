import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MAX_COMMENT_LENGTH } from '../../domain/entities/comment.entity';

/** REST body for POST /community/posts/:id/comments — postId comes from the path. */
export class CreateCommentBodyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_COMMENT_LENGTH)
  content!: string;
}
