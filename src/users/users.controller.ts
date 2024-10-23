import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import VerifyEmailDto from './dto/verify-email.dto';
import UserLoginDto from './dto/user-loign.dto';
import ValidationPipe from './pipe/validation.pipe';
import AuthGuard from 'src/guard/auth.guard';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import User from './dacorator/user.dacorator';

interface User {
  userId: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto) {
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return await this.usersService.getUserInfo(userId);
  }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  // 커스텀 데커레이터 User
  getHello(@User() user: User): string {
    // AuthGuard에서 request 객체에 user 정보를 넣었기 때문에 이렇게 사용 가능
    console.log(user);
    return this.usersService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/username')
  // 커스텀 데커레이터 User
  getHello2(@User('userId') userId: string): string {
    // AuthGuard에서 request 객체에 user 정보를 넣었기 때문에 이렇게 사용 가능
    console.log(userId);
    return this.usersService.getHello();
  }
}
