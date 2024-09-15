import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])], // 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
