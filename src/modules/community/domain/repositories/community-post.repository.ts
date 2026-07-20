import { CommunityPost, PostType } from '../entities/community-post.entity';

export const COMMUNITY_POST_REPOSITORY = Symbol('COMMUNITY_POST_REPOSITORY');

export interface FindPostsFilter {
  country?: string;
  city?: string;
  type?: PostType;
  /** Matches posts whose travelDate falls on this calendar day. */
  travelDate?: Date;
}

export interface CommunityPostRepository {
  save(post: CommunityPost): Promise<CommunityPost>;
  findById(id: string): Promise<CommunityPost | null>;
  findMany(filter: FindPostsFilter): Promise<CommunityPost[]>;
  delete(id: string): Promise<void>;
}
