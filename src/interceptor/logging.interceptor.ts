import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Intercept Request to ${method} ${url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `Intercept Response from ${method} ${url} \n response: ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
