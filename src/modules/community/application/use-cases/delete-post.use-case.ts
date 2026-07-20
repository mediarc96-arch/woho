import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  EntityNotFoundException,
  ForbiddenActionException,
} from '../../../../shared/domain/exceptions/domain.exception';
import {
  COMMUNITY_POST_REPOSITORY,
  CommunityPostRepository,
} from '../../domain/repositories/community-post.repository';

export interface DeletePostCommand {
  postId: string;
  actorId: string;
}

@Injectable()
export class DeletePostUseCase implements UseCase<DeletePostCommand, void> {
  constructor(
    @Inject(COMMUNITY_POST_REPOSITORY)
    private readonly postRepository: CommunityPostRepository,
  ) {}

  async execute({ postId, actorId }: DeletePostCommand): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new EntityNotFoundException('CommunityPost', postId);
    }
    if (!post.isAuthor(actorId)) {
      throw new ForbiddenActionException('Only the author can delete this post');
    }

    await this.postRepository.delete(postId);
  }
}
