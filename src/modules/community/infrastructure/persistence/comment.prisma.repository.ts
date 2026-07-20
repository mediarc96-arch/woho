import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { CommentMapper } from './comment.mapper';

@Injectable()
export class CommentPrismaRepository implements CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(comment: Comment): Promise<Comment> {
    const data = CommentMapper.toPersistence(comment);
    const record = await this.prisma.communityComment.create({ data });
    return CommentMapper.toDomain(record);
  }

  async findById(id: string): Promise<Comment | null> {
    const record = await this.prisma.communityComment.findUnique({ where: { id } });
    return record ? CommentMapper.toDomain(record) : null;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    const records = await this.prisma.communityComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((record) => CommentMapper.toDomain(record));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.communityComment.delete({ where: { id } });
  }
}
