import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';
import { TourModule } from '../tour/tour.module';
import { UserModule } from '../user/user.module';
import { GetHostProfileUseCase } from './application/use-cases/get-host-profile.use-case';
import { HostController } from './presentation/host.controller';

@Module({
  imports: [UserModule, TourModule, ReviewModule],
  controllers: [HostController],
  providers: [GetHostProfileUseCase],
})
export class HostModule {}
