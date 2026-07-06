import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { Tour } from '../../domain/entities/tour.entity';
import { TOUR_REPOSITORY, TourRepository } from '../../domain/repositories/tour.repository';

@Injectable()
export class GetTourUseCase implements UseCase<string, Tour> {
  constructor(
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
  ) {}

  async execute(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findById(id);
    if (!tour) {
      throw new EntityNotFoundException('Tour', id);
    }
    return tour;
  }
}
