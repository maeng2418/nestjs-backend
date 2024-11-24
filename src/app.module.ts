import { HttpModule } from '@nestjs/axios';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from './batch/batch.module';
import authConfig from './config/authConfig';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { RolesGuard } from './guard/role.guard';
import { DogHealthIndicator } from './health-check/dog-health-indicator';
import { HealthCheckController } from './health-check/health-check.controller';
import { LoggerModule } from './logging/logger.module';
import { LoggingModule } from './logging/logging.module';
import LoggerMiddleware from './middleware/logger.middleware';
import Logger2Middleware from './middleware/logger2.middleware';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({ ...dataSourceOptions }),
    LoggerModule,
    LoggingModule,
    BatchModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [
    AppService,
    // 가드에 종속성 주입을 사용해서 다른 프로바이더를 주입해서 사용하고 싶다면 커스텀 프로바이더를 사용해야 합니다.
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: HandlerRolesGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ClassRolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // HttpExceptionFilter와 주입받을 Logger를 프로바이더로 선언
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    DogHealthIndicator,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      // .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
