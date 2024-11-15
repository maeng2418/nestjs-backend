import { Injectable } from '@nestjs/common';
import { LoggerService } from './logging/logger.service';

@Injectable()
export class AppService {
  constructor(private logger: LoggerService) {}

  getHello(): string {
    this.logger.error('level: error');
    this.logger.warn('level: warn');
    this.logger.log('level: log');
    this.logger.verbose('level: verbose');
    this.logger.debug('level: debug');

    return 'Hello World!';
  }
}
