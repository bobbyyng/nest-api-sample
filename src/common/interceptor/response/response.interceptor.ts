import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined) return;

        const response = context.switchToHttp().getResponse();
        if ( data.status && response.statusCode !== data.status) {
          response.status(data.status);
        }

        if (response.statusCode !== HttpStatus.OK && response.statusCode !== HttpStatus.CREATED) {
          return {
            status_code: response.statusCode,
            message: data?.responses || data?.message || data,
          };
        }

        return {
          status_code: response.statusCode,
          message: data?.message || '',
          data: data?.data || null,
          meta: data?.meta || null,
        };
      }),
    );
  }
}
