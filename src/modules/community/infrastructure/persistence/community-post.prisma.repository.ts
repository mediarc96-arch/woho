import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { CommunityPost } from '../../domain/entities/community-post.entity';
import {
  CommunityPostRepository,
  FindPostsFilter,
} from '../../domain/repositories/community-post.repository';
import { CommunityPostMapper } from './community-post.mapper';

@Injectable()
export class CommunityPostPrismaRepository implements CommunityPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(post: CommunityPost): Promise<CommunityPost> {
    const data = CommunityPostMapper.toPersistence(post);
    const record = await this.prisma.communityPost.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
    return CommunityPostMapper.toDomain(record);
  }

  async findById(id: string): Promise<CommunityPost | null> {
    const record = await this.prisma.communityPost.findUnique({ where: { id } });
    return record ? CommunityPostMapper.toDomain(record) : null;
  }

  async findMany(filter: FindPostsFilter): Promise<CommunityPost[]> {
    const where: Prisma.CommunityPostWhereInput = {
      country: filter.country,
      city: filter.city,
      type: filter.type,
    };

    if (filter.travelDate) {
      const start = new Date(filter.travelDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.travelDate = { gte: start, lt: end };
    }

    const records = await this.prisma.communityPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => CommunityPostMapper.toDomain(record));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.communityPost.delete({ where: { id } });
  }
}
