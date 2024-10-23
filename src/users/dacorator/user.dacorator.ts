import { createParamDecorator } from '@nestjs/common';

const User = createParamDecorator((_data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export default User;
