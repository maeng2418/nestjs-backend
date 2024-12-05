import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserCreatedEvent } from './user-created.event';

@Injectable()
export class UserFactory {
  // EventBus를 주입
  constructor(private eventBus: EventBus) {}

  // 유저 객체를 생성하는 create 함수 제공
  create(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    // 유저 객체를 생성
    const user = new User(id, name, email, password, signupVerifyToken);
    // UserCreatedEvent를 발행
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    // 생성한 유저 도메인 객체를 리턴
    return user;
  }

  reconstitute(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    return new User(id, name, email, password, signupVerifyToken);
  }
}
