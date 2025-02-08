import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingRequestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, headers, body } = request;

    const startTime = Date.now();

    this.logger.log(`Incoming Request - Method: ${method}, URL: ${url}`);
    this.logger.debug(`Request Headers: ${JSON.stringify(headers)}`);
    this.logger.debug(`Request Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`Request to ${url} completed in ${duration}ms`);
      }),
    );
  }
}
