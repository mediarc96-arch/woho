import {
  EntityNotFoundException,
  ForbiddenActionException,
} from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { Tour, TourCategory, TourStatus } from '../../domain/entities/tour.entity';
import { TourRepository } from '../../domain/repositories/tour.repository';
import { PublishTourUseCase } from './publish-tour.use-case';

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

function draftTour(hostId: string): Tour {
  return Tour.create('t1', {
    hostId,
    title: 'Tour',
    description: 'd',
    category: TourCategory.FOOD,
    city: 'Berlin',
    price: Money.create(2500),
    durationMinutes: 120,
    meetingPoint: 'Gate',
  });
}

describe('PublishTourUseCase', () => {
  let tours: FakeTourRepository;
  let useCase: PublishTourUseCase;

  beforeEach(() => {
    tours = new FakeTourRepository();
    useCase = new PublishTourUseCase(tours);
  });

  it('throws when the tour does not exist', async () => {
    await expect(useCase.execute({ tourId: 'missing', actorId: 'host' })).rejects.toThrow(
      EntityNotFoundException,
    );
  });

  it('rejects a non-owner', async () => {
    tours.add(draftTour('host'));
    await expect(useCase.execute({ tourId: 't1', actorId: 'intruder' })).rejects.toThrow(
      ForbiddenActionException,
    );
  });

  it('publishes the tour for its owner', async () => {
    tours.add(draftTour('host'));
    const tour = await useCase.execute({ tourId: 't1', actorId: 'host' });
    expect(tour.status).toBe(TourStatus.PUBLISHED);
  });
});
