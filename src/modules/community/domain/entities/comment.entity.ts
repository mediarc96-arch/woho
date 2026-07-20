import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';

export const MAX_COMMENT_LENGTH = 2000;

export interface CommentProps {
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface CreateCommentProps {
  postId: string;
  authorId: string;
  content: string;
}

export class Comment extends Entity<CommentProps> {
  private constructor(id: string, props: CommentProps) {
    super(id, props);
  }

  static create(id: string, props: CreateCommentProps): Comment {
    const content = props.content.trim();
    if (content.length === 0) {
      throw new InvalidArgumentException('Comment content cannot be empty');
    }
    if (content.length > MAX_COMMENT_LENGTH) {
      throw new InvalidArgumentException(
        `Comment content cannot exceed ${MAX_COMMENT_LENGTH} characters`,
      );
    }

    return new Comment(id, {
      postId: props.postId,
      authorId: props.authorId,
      content,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: CommentProps): Comment {
    return new Comment(id, props);
  }

  isAuthor(userId: string): boolean {
    return this.props.authorId === userId;
  }

  get postId(): string {
    return this.props.postId;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
