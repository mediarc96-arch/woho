import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Principal } from '../principal';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal => {
    const request = context.switchToHttp().getRequest<Request & { user?: Principal }>();
    return request.user as Principal;
  },
);
