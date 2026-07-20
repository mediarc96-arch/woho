import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { Tour, TourCategory, TourStatus } from '../../../tour/domain/entities/tour.entity';
import { TourRepository } from '../../../tour/domain/repositories/tour.repository';
import { User, UserRole } from '../../../user/domain/entities/user.entity';
import { UserRepository } from '../../../user/domain/repositories/user.repository';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import {
  HostCannotBookOwnTourException,
  TourNotBookableException,
} from '../../domain/exceptions/booking.exceptions';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { CreateBookingUseCase } from './create-booking.use-case';

class FakeUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();
  add(user: User): void {
    this.users.set(user.id, user);
  }
  save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return Promise.resolve(user);
  }
  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) ?? null);
  }
  findByEmail(): Promise<User | null> {
    return Promise.resolve(null);
  }
  findAll(): Promise<User[]> {
    return Promise.resolve([...this.users.values()]);
  }
}

class FakeTourRepository implements TourRepository {
  private readonly tours = new Map<string, Tour>();
  add(tour: Tour): void {
    this.tours.set(tour.id, tour);
  }
  save(tour: Tour): Promise<Tour> {
    this.tours.set(tour.id, tour);
    return Promise.resolve(tour);
  }
  findById(id: string): Promise<Tour | null> {
    return Promise.resolve(this.tours.get(id) ?? null);
  }
  findMany(): Promise<Tour[]> {
    return Promise.resolve([...this.tours.values()]);
  }
}

class FakeBookingRepository implements BookingRepository {
  public readonly saved: Booking[] = [];
  save(booking: Booking): Promise<Booking> {
    this.saved.push(booking);
    return Promise.resolve(booking);
  }
  findById(): Promise<Booking | null> {
    return Promise.resolve(null);
  }
  findForUser(): Promise<Booking[]> {
    return Promise.resolve([]);
  }
}

function makeUser(id: string, role: UserRole): User {
  return User.create(id, { email: `${id}@x.dev`, name: id, passwordHash: 'hash', role });
}

function makeTour(id: string, hostId: string, status: TourStatus, price = 2500): Tour {
  const tour = Tour.create(id, {
    hostId,
    title: 'Tour',
    description: 'd',
    category: TourCategory.FOOD,
    city: 'Berlin',
    price: Money.create(price),
    durationMinutes: 120,
    meetingPoint: 'Gate',
  });
  if (status === TourStatus.PUBLISHED) tour.publish();
  if (status === TourStatus.ARCHIVED) tour.archive();
  return tour;
}

describe('CreateBookingUseCase', () => {
  let users: FakeUserRepository;
  let tours: FakeTourRepository;
  let bookings: FakeBookingRepository;
  let useCase: CreateBookingUseCase;

  beforeEach(() => {
    users = new FakeUserRepository();
    tours = new FakeTourRepository();
    bookings = new FakeBookingRepository();
    useCase = new CreateBookingUseCase(bookings, tours, users);
  });

  const cmd = (over = {}) => ({
    tourId: 't1',
    travelerId: 'trav',
    scheduledAt: new Date(Date.now() + 86_400_000),
    headcount: 2,
    ...over,
  });

  it('throws when the traveler does not exist', async () => {
    tours.add(makeTour('t1', 'host', TourStatus.PUBLISHED));
    await expect(useCase.execute(cmd())).rejects.toThrow(EntityNotFoundException);
  });

  it('throws when the tour does not exist', async () => {
    users.add(makeUser('trav', UserRole.TRAVELER));
    await expect(useCase.execute(cmd())).rejects.toThrow(EntityNotFoundException);
  });

  it('rejects booking a tour that is not published', async () => {
    users.add(makeUser('trav', UserRole.TRAVELER));
    tours.add(makeTour('t1', 'host', TourStatus.DRAFT));
    await expect(useCase.execute(cmd())).rejects.toThrow(TourNotBookableException);
  });

  it('rejects a host booking their own tour', async () => {
    users.add(makeUser('host', UserRole.HOST));
    tours.add(makeTour('t1', 'host', TourStatus.PUBLISHED));
    await expect(useCase.execute(cmd({ travelerId: 'host' }))).rejects.toThrow(
      HostCannotBookOwnTourException,
    );
  });

  it('creates a PENDING booking with a price snapshot of price * headcount', async () => {
    users.add(makeUser('trav', UserRole.TRAVELER));
    tours.add(makeTour('t1', 'host', TourStatus.PUBLISHED, 2500));

    const booking = await useCase.execute(cmd({ headcount: 3 }));

    expect(booking.status).toBe(BookingStatus.PENDING);
    expect(booking.totalPrice.amount).toBe(7500);
    expect(bookings.saved).toHaveLength(1);
  });
});
