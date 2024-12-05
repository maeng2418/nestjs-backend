/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// 참조하려는 다른 속성의 이름과 ValidationOptions를 인수로 받는다.
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // 데커레이터가 선언될 객체와 속성 이름을 받는다.
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn', // 데커레이터의 이름
      target: object.constructor, // 이 데커레이터는 객체가 생성될 때 적용됨.
      propertyName,
      options: validationOptions, // 유효성 옵션은 데커레이터의 인수로 전달받은 것을 사용.
      constraints: [property], // 이 데커레이터는 속성에 적용되도록 제약 조건을 설정.
      validator: {
        // 유효성 검사 규칙 기술
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
