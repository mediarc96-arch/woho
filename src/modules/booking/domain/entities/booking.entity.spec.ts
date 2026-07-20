import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { InvalidBookingTransitionException } from '../exceptions/booking.exceptions';
import { Booking, BookingStatus } from './booking.entity';

const futureDate = () => new Date(Date.now() + 86_400_000);

function newBooking(overrides: Partial<Parameters<typeof Booking.create>[1]> = {}): Booking {
  return Booking.create('b1', {
    tourId: 't1',
    travelerId: 'u1',
    scheduledAt: futureDate(),
    headcount: 2,
    totalPrice: Money.create(5000),
    ...overrides,
  });
}

describe('Booking.create', () => {
  it('starts in PENDING', () => {
    expect(newBooking().status).toBe(BookingStatus.PENDING);
  });

  it('rejects headcount below 1', () => {
    expect(() => newBooking({ headcount: 0 })).toThrow(InvalidArgumentException);
  });

  it('rejects a past scheduled time', () => {
    expect(() => newBooking({ scheduledAt: new Date(Date.now() - 1000) })).toThrow(
      InvalidArgumentException,
    );
  });
});

describe('Booking state machine', () => {
  it('PENDING -> CONFIRMED -> COMPLETED', () => {
    const booking = newBooking();
    booking.confirm();
    expect(booking.status).toBe(BookingStatus.CONFIRMED);
    booking.complete();
    expect(booking.status).toBe(BookingStatus.COMPLETED);
  });

  it('allows cancelling from PENDING and from CONFIRMED', () => {
    const pending = newBooking();
    pending.cancel();
    expect(pending.status).toBe(BookingStatus.CANCELLED);

    const confirmed = newBooking();
    confirmed.confirm();
    confirmed.cancel();
    expect(confirmed.status).toBe(BookingStatus.CANCELLED);
  });

  it('cannot confirm a non-PENDING booking', () => {
    const booking = newBooking();
    booking.confirm();
    expect(() => booking.confirm()).toThrow(InvalidBookingTransitionException);
  });

  it('cannot complete a booking that was not confirmed', () => {
    const booking = newBooking();
    expect(() => booking.complete()).toThrow(InvalidBookingTransitionException);
  });

  it('cannot act on a cancelled booking', () => {
    const booking = newBooking();
    booking.cancel();
    expect(() => booking.confirm()).toThrow(InvalidBookingTransitionException);
    expect(() => booking.complete()).toThrow(InvalidBookingTransitionException);
  });
});
