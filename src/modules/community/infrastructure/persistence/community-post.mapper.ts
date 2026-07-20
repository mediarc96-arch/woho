import { CommunityPost as PrismaPost, PostType as PrismaPostType } from '@prisma/client';
import { CommunityPost, PostType } from '../../domain/entities/community-post.entity';

export class CommunityPostMapper {
  static toDomain(record: PrismaPost): CommunityPost {
    return CommunityPost.reconstitute(record.id, {
      authorId: record.authorId,
      type: record.type as unknown as PostType,
      country: record.country,
      city: record.city,
      travelDate: record.travelDate,
      title: record.title,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(post: CommunityPost): {
    id: string;
    authorId: string;
    type: PrismaPostType;
    country: string;
    city: string;
    travelDate: Date | null;
    title: string;
    content: string;
  } {
    return {
      id: post.id,
      authorId: post.authorId,
      type: post.type,
      country: post.country,
      city: post.city,
      travelDate: post.travelDate,
      title: post.title,
      content: post.content,
    };
  }
}
