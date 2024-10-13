import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/authConfig';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpirationIn,
      audience: this.config.jwtAudience,
      issuer: this.config.jwtIssuer,
    });
  }

  verify(jwtString: string) {
    try {
      // 외부에 노출되지 않는 secret key를 사용하여 jwt를 검증하므로 이 토큰이 유효한 것인지 확인할 수 있다.
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;

      return { userId: id, email };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
