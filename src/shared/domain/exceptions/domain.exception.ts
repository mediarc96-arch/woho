export abstract class DomainException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id "${id}" was not found`);
  }
}

export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenActionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthenticatedException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
