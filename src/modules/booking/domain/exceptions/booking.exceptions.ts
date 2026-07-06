import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';
import { BookingStatus } from '../entities/booking.entity';

export class InvalidBookingTransitionException extends DomainException {
  constructor(from: BookingStatus, to: BookingStatus) {
    super(`Cannot change booking status from ${from} to ${to}`);
  }
}

export class TourNotBookableException extends DomainException {
  constructor(tourId: string) {
    super(`Tour "${tourId}" is not published and cannot be booked`);
  }
}

export class HostCannotBookOwnTourException extends DomainException {
  constructor() {
    super('A host cannot book their own tour');
  }
}
