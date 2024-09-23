import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    return true;
  }
}

export default AuthGuard;
