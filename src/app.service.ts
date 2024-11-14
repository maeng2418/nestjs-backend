import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name); // 어느 콘텍스트에서 로깅을 하는지 알려주는 이름을 제공

  getHello(): string {
    this.logger.error('level: error');
    this.logger.warn('level: warn');
    this.logger.log('level: log');
    this.logger.verbose('level: verbose');
    this.logger.debug('level: debug');

    return 'Hello World!';
  }
}
