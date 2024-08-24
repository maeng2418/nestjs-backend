import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

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

  private async checkUserExists(_email: string) {
    // TODO: DB 연동 이후 구현
    return false;
  }

  private saveUser(
    _name: string,
    _email: string,
    _password: string,
    _signupVerifyToken: string,
  ) {
    // TODO: DB 연동 이후 구현
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
