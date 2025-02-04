import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class RequestCancelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const cancel$ = new Observable<void>((observer) => {
      request.on('close', () => {
        observer.next();
        observer.complete();
      });
    });

    return next.handle().pipe(takeUntil(cancel$));
  }
}
