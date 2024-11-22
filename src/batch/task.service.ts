import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // SchedulerRegistry 객체를 TaskService에 주입
  constructor(private schedulerRegistry: SchedulerRegistry) {
    // TaskService가 생성될 때 크론 잡 하나를 SchedulerRegistry에 추가.
    // 태스크 스케줄링 등록 X
    this.addCronJob();
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }

  // 매초 수행되는 태스크
  // @Cron('* * * * * *', { name: 'cronTesk' })
  // 앱이 실행되고 나서 3초 뒤에 수행
  // @Cron(new Date(Date.now() + 3 * 1000), { name: 'cronTesk' })
  // 매주 월요일부터 금요일까지 새벽 1시에 수행
  // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM, { name: 'cronTesk' })
  // handleCron() {
  //   this.logger.log('Task Called');
  // }

  // 앱이 실행되고 3초 후에 처음으로 수행되고 3초마다 수행
  // @Interval('intervalTask', 3000)
  // handleInterval() {
  //   this.logger.log('Task Called by interval');
  // }

  // 앱이 실행되고 5초 후에 수행
  // @Timeout('timeoutTask', 5000)
  // handleTimeout() {
  //   this.logger.log('Task Called by timeout');
  // }
}
