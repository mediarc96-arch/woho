import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';

export const MAX_MESSAGE_LENGTH = 2000;

export interface MessageProps {
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface CreateMessageProps {
  conversationId: string;
  senderId: string;
  content: string;
}

export class Message extends Entity<MessageProps> {
  private constructor(id: string, props: MessageProps) {
    super(id, props);
  }

  static create(id: string, props: CreateMessageProps): Message {
    const content = props.content.trim();
    if (content.length === 0) {
      throw new InvalidArgumentException('Message content cannot be empty');
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new InvalidArgumentException(
        `Message content cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      );
    }

    return new Message(id, {
      conversationId: props.conversationId,
      senderId: props.senderId,
      content,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: MessageProps): Message {
    return new Message(id, props);
  }

  get conversationId(): string {
    return this.props.conversationId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
