import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../../user/domain/entities/user.entity';
import { EmailAlreadyInUseException } from '../../../user/domain/exceptions/email-already-in-use.exception';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import { PASSWORD_HASHER, PasswordHasher } from '../../domain/services/password-hasher';
import { TOKEN_SERVICE, TokenService } from '../../domain/services/token-service';
import { AuthResult } from '../dto/auth-result';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterUseCase implements UseCase<RegisterDto, AuthResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterDto): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new EmailAlreadyInUseException(input.email);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.save(
      User.create(randomUUID(), {
        email: input.email,
        name: input.name,
        passwordHash,
        role: input.role,
      }),
    );

    const accessToken = await this.tokenService.sign({ sub: user.id, role: user.role });
    return { accessToken, user };
  }
}
