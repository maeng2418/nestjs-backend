import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';

@Module({
  // 스케줄러를 초기화 하고 앱에 선언한 크론 잡과 타임아웃, 인터벌을 등록
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService],
})
export class BatchModule {}
