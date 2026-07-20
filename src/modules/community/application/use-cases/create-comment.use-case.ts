import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Comment } from '../../domain/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from '../../domain/repositories/comment.repository';
import {
  COMMUNITY_POST_REPOSITORY,
  CommunityPostRepository,
} from '../../domain/repositories/community-post.repository';

export interface CreateCommentCommand {
  postId: string;
  authorId: string;
  content: string;
}

@Injectable()
export class CreateCommentUseCase implements UseCase<CreateCommentCommand, Comment> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(COMMUNITY_POST_REPOSITORY)
    private readonly postRepository: CommunityPostRepository,
  ) {}

  async execute(input: CreateCommentCommand): Promise<Comment> {
    const post = await this.postRepository.findById(input.postId);
    if (!post) {
      throw new EntityNotFoundException('CommunityPost', input.postId);
    }

    const comment = Comment.create(randomUUID(), {
      postId: post.id,
      authorId: input.authorId,
      content: input.content,
    });

    return this.commentRepository.save(comment);
  }
}
