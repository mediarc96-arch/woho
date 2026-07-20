import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';

export enum PostType {
  COMPANION = 'COMPANION',
  INFO = 'INFO',
}

export const MAX_POST_TITLE_LENGTH = 200;
export const MAX_POST_CONTENT_LENGTH = 5000;

export interface CommunityPostProps {
  authorId: string;
  type: PostType;
  country: string;
  city: string;
  travelDate: Date | null;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommunityPostProps {
  authorId: string;
  type: PostType;
  country: string;
  city: string;
  travelDate?: Date | null;
  title: string;
  content: string;
}

export class CommunityPost extends Entity<CommunityPostProps> {
  private constructor(id: string, props: CommunityPostProps) {
    super(id, props);
  }

  static create(id: string, props: CreateCommunityPostProps): CommunityPost {
    const title = props.title.trim();
    const content = props.content.trim();
    if (title.length === 0) {
      throw new InvalidArgumentException('Post title cannot be empty');
    }
    if (title.length > MAX_POST_TITLE_LENGTH) {
      throw new InvalidArgumentException(
        `Post title cannot exceed ${MAX_POST_TITLE_LENGTH} characters`,
      );
    }
    if (content.length === 0) {
      throw new InvalidArgumentException('Post content cannot be empty');
    }
    if (content.length > MAX_POST_CONTENT_LENGTH) {
      throw new InvalidArgumentException(
        `Post content cannot exceed ${MAX_POST_CONTENT_LENGTH} characters`,
      );
    }

    const now = new Date();
    return new CommunityPost(id, {
      authorId: props.authorId,
      type: props.type,
      country: props.country,
      city: props.city,
      travelDate: props.travelDate ?? null,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: CommunityPostProps): CommunityPost {
    return new CommunityPost(id, props);
  }

  isAuthor(userId: string): boolean {
    return this.props.authorId === userId;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get type(): PostType {
    return this.props.type;
  }

  get country(): string {
    return this.props.country;
  }

  get city(): string {
    return this.props.city;
  }

  get travelDate(): Date | null {
    return this.props.travelDate;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
