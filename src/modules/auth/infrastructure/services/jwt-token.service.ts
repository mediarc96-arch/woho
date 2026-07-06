import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, TokenService } from '../../domain/services/token-service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync({ sub: payload.sub, role: payload.role });
  }

  async verify(token: string): Promise<TokenPayload> {
    const decoded = await this.jwtService.verifyAsync<TokenPayload>(token);
    return { sub: decoded.sub, role: decoded.role };
  }
}
