import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User, UserRole } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return User.reconstitute(record.id, {
      email: record.email,
      name: record.name,
      passwordHash: record.passwordHash,
      role: record.role as unknown as UserRole,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(user: User): {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: PrismaUserRole;
  } {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role,
    };
  }
}
