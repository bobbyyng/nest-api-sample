import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Personal AI Agent API')
    .setDescription('Personal AI Agent API')
    .setVersion('1.0')
    .setContact('', '', '')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      docExpansion: 'none',
    },
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
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
