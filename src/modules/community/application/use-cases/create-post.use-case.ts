import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { CommunityPost } from '../../domain/entities/community-post.entity';
import {
  COMMUNITY_POST_REPOSITORY,
  CommunityPostRepository,
} from '../../domain/repositories/community-post.repository';
import { CreatePostDto } from '../dto/create-post.dto';

/** The authenticated author id is supplied by the controller from the JWT. */
export type CreatePostCommand = CreatePostDto & { authorId: string };

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostCommand, CommunityPost> {
  constructor(
    @Inject(COMMUNITY_POST_REPOSITORY)
    private readonly postRepository: CommunityPostRepository,
  ) {}

  async execute(input: CreatePostCommand): Promise<CommunityPost> {
    const post = CommunityPost.create(randomUUID(), {
      authorId: input.authorId,
      type: input.type,
      country: input.country,
      city: input.city,
      travelDate: input.travelDate ?? null,
      title: input.title,
      content: input.content,
    });

    return this.postRepository.save(post);
  }
}
