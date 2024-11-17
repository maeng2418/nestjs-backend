import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 요청이 전달되기 전 로그를 출력
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // 요청이 처리된 후 로그를 출력
        console.log(`After...${Date.now() - now}ms`);
      }),
    );
  }
}
