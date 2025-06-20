
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class MultipartFormGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    if (!contentType?.startsWith('multipart/form-data')) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          message: 'Content-Type must be multipart/form-data',
        },
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    return true;
  }
}
