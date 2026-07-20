import { ForbiddenActionException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { Tour, TourCategory } from '../../../tour/domain/entities/tour.entity';
import { Booking } from '../../domain/entities/booking.entity';
import { assertBookingParticipant, assertTourHost } from './booking-access.policy';

const tour = Tour.create('t1', {
  hostId: 'host',
  title: 'Tour',
  description: 'd',
  category: TourCategory.FOOD,
  city: 'Berlin',
  price: Money.create(2500),
  durationMinutes: 120,
  meetingPoint: 'Gate',
});

const booking = Booking.create('b1', {
  tourId: 't1',
  travelerId: 'trav',
  scheduledAt: new Date(Date.now() + 86_400_000),
  headcount: 1,
  totalPrice: Money.create(2500),
});

describe('assertTourHost', () => {
  it('passes for the tour host', () => {
    expect(() => assertTourHost(tour, 'host')).not.toThrow();
  });

  it('throws for anyone else (including the traveler)', () => {
    expect(() => assertTourHost(tour, 'trav')).toThrow(ForbiddenActionException);
  });
});

describe('assertBookingParticipant', () => {
  it('passes for the traveler', () => {
    expect(() => assertBookingParticipant(booking, tour, 'trav')).not.toThrow();
  });

  it('passes for the host', () => {
    expect(() => assertBookingParticipant(booking, tour, 'host')).not.toThrow();
  });

  it('throws for an unrelated user', () => {
    expect(() => assertBookingParticipant(booking, tour, 'stranger')).toThrow(
      ForbiddenActionException,
    );
  });
});
