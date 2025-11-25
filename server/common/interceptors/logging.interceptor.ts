import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * 요청/응답 로깅 인터셉터
 * API 요청과 응답 시간을 로깅합니다.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - now;
                    this.logger.log(
                        `${method} ${url} - ${responseTime}ms`,
                    );
                },
                error: (error) => {
                    const responseTime = Date.now() - now;
                    this.logger.error(
                        `${method} ${url} - ${responseTime}ms - Error: ${error.message}`,
                    );
                },
            }),
        );
    }
}
