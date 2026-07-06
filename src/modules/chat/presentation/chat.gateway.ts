import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { TOKEN_SERVICE, TokenService } from '../../auth/domain/services/token-service';
import { MessageResponseDto } from '../application/dto/message.response.dto';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';

interface JoinConversationPayload {
  conversationId: string;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

interface AuthenticatedSocket extends Socket {
  data: { userId: string; role: string };
}

function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      this.disconnectUnauthorized(client, 'Missing auth token');
      return;
    }

    try {
      const payload = await this.tokenService.verify(token);
      (client as AuthenticatedSocket).data = { userId: payload.sub, role: payload.role };
      this.logger.log(`Client connected: ${client.id} (user ${payload.sub})`);
    } catch {
      this.disconnectUnauthorized(client, 'Invalid or expired token');
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('conversation:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinConversationPayload,
  ): Promise<void> {
    if (!payload?.conversationId) {
      client.emit('chat:error', { message: 'conversationId is required' });
      return;
    }

    try {
      // Ensures the conversation exists and the caller is a participant before joining.
      const messages = await this.getMessagesUseCase.execute({
        conversationId: payload.conversationId,
        actorId: (client as AuthenticatedSocket).data.userId,
      });
      await client.join(conversationRoom(payload.conversationId));
      client.emit('conversation:joined', {
        conversationId: payload.conversationId,
        messages: messages.map((m) => MessageResponseDto.fromEntity(m)),
      });
    } catch (error) {
      this.emitError(client, error);
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ): Promise<void> {
    if (!payload?.conversationId || !payload?.content) {
      client.emit('chat:error', { message: 'conversationId and content are required' });
      return;
    }

    try {
      const senderId = (client as AuthenticatedSocket).data.userId;
      const message = await this.sendMessageUseCase.execute({
        conversationId: payload.conversationId,
        senderId,
        content: payload.content,
      });
      const dto = MessageResponseDto.fromEntity(message);
      // Broadcast to everyone in the room, including the sender (acts as ack).
      this.server.to(conversationRoom(message.conversationId)).emit('message:new', dto);
    } catch (error) {
      this.emitError(client, error);
    }
  }

  private extractToken(client: Socket): string | null {
    const fromAuth = client.handshake.auth?.token as string | undefined;
    if (fromAuth) {
      return fromAuth.startsWith('Bearer ') ? fromAuth.slice(7) : fromAuth;
    }
    const header = client.handshake.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      return header.slice(7);
    }
    return null;
  }

  private disconnectUnauthorized(client: Socket, message: string): void {
    client.emit('chat:error', { message });
    client.disconnect(true);
  }

  private emitError(client: Socket, error: unknown): void {
    const message = error instanceof DomainException ? error.message : 'Unexpected error';
    if (!(error instanceof DomainException)) {
      this.logger.error(error);
    }
    client.emit('chat:error', { message });
  }
}
