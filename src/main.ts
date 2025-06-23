import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { join } from 'path';
import { ValidationPipe, BadRequestException, ValidationError  } from '@nestjs/common';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());

  /* Start-: This is use for showing api request body validation errors*/
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.flatMap(error => {
          const constraints = error.constraints;
          return Object.values(constraints || {}).map(msg => ({
            field: error.property,
            error: msg,
          }));
        });

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
        });
      },
    }),
  );
 /* End-: This is use for showing api request body validation errors*/

  await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
}
bootstrap();
