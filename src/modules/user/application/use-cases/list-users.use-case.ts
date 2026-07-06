import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class ListUsersUseCase implements UseCase<void, User[]> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
