import { IsNotEmpty, IsString } from 'class-validator';

/**
 * REST body for POST /conversations/:id/messages — conversationId comes from the path
 * and senderId from the authenticated principal.
 */
export class SendMessageBodyDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
