import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DogHealthIndicator } from './dog-health-indicator';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // pingCheck 함수를 이용하여 서비스가 제공하는 다른 서버가 잘 동작하고 있는지 확인한다.
      // https://docs.nestjs.com 에 요청을 보내고
      // 응답을 잘 받으면 응답 결과에 첫 번째 인수로 넣은 nestjs-docs로 응답
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      // DB 헬스 체크
      () => this.db.pingCheck('database'),
      // 강아지 헬스 체크
      () => this.dogHealthIndicator.isHealthy('dog'),
    ]);
  }
}
