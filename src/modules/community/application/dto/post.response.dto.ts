import { CommunityPost, PostType } from '../../domain/entities/community-post.entity';

export class PostResponseDto {
  id: string;
  authorId: string;
  type: PostType;
  country: string;
  city: string;
  travelDate: Date | null;
  title: string;
  content: string;
  createdAt: Date;

  private constructor(post: CommunityPost) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.type = post.type;
    this.country = post.country;
    this.city = post.city;
    this.travelDate = post.travelDate;
    this.title = post.title;
    this.content = post.content;
    this.createdAt = post.createdAt;
  }

  static fromEntity(post: CommunityPost): PostResponseDto {
    return new PostResponseDto(post);
  }
}
