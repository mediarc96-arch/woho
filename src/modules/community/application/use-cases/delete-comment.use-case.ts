import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  EntityNotFoundException,
  ForbiddenActionException,
} from '../../../../shared/domain/exceptions/domain.exception';
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from '../../domain/repositories/comment.repository';

export interface DeleteCommentCommand {
  commentId: string;
  actorId: string;
}

@Injectable()
export class DeleteCommentUseCase implements UseCase<DeleteCommentCommand, void> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute({ commentId, actorId }: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new EntityNotFoundException('Comment', commentId);
    }
    if (!comment.isAuthor(actorId)) {
      throw new ForbiddenActionException('Only the author can delete this comment');
    }

    await this.commentRepository.delete(commentId);
  }
}
