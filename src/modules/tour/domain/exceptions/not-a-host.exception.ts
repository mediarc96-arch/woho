import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

export class NotAHostException extends DomainException {
  constructor(userId: string) {
    super(`User "${userId}" is not a host and cannot create tours`);
  }
}
