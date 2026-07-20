import { Comment } from '../../domain/entities/comment.entity';

export class CommentResponseDto {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;

  private constructor(comment: Comment) {
    this.id = comment.id;
    this.postId = comment.postId;
    this.authorId = comment.authorId;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
  }

  static fromEntity(comment: Comment): CommentResponseDto {
    return new CommentResponseDto(comment);
  }
}
