import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { InvalidBookingTransitionException } from '../exceptions/booking.exceptions';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface BookingProps {
  tourId: string;
  travelerId: string;
  scheduledAt: Date;
  headcount: number;
  totalPrice: Money;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingProps {
  tourId: string;
  travelerId: string;
  scheduledAt: Date;
  headcount: number;
  totalPrice: Money;
}

export class Booking extends Entity<BookingProps> {
  private constructor(id: string, props: BookingProps) {
    super(id, props);
  }

  static create(id: string, props: CreateBookingProps): Booking {
    if (props.headcount < 1) {
      throw new InvalidArgumentException('Booking headcount must be at least 1');
    }
    if (props.scheduledAt.getTime() <= Date.now()) {
      throw new InvalidArgumentException('Booking must be scheduled in the future');
    }

    const now = new Date();
    return new Booking(id, {
      tourId: props.tourId,
      travelerId: props.travelerId,
      scheduledAt: props.scheduledAt,
      headcount: props.headcount,
      totalPrice: props.totalPrice,
      status: BookingStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: BookingProps): Booking {
    return new Booking(id, props);
  }

  confirm(): void {
    this.transitionTo(BookingStatus.CONFIRMED, [BookingStatus.PENDING]);
  }

  cancel(): void {
    this.transitionTo(BookingStatus.CANCELLED, [BookingStatus.PENDING, BookingStatus.CONFIRMED]);
  }

  complete(): void {
    this.transitionTo(BookingStatus.COMPLETED, [BookingStatus.CONFIRMED]);
  }

  private transitionTo(next: BookingStatus, allowedFrom: BookingStatus[]): void {
    if (!allowedFrom.includes(this.props.status)) {
      throw new InvalidBookingTransitionException(this.props.status, next);
    }
    this.props.status = next;
    this.props.updatedAt = new Date();
  }

  get tourId(): string {
    return this.props.tourId;
  }

  get travelerId(): string {
    return this.props.travelerId;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get headcount(): number {
    return this.props.headcount;
  }

  get totalPrice(): Money {
    return this.props.totalPrice;
  }

  get status(): BookingStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
