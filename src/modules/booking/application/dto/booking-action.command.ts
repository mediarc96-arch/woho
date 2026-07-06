/** A booking lifecycle action requested by an authenticated actor. */
export interface BookingActionCommand {
  bookingId: string;
  actorId: string;
}
