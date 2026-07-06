import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/exceptions/domain.exception';
import { UserRole } from '../../../user/domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import { Tour } from '../../domain/entities/tour.entity';
import { NotAHostException } from '../../domain/exceptions/not-a-host.exception';
import { TOUR_REPOSITORY, TourRepository } from '../../domain/repositories/tour.repository';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { CreateTourDto } from '../dto/create-tour.dto';

/** The authenticated host id is supplied by the controller from the JWT, not the request body. */
export type CreateTourCommand = CreateTourDto & { hostId: string };

@Injectable()
export class CreateTourUseCase implements UseCase<CreateTourCommand, Tour> {
  constructor(
    @Inject(TOUR_REPOSITORY)
    private readonly tourRepository: TourRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateTourCommand): Promise<Tour> {
    const host = await this.userRepository.findById(input.hostId);
    if (!host) {
      throw new EntityNotFoundException('User', input.hostId);
    }
    if (host.role !== UserRole.HOST) {
      throw new NotAHostException(input.hostId);
    }

    const tour = Tour.create(randomUUID(), {
      hostId: input.hostId,
      title: input.title,
      description: input.description,
      category: input.category,
      city: input.city,
      price: Money.create(input.priceAmount, input.priceCurrency),
      durationMinutes: input.durationMinutes,
      meetingPoint: input.meetingPoint,
      afterTourOptions: input.afterTourOptions,
    });

    return this.tourRepository.save(tour);
  }
}
