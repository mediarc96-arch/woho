import { Controller, Get, Param } from '@nestjs/common';
import { UserResponseDto } from '../application/dto/user.response.dto';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    return UserResponseDto.fromEntity(user);
  }
}
