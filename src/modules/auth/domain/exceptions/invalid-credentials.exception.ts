import { UnauthenticatedException } from '../../../../shared/domain/exceptions/domain.exception';

export class InvalidCredentialsException extends UnauthenticatedException {
  constructor() {
    super('Invalid email or password');
  }
}
