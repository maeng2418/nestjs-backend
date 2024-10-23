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

    // JWT를 검증해서 얻은 정보를 넣는다.
    // 라우터 핸들러에 전달될 요청 객체에 유저 정보를 추가로 실어서 이후에 이용
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.user = {
      name: 'YOUR_NAME',
      email: 'YOUR_EMAIL@gmail.com',
    };

    return true;
  }
}

export default AuthGuard;
