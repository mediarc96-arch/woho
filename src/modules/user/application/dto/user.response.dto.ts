import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;

  private constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}
