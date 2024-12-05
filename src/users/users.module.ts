import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './application/command/create-user.handler';
import { UserEventsHandler } from './application/event/user-events.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UserFactory } from './domain/user.factory';
import { EmailService } from './infra/adapter/EmailService';
import UserEntity from './infra/db/entity/user.entity';
import { UserRepository } from './infra/db/repository/UserRepository';
import { UsersController } from './interface/users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ], // 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [
    UsersService,
    Logger,
    CreateUserHandler,
    UserEventsHandler,
    GetUserInfoQueryHandler,
    UserFactory,
    { provide: 'UserRepository', useClass: UserRepository },
    { provide: 'EmailService', useClass: EmailService },
  ],
})
export class UsersModule {}
