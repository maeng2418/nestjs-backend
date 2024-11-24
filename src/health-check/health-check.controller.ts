import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // pingCheck 함수를 이용하여 서비스가 제공하는 다른 서버가 잘 동작하고 있는지 확인한다.
    // 위 예에서는 https://docs.nestjs.com 에 요청을 보내고
    // 응답을 잘 받으면 응답 결과에 첫 번째 인수로 넣은 nestjs-docs로 응답
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
