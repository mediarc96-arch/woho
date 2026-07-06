import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CreateTourUseCase } from './application/use-cases/create-tour.use-case';
import { GetTourUseCase } from './application/use-cases/get-tour.use-case';
import { ListToursUseCase } from './application/use-cases/list-tours.use-case';
import { PublishTourUseCase } from './application/use-cases/publish-tour.use-case';
import { TOUR_REPOSITORY } from './domain/repositories/tour.repository';
import { TourPrismaRepository } from './infrastructure/persistence/tour.prisma.repository';
import { TourController } from './presentation/tour.controller';

@Module({
  imports: [UserModule],
  controllers: [TourController],
  providers: [
    CreateTourUseCase,
    GetTourUseCase,
    ListToursUseCase,
    PublishTourUseCase,
    {
      provide: TOUR_REPOSITORY,
      useClass: TourPrismaRepository,
    },
  ],
  exports: [TOUR_REPOSITORY],
})
export class TourModule {}
