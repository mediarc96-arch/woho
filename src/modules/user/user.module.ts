import { Module } from '@nestjs/common';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { UserPrismaRepository } from './infrastructure/persistence/user.prisma.repository';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    GetUserUseCase,
    ListUsersUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
