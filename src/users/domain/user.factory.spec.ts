import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { User } from './user';
import { UserFactory } from './user.factory';

describe('UserFactory', () => {
  let userFactory: UserFactory;
  // EventBus를 Jest에서 제공하는 Mocked 객체로 선언
  let eventBus: jest.Mocked<EventBus>;

  // 모듈을 가져오는 것은 전체 테스트 스위트 내에서 한 번만 이루어지면 된다.
  beforeAll(async () => {
    // @nest/testing 패키지에서 제공하는 Test.createTestingModule()를 사용하여 테스트 모듈(테스트용 객체)을 생성
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          // EventBus를 프로바이더로 제공. 이때 EventBus의 함수를 mocking 한다.
          provide: EventBus,
          useValue: {
            // jest.fn()은 어떠한 동작도 하지 않는 함수라는 뜻.
            publish: jest.fn(),
          },
        },
      ],
    }).compile(); // compile 함수를 수행해서 모듈 생성을 완료. (비동기로 처리)

    userFactory = module.get(UserFactory);
    // 프로바이더로 제공된 EventBus 객체를 테스트 모듈에서 가져옴.
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create user', () => {
      // Given

      // When
      const user = userFactory.create(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'signup-verify-token',
        'pass1234',
      );

      // Then
      const expected = new User(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'pass1234',
        'signup-verify-token',
      );
      // UserFactory.create를 통해 생성한 User 객체가 원하는 객체와 맞는지 검사
      expect(expected).toEqual(user);
      // EventBus.publish 함수가 호출되었는지 판단
      expect(eventBus.publish).toHaveBeenCalled();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user', () => {
      // Given

      // When
      const user = userFactory.reconstitute(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'pass1234',
        'signup-verify-token',
      );

      // Then
      const expected = new User(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'signup-verify-token',
        'pass1234',
      );
      expect(expected).toEqual(user);
    });
  });
});
