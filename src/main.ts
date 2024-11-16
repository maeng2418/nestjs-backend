import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './middleware/logger3.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  // 커스텀 로거 전역으로 사용하기
  // app.useLogger(app.get(LoggerService));

  // nest-winston을 사용하여 전역으로 사용하기
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // 함수 미들웨어 추가
  app.use(logger3);

  // 글로벌 가드 추가
  // app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
