import { Booking, BookingStatus } from '../entities/booking.entity';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface FindBookingsForUser {
  /** Caller — matched against the booking's traveler or the tour's host. */
  userId: string;
  status?: BookingStatus;
}

export interface BookingRepository {
  save(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findForUser(query: FindBookingsForUser): Promise<Booking[]>;
}
