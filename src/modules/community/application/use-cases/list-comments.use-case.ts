import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Comment } from '../../domain/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from '../../domain/repositories/comment.repository';

@Injectable()
export class ListCommentsUseCase implements UseCase<string, Comment[]> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(postId: string): Promise<Comment[]> {
    return this.commentRepository.findByPost(postId);
  }
}
