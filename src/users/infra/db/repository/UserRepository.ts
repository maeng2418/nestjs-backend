import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/users/domain/repository/IUserRepository';
import { User } from 'src/users/domain/user';
import { UserFactory } from 'src/users/domain/user.factory';
import { DataSource, Repository } from 'typeorm';
import UserEntity from '../entity/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  // 인수로 전달된 이메일을 가진 유저를 DB에서 조회
  async checkUserExists(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) return null;

    const { id, name, signupVerifyToken, password } = userEntity;

    // UserFactory의 create 함수 로직 내에는 UserCreateEvent를 발행하는 로직이 포함되어 있어 재사용할 수 없다.
    // 따라서 유저 도메인 객체를 생성하는 reconstitute 함수를 사용한다.
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  // CreateUserHandler에서 사용하는 저장 로직인 saveUserUsingQueryRunner 함수를 이관
  async saveUserUsingQueryRunner(
    id: string,
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
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user); // 트랜젝션을 커밋하여 영속화 한다.
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();
    }
  }
}
