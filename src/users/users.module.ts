import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule], // 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
