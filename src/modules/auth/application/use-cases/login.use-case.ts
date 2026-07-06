import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { USER_REPOSITORY, UserRepository } from '../../../user/domain/repositories/user.repository';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { PASSWORD_HASHER, PasswordHasher } from '../../domain/services/password-hasher';
import { TOKEN_SERVICE, TokenService } from '../../domain/services/token-service';
import { AuthResult } from '../dto/auth-result';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase implements UseCase<LoginDto, AuthResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.tokenService.sign({ sub: user.id, role: user.role });
    return { accessToken, user };
  }
}
