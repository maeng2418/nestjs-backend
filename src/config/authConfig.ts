import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationIn: process.env.JWT_EXPIRATION_IN,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
}));
