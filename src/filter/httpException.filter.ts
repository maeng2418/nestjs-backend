import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

// @Catch 데커레이터는 처리되지 않은 모든 예외를 잡으려 할 때 사용
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // 대부분의 예외는 이미 Nest에서 HttpException을 상속받는 클래스들로 제공되므로
    // HttpException이 아닌 경우 알 수 없는 에러 이므로 InternalServerErrorException로 처리
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    // HttpException을 상속받는 클래스들은 기존 그대로 처리
    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    this.logger.log(log);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
