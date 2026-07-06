import { User } from '../../../user/domain/entities/user.entity';

export interface AuthResult {
  accessToken: string;
  user: User;
}
