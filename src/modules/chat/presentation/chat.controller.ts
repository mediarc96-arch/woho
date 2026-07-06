import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { Principal } from '../../auth/presentation/principal';
import { ConversationResponseDto } from '../application/dto/conversation.response.dto';
import { GetMessagesQueryDto } from '../application/dto/get-messages.query.dto';
import { MessageResponseDto } from '../application/dto/message.response.dto';
import { SendMessageBodyDto } from '../application/dto/send-message.body.dto';
import { StartConversationDto } from '../application/dto/start-conversation.dto';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { ListConversationsUseCase } from '../application/use-cases/list-conversations.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { StartConversationUseCase } from '../application/use-cases/start-conversation.use-case';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly startConversationUseCase: StartConversationUseCase,
    private readonly listConversationsUseCase: ListConversationsUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
  ) {}

  @Post('conversations')
  async start(
    @CurrentUser() user: Principal,
    @Body() dto: StartConversationDto,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.startConversationUseCase.execute({
      ...dto,
      travelerId: user.userId,
    });
    return ConversationResponseDto.fromEntity(conversation);
  }

  @Get('conversations')
  async list(@CurrentUser() user: Principal): Promise<ConversationResponseDto[]> {
    const conversations = await this.listConversationsUseCase.execute(user.userId);
    return conversations.map((c) => ConversationResponseDto.fromEntity(c));
  }

  @Get('conversations/:id/messages')
  async messages(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.execute({
      conversationId: id,
      actorId: user.userId,
      limit: query.limit,
      before: query.before,
    });
    return messages.map((m) => MessageResponseDto.fromEntity(m));
  }

  @Post('conversations/:id/messages')
  async send(
    @CurrentUser() user: Principal,
    @Param('id') id: string,
    @Body() dto: SendMessageBodyDto,
  ): Promise<MessageResponseDto> {
    const message = await this.sendMessageUseCase.execute({
      conversationId: id,
      senderId: user.userId,
      content: dto.content,
    });
    return MessageResponseDto.fromEntity(message);
  }
}
