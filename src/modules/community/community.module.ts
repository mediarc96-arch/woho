import { Module } from '@nestjs/common';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostUseCase } from './application/use-cases/get-post.use-case';
import { ListCommentsUseCase } from './application/use-cases/list-comments.use-case';
import { ListPostsUseCase } from './application/use-cases/list-posts.use-case';
import { COMMENT_REPOSITORY } from './domain/repositories/comment.repository';
import { COMMUNITY_POST_REPOSITORY } from './domain/repositories/community-post.repository';
import { CommentPrismaRepository } from './infrastructure/persistence/comment.prisma.repository';
import { CommunityPostPrismaRepository } from './infrastructure/persistence/community-post.prisma.repository';
import { CommunityController } from './presentation/community.controller';

@Module({
  controllers: [CommunityController],
  providers: [
    CreatePostUseCase,
    ListPostsUseCase,
    GetPostUseCase,
    DeletePostUseCase,
    CreateCommentUseCase,
    ListCommentsUseCase,
    DeleteCommentUseCase,
    {
      provide: COMMUNITY_POST_REPOSITORY,
      useClass: CommunityPostPrismaRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentPrismaRepository,
    },
  ],
})
export class CommunityModule {}
