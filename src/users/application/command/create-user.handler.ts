import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/users/domain/repository/IUserRepository';
import { UserFactory } from 'src/users/domain/user.factory';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { CreateUserCommand } from './create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    // IUserRepository는 클래스가 아니기 때문에 의존성 클래스로 주입받을 수 없다.
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 구체 클래스르 주입받는다.
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    // IUserRepository의 checkUserExists 메서드를 이용하여 데이터를 조회
    const userExist = await this.userRepository.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    const id = ulid();

    // IUserRepository의 saveUserUsingQueryRunner 메서드를 이용하여 데이터를 저장
    await this.userRepository.saveUserUsingQueryRunner(
      id,
      name,
      email,
      password,
      signupVerifyToken,
    );

    // CreateUserHandler는 더 이상 직접 UserCreatedEvent를 발행하지 않는다.
    this.userFactory.create(id, name, email, signupVerifyToken, password);
  }
}
