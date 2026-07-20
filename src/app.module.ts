import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommunityModule } from './modules/community/community.module';
import { HostModule } from './modules/host/host.module';
import { ReviewModule } from './modules/review/review.module';
import { TourModule } from './modules/tour/tour.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    TourModule,
    BookingModule,
    ChatModule,
    ReviewModule,
    HostModule,
    CommunityModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
