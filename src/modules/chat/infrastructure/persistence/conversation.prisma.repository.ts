import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationMapper } from './conversation.mapper';

@Injectable()
export class ConversationPrismaRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(conversation: Conversation): Promise<Conversation> {
    const data = ConversationMapper.toPersistence(conversation);
    const record = await this.prisma.conversation.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
    return ConversationMapper.toDomain(record);
  }

  async findById(id: string): Promise<Conversation | null> {
    const record = await this.prisma.conversation.findUnique({ where: { id } });
    return record ? ConversationMapper.toDomain(record) : null;
  }

  async findByTourAndTraveler(tourId: string, travelerId: string): Promise<Conversation | null> {
    const record = await this.prisma.conversation.findUnique({
      where: { tourId_travelerId: { tourId, travelerId } },
    });
    return record ? ConversationMapper.toDomain(record) : null;
  }

  async findByParticipant(userId: string): Promise<Conversation[]> {
    const records = await this.prisma.conversation.findMany({
      where: {
        OR: [{ hostId: userId }, { travelerId: userId }],
      },
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
    });
    return records.map((record) => ConversationMapper.toDomain(record));
  }
}
