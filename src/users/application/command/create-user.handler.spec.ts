import { UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserFactory } from 'src/users/domain/user.factory';
import { UserRepository } from 'src/users/infra/db/repository/UserRepository';
import * as ulid from 'ulid';
import * as uuid from 'uuid';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';

// CreateUserHandler.execute 내에서 uuid와 ulid 라이브러리를 사용
jest.mock('uuid');
jest.mock('ulid');
// 외부 라이브러리가 생성하는 임의의 문자열이 항상 같은 값이 나오도록 함.
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(ulid, 'ulid').mockReturnValue('ulid');

describe('CreateUserHandler', () => {
  // 테스트 대상인 CreateUserHandler와 의존하고 있는 클래스를 선언
  let createUserHandler: CreateUserHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        // UserFactory, UserRepository를 모의 객체로 제공
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  // 항상 같은 값을 가지는 변수를 미리 선언하고 재사용
  const id = ulid.ulid();
  const name = 'Dexter';
  const email = 'dexter.haan@gmail.com';
  const password = 'pass1234';
  const signupVerifyToken = uuid.v1();

  describe('execute', () => {
    it('should execute CreateUserCommand', async () => {
      // Given
      // 기본 테스트 케이스를 위해 userRepository에 저장된 유저가 없는 조건을 설정
      userRepository.checkUserExists = jest.fn().mockResolvedValue(null);

      // When
      await createUserHandler.execute(
        new CreateUserCommand(name, email, password),
      );

      // Then
      // 인수까지 제대로 넘기고 호출하는지 검증
      expect(userRepository.saveUserUsingQueryRunner).toHaveBeenCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
      expect(userFactory.create).toHaveBeenCalledWith(
        id,
        name,
        email,
        signupVerifyToken,
        password,
      );
    });

    it('should throw UnprocessableEntityException when user exists', async () => {
      // Given
      // 생성하려는 유저 정보가 이미 저장되어 있는 경우를 모의한다.
      userRepository.checkUserExists = jest.fn().mockResolvedValue({
        id,
        name,
        email,
        password,
        signupVerifyToken,
      });

      // When
      // Then
      // 원하는 예외가 발생하는지 검증
      await expect(
        createUserHandler.execute(new CreateUserCommand(name, email, password)),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
