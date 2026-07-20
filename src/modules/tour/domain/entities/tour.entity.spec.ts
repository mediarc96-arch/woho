import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { AfterTourOption, Tour, TourCategory, TourStatus } from './tour.entity';

function newTour(overrides: Partial<Parameters<typeof Tour.create>[1]> = {}): Tour {
  return Tour.create('t1', {
    hostId: 'h1',
    title: 'Street Food Walk',
    description: 'Local bites',
    category: TourCategory.FOOD,
    city: 'Berlin',
    price: Money.create(2500),
    durationMinutes: 120,
    meetingPoint: 'Kottbusser Tor',
    afterTourOptions: [AfterTourOption.MEAL],
    ...overrides,
  });
}

describe('Tour.create', () => {
  it('starts as DRAFT and trims the title', () => {
    const tour = newTour({ title: '  Walk  ' });
    expect(tour.status).toBe(TourStatus.DRAFT);
    expect(tour.title).toBe('Walk');
  });

  it('defaults afterTourOptions to an empty array', () => {
    expect(newTour({ afterTourOptions: undefined }).afterTourOptions).toEqual([]);
  });

  it('rejects an empty title', () => {
    expect(() => newTour({ title: '   ' })).toThrow(InvalidArgumentException);
  });

  it('rejects a non-positive duration', () => {
    expect(() => newTour({ durationMinutes: 0 })).toThrow(InvalidArgumentException);
  });
});

describe('Tour lifecycle', () => {
  it('publish moves DRAFT -> PUBLISHED', () => {
    const tour = newTour();
    tour.publish();
    expect(tour.status).toBe(TourStatus.PUBLISHED);
  });

  it('archive moves to ARCHIVED', () => {
    const tour = newTour();
    tour.archive();
    expect(tour.status).toBe(TourStatus.ARCHIVED);
  });
});
