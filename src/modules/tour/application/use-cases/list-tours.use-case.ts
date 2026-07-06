import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Tour } from '../../domain/entities/tour.entity';
import {
  FindToursFilter,
  TOUR_REPOSITORY,
  TourRepository,
} from '../../domain/repositories/tour.repository';

@Injectable()
export class ListToursUseCase implements UseCase<FindToursFilter, Tour[]> {
  constructor(
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
  ) {}

  async execute(filter: FindToursFilter = {}): Promise<Tour[]> {
    return this.tourRepository.findMany(filter);
  }
}
