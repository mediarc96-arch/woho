import { AuthResult } from './auth-result';

class AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: string;

  constructor(id: string, email: string, name: string, role: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }
}

export class AuthResponseDto {
  accessToken: string;
  user: AuthUserDto;

  private constructor(result: AuthResult) {
    this.accessToken = result.accessToken;
    this.user = new AuthUserDto(
      result.user.id,
      result.user.email,
      result.user.name,
      result.user.role,
    );
  }

  static fromResult(result: AuthResult): AuthResponseDto {
    return new AuthResponseDto(result);
  }
}
