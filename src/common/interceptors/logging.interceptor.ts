import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const requestId = req.headers['x-request-id'] || 'N/A';
    const userId = req.user?.userId || 'anonymous';
    const now = Date.now();

    this.logger.log(
      `[${requestId}] ${method} ${url} - user:${userId} - START`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.logger.log(
          `[${requestId}] ${method} ${url} - ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}
