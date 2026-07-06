import { ForbiddenActionException } from '../../../../shared/domain/exceptions/domain.exception';
import { Tour } from '../../../tour/domain/entities/tour.entity';
import { Booking } from '../../domain/entities/booking.entity';

/** Only the host who owns the tour may act (confirm / complete). */
export function assertTourHost(tour: Tour, actorId: string): void {
  if (tour.hostId !== actorId) {
    throw new ForbiddenActionException('Only the tour host can perform this action');
  }
}

/** Either the traveler who booked or the tour's host may act (cancel / view). */
export function assertBookingParticipant(booking: Booking, tour: Tour, actorId: string): void {
  if (booking.travelerId !== actorId && tour.hostId !== actorId) {
    throw new ForbiddenActionException('You are not a participant of this booking');
  }
}
