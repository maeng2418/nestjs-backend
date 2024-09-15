import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,

    @InjectRepository(UserEntity) // 유저 저장소 주입
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(_signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리 중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    throw new Error('Method not implemented.');
  }

  async login(_email: string, _password: string): Promise<string> {
    // TODO
    // 1. email, password 가진 유저가 있는지 DB에서 조회하고 없다면 에러 처리
    // 2. JWT 발급

    throw new Error('Method not implemented.');
  }

  async getUserInfo(_userId: string) {
    // TODO
    // 1. userId로 유저 정보를 DB에서 조회하고 없다면 에러 처리
    // 2. 조회한 정보를 UserInfo 타입으로 반환

    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<string> {
    // TODO: DB 연동 이후 구현
    throw new Error('Method not implemented.');
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return !!user;
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity(); // 새로운 유저 엔티티 객체 생성
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    return this.userRepository.save(user); // 저장소를 이용해서 엔티티를 데이터베이스에 저장
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
