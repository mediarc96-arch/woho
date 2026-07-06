import {
  DomainException,
  ForbiddenActionException,
} from '../../../../shared/domain/exceptions/domain.exception';

export class NotBookingOwnerException extends ForbiddenActionException {
  constructor(userId: string) {
    super(`User "${userId}" is not the owner of this booking and cannot review it`);
  }
}

export class BookingNotCompletedException extends DomainException {
  constructor(bookingId: string) {
    super(`Booking "${bookingId}" must be completed before it can be reviewed`);
  }
}

export class ReviewAlreadyExistsException extends DomainException {
  constructor(bookingId: string) {
    super(`Booking "${bookingId}" has already been reviewed`);
  }
}
