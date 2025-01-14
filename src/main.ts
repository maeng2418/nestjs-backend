import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger3 } from './middleware/logger3.middleware';

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

  // 애플리케이션 전체에 예외필터 적용
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new TransformInterceptor(), // 응답매핑 인터셉터
  );

  await app.listen(3000);
}
bootstrap();
