import { Entity } from '../../../../shared/domain/entity.base';

export interface ConversationProps {
  tourId: string;
  hostId: string;
  travelerId: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationProps {
  tourId: string;
  hostId: string;
  travelerId: string;
}

export class Conversation extends Entity<ConversationProps> {
  private constructor(id: string, props: ConversationProps) {
    super(id, props);
  }

  static create(id: string, props: CreateConversationProps): Conversation {
    const now = new Date();
    return new Conversation(id, {
      tourId: props.tourId,
      hostId: props.hostId,
      travelerId: props.travelerId,
      lastMessageAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: ConversationProps): Conversation {
    return new Conversation(id, props);
  }

  isParticipant(userId: string): boolean {
    return userId === this.props.hostId || userId === this.props.travelerId;
  }

  registerMessage(sentAt: Date): void {
    this.props.lastMessageAt = sentAt;
    this.props.updatedAt = new Date();
  }

  get tourId(): string {
    return this.props.tourId;
  }

  get hostId(): string {
    return this.props.hostId;
  }

  get travelerId(): string {
    return this.props.travelerId;
  }

  get lastMessageAt(): Date | null {
    return this.props.lastMessageAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
