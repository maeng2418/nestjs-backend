import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import UserEntity from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,

    @InjectRepository(UserEntity) // 유저 저장소 주입
    private userRepository: Repository<UserEntity>,

    private dataSource: DataSource,

    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    await this.saveUserUsingQueryRunner(
      name,
      email,
      password,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken: signupVerifyToken },
    });

    // DB에서 signupVerifyToken으로 회원 가입 처리 중인 유저가 있는지 조회하고 없다면 에러 처리
    if (!user) {
      throw new UnprocessableEntityException('가입 처리 중인 유저가 없습니다.');
    }

    // 바로 로그인 상태가 되도록 JWT를 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    // email, password 가진 유저가 있는지 DB에서 조회하고 없다면 에러 처리
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    // JWT 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async findAll(): Promise<string> {
    // TODO: DB 연동 이후 구현
    throw new Error('Method not implemented.');
  }

  getHello() {
    return 'Hello World!';
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

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect(); // QueryRunner를 데이터베이스에 연결
    await queryRunner.startTransaction(); // 트랜잭션 시작

    try {
      const user = new UserEntity(); // 새로운 유저 엔티티 객체 생성
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user); // 트랜젝션을 커밋하여 영속화 한다.
      // throw new InternalServerErrorException('일부러 에러 발생');
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity(); // 새로운 유저 엔티티 객체 생성
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user); // 트랜젝션을 커밋하여 영속화 한다.

      // throw new InternalServerErrorException('일부러 에러 발생');
    });
  }
}
