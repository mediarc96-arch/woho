import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  EntityNotFoundException,
  ForbiddenActionException,
  InvalidArgumentException,
  UnauthenticatedException,
} from '../../domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = this.resolveStatusCode(exception);
    response.status(statusCode).json({
      statusCode,
      message: exception.message,
    });
  }

  private resolveStatusCode(exception: DomainException): number {
    if (exception instanceof EntityNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof InvalidArgumentException) {
      return HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof UnauthenticatedException) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof ForbiddenActionException) {
      return HttpStatus.FORBIDDEN;
    }
    return HttpStatus.CONFLICT;
  }
}
