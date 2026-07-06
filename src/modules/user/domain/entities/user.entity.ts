import { Entity } from '../../../../shared/domain/entity.base';

export enum UserRole {
  TRAVELER = 'TRAVELER',
  HOST = 'HOST',
}

export interface UserProps {
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  email: string;
  name: string;
  passwordHash: string;
  role?: UserRole;
}

export class User extends Entity<UserProps> {
  private constructor(id: string, props: UserProps) {
    super(id, props);
  }

  static create(id: string, props: CreateUserProps): User {
    const now = new Date();
    return new User(id, {
      email: props.email,
      name: props.name,
      passwordHash: props.passwordHash,
      role: props.role ?? UserRole.TRAVELER,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: UserProps): User {
    return new User(id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
