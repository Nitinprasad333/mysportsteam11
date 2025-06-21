// src/common/interceptors/content-type.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,

} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SKIP_CONTENT_TYPE_CHECK } from '../utility/decorators/skip-content-type.decorator';
import { Reflector } from '@nestjs/core';


@Injectable()
export class ContentTypeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isSkipped = this.reflector.getAllAndOverride<boolean>(
      SKIP_CONTENT_TYPE_CHECK,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipped) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    if (['GET','POST', 'PUT', 'PATCH','DELETE'].includes(request.method)) {
      const contentType = request.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        throw new BadRequestException('Content-Type must be application/json');
      }
    }

    return next.handle();
  }
}
