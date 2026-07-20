import { CommunityComment as PrismaComment } from '@prisma/client';
import { Comment } from '../../domain/entities/comment.entity';

export class CommentMapper {
  static toDomain(record: PrismaComment): Comment {
    return Comment.reconstitute(record.id, {
      postId: record.postId,
      authorId: record.authorId,
      content: record.content,
      createdAt: record.createdAt,
    });
  }

  static toPersistence(comment: Comment): {
    id: string;
    postId: string;
    authorId: string;
    content: string;
  } {
    return {
      id: comment.id,
      postId: comment.postId,
      authorId: comment.authorId,
      content: comment.content,
    };
  }
}
