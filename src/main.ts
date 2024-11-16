import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './middleware/logger3.middleware';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
  });

  // 커스텀 로거 전역으로 사용하기
  // app.useLogger(app.get(LoggerService));

  // nest-winston을 사용하여 전역으로 사용하기
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

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
