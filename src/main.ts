import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './middleware/logger3.middleware';
import AuthGuard from './guard/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(logger3); // 함수 미들웨어 추가
  // app.useGlobalGuards(new AuthGuard()); // 글로벌 가드 추가
  await app.listen(3000);
}
bootstrap();
