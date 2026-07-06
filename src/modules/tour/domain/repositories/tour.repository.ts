import { Tour } from '../entities/tour.entity';

export const TOUR_REPOSITORY = Symbol('TOUR_REPOSITORY');

export interface FindToursFilter {
  city?: string;
  hostId?: string;
}

export interface TourRepository {
  save(tour: Tour): Promise<Tour>;
  findById(id: string): Promise<Tour | null>;
  findMany(filter: FindToursFilter): Promise<Tour[]>;
}
