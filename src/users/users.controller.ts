import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import VerifyEmailDto from './dto/verify-email.dto';
import UserLoginDto from './dto/user-loign.dto';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const { name, email, password } = dto;
    return this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    return await this.usersService.getUserInfo(userId);
  }
}
