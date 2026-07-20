import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { Principal } from '../../auth/presentation/principal';
import { CommentResponseDto } from '../application/dto/comment.response.dto';
import { CreateCommentBodyDto } from '../application/dto/create-comment.body.dto';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { ListPostsQueryDto } from '../application/dto/list-posts.query.dto';
import { PostResponseDto } from '../application/dto/post.response.dto';
import { CreateCommentUseCase } from '../application/use-cases/create-comment.use-case';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { DeleteCommentUseCase } from '../application/use-cases/delete-comment.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { ListCommentsUseCase } from '../application/use-cases/list-comments.use-case';
import { ListPostsUseCase } from '../application/use-cases/list-posts.use-case';

@Controller('community/posts')
export class CommunityController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @CurrentUser() user: Principal,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.createPostUseCase.execute({ ...dto, authorId: user.userId });
    return PostResponseDto.fromEntity(post);
  }

  @Get()
  async listPosts(@Query() query: ListPostsQueryDto): Promise<PostResponseDto[]> {
    const posts = await this.listPostsUseCase.execute(query);
    return posts.map((post) => PostResponseDto.fromEntity(post));
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.getPostUseCase.execute(id);
    return PostResponseDto.fromEntity(post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@CurrentUser() user: Principal, @Param('id') id: string): Promise<void> {
    await this.deletePostUseCase.execute({ postId: id, actorId: user.userId });
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
    @Body() dto: CreateCommentBodyDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.createCommentUseCase.execute({
      postId: id,
      authorId: user.userId,
      content: dto.content,
    });
    return CommentResponseDto.fromEntity(comment);
  }

  @Get(':id/comments')
  async listComments(@Param('id') id: string): Promise<CommentResponseDto[]> {
    const comments = await this.listCommentsUseCase.execute(id);
    return comments.map((comment) => CommentResponseDto.fromEntity(comment));
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @CurrentUser() user: Principal,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    await this.deleteCommentUseCase.execute({ commentId, actorId: user.userId });
  }
}
