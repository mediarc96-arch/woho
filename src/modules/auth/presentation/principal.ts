import { UserRole } from '../../user/domain/entities/user.entity';

/** The authenticated caller, derived from a verified JWT and attached to the request. */
export interface Principal {
  userId: string;
  role: UserRole;
}
