import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `✅ ${method} ${url} - ${Date.now() - now}ms - Success - Response: ${JSON.stringify(data)}`,
        );
      }),
      catchError((err) => {
        const statusCode = err?.status || 500;
        const message =
          err?.response?.message || err?.message || 'Internal server error';

        this.logger.error(
          `❌ ${method} ${url} - ${Date.now() - now}ms - Failed - Status: ${statusCode} - Error: ${JSON.stringify(message)}`,
        );

        return throwError(() => err);
      }),
    );
  }
}