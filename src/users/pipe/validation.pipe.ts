/* eslint-disable @typescript-eslint/ban-types */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
class ValidationPipe implements PipeTransform<any> {
  // 전달된 metatype이 파이프가 지원하는 타입인지 검사
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // metatype은 라우트 핸들러에 정의된 인수의 타입을 알려준다.
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    /**
     * plainToClass() 함수는 일반 객체를 클래스 인스턴스로 변환한다.
     * class-validator의 유효성 검사 데커레이터는 타입이 필요한데,
     * 네트워크 요청을 통해 들어온 데이터는 본문의 객체가 아무런 타입 정보를 가지고 있지 않기 때문에
     * 타입을 지정하는 변환 과정을 plainToClass를 통해 역직렬화 과정을 거친다.
     */
    const object = plainToClass(metatype, value);

    // validate() 함수는 전달된 객체를 검사
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

export default ValidationPipe;
