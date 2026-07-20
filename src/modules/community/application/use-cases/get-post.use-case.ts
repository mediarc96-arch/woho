import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { CommunityPost } from '../../domain/entities/community-post.entity';
import {
  COMMUNITY_POST_REPOSITORY,
  CommunityPostRepository,
} from '../../domain/repositories/community-post.repository';

@Injectable()
export class GetPostUseCase implements UseCase<string, CommunityPost> {
  constructor(
    @Inject(COMMUNITY_POST_REPOSITORY)
    private readonly postRepository: CommunityPostRepository,
  ) {}

  async execute(id: string): Promise<CommunityPost> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new EntityNotFoundException('CommunityPost', id);
    }
    return post;
  }
}
