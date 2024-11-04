import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'data-source';
import LoggerMiddleware from './middleware/logger.middleware';
import Logger2Middleware from './middleware/logger2.middleware';
import { UsersController } from './users/users.controller';
import { APP_GUARD } from '@nestjs/core';
import AuthGuard from './guard/auth.guard';
import authConfig from './config/authConfig';
import { ClassRolesGuard, HandlerRolesGuard } from './guard/role.guard';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 가드에 종속성 주입을 사용해서 다른 프로바이더를 주입해서 사용하고 싶다면 커스텀 프로바이더를 사용해야 합니다.
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: HandlerRolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClassRolesGuard,
    },
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
