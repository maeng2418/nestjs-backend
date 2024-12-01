import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './command/create-user.handler';
import UserEntity from './entities/user.entity';
import { UserEventsHandler } from './event/user-events.handler';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ], // 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [UsersService, Logger, CreateUserHandler, UserEventsHandler],
})
export class UsersModule {}
