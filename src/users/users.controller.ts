import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Headers,
  ValidationPipe,
  Inject,
  InternalServerErrorException,
  LoggerService,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import VerifyEmailDto from './dto/verify-email.dto';
import UserLoginDto from './dto/user-loign.dto';
import AuthGuard from 'src/guard/auth.guard';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import UserData from '../decorator/user.decorator';
import { IsString } from 'class-validator';
import Roles from 'src/decorator/roles.decorator';
import { HttpExceptionFilter } from 'src/filter/httpException.filter';

class UserEntity {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

@Roles('user')
@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  // @UseFilters(HttpExceptionFilter)
  @Post()
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  // @UseGuards(HandlerRolesGuard)
  async createUser(@Body(ValidationPipe) dto: CreateUserDto) {
    this.printLoggerServiceLog(dto);
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
  getHello(@UserData() user: UserEntity): string {
    // AuthGuard에서 request 객체에 user 정보를 넣었기 때문에 이렇게 사용 가능
    console.log(user);
    return this.usersService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/username')
  // 커스텀 데커레이터 User
  getHello2(@UserData('name') name: string): string {
    // AuthGuard에서 request 객체에 user 정보를 넣었기 때문에 이렇게 사용 가능
    console.log(name);
    return this.usersService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/with-pipe')
  // 커스텀 데커레이터 User
  getHello3(
    @UserData(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ): string {
    // AuthGuard에서 request 객체에 user 정보를 넣었기 때문에 이렇게 사용 가능
    console.log(user);
    return this.usersService.getHello();
  }

  private printLoggerServiceLog(dto: CreateUserDto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
