import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);

    return true;
  }
}

export default AuthGuard;
