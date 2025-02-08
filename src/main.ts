import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { instance } from './common/logger/winston.logger';

// interceptor
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';
import { RequestCancelInterceptor } from './common/interceptor/request-cancel/request-cancel.interceptor';
import { LoggingRequestInterceptor } from './common/interceptor/logging-request/logging-request.interceptor';

import { CustomHttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance }),
  });

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new CustomHttpExceptionFilter());

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.useGlobalInterceptors(
    new RequestCancelInterceptor(),
    new ResponseInterceptor(),
    new LoggingRequestInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  await app.listen(configService.get('app.PORT') ?? 3000);
}
bootstrap();
