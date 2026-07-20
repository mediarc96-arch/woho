import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { CommunityPost } from '../../domain/entities/community-post.entity';
import {
  COMMUNITY_POST_REPOSITORY,
  CommunityPostRepository,
  FindPostsFilter,
} from '../../domain/repositories/community-post.repository';

@Injectable()
export class ListPostsUseCase implements UseCase<FindPostsFilter, CommunityPost[]> {
  constructor(
    @Inject(COMMUNITY_POST_REPOSITORY)
    private readonly postRepository: CommunityPostRepository,
  ) {}

  async execute(filter: FindPostsFilter = {}): Promise<CommunityPost[]> {
    return this.postRepository.findMany(filter);
  }
}
