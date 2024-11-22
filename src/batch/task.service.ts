import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // 매초 수행되는 태스크
  // @Cron('* * * * * *', { name: 'cronTesk' })
  // 앱이 실행되고 나서 3초 뒤에 수행
  // @Cron(new Date(Date.now() + 3 * 1000), { name: 'cronTesk' })
  // 매주 월요일부터 금요일까지 새벽 1시에 수행
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM, { name: 'cronTesk' })
  handleCron() {
    this.logger.log('Task Called');
  }
}
