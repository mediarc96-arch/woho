import { ForbiddenActionException } from '../../../../shared/domain/exceptions/domain.exception';

export class NotConversationParticipantException extends ForbiddenActionException {
  constructor(userId: string) {
    super(`User "${userId}" is not a participant of this conversation`);
  }
}
