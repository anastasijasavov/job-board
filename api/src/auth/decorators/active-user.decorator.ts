import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/schemas';

export const ActiveUser = createParamDecorator(
  (field: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
