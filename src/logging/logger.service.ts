/* eslint-disable prefer-rest-params */
import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.doSomething();
  }

  warn(message: any, stack?: string, context?: string) {
    super.warn.apply(this, arguments);
    this.doSomething();
  }

  log(message: any, stack?: string, context?: string) {
    super.log.apply(this, arguments);
    this.doSomething();
  }

  verbose(message: any, stack?: string, context?: string) {
    super.verbose.apply(this, arguments);
    this.doSomething();
  }

  debug(message: any, stack?: string, context?: string) {
    super.debug.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직을 추가합니다.
    // ex. DB에 저장
  }
}
