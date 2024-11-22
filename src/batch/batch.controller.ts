import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  // SchedulerRegistry 객체를 BatchController에 주입
  constructor(private scheduler: SchedulerRegistry) {}

  @Post('/start-sample')
  start() {
    // SchedulerRegistry에 등록된 크론 잡을 가져오기
    const job = this.scheduler.getCronJob('cronSample');

    // 크론 잡 시작
    job.start();
    console.log('start!! ', job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    // SchedulerRegistry에 등록된 크론 잡을 가져오기
    const job = this.scheduler.getCronJob('cronSample');

    // 크론 잡 정지
    job.stop();
    console.log('stopped!! ', job.lastDate());
  }
}
