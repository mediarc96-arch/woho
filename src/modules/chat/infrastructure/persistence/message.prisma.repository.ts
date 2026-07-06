import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Message } from '../../domain/entities/message.entity';
import {
  FindMessagesOptions,
  MessageRepository,
} from '../../domain/repositories/message.repository';
import { MessageMapper } from './message.mapper';

@Injectable()
export class MessagePrismaRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(message: Message): Promise<Message> {
    const data = MessageMapper.toPersistence(message);
    const record = await this.prisma.message.create({ data });
    return MessageMapper.toDomain(record);
  }

  async findByConversation(
    conversationId: string,
    options: FindMessagesOptions,
  ): Promise<Message[]> {
    const records = await this.prisma.message.findMany({
      where: {
        conversationId,
        createdAt: options.before ? { lt: options.before } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
    });
    // Newest-first from the DB; return chronological (oldest-first) for display.
    return records.reverse().map((record) => MessageMapper.toDomain(record));
  }
}
