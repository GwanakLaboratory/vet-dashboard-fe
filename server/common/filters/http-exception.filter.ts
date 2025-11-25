import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 전역 HTTP 예외 필터
 * 모든 HTTP 예외를 일관된 형식으로 처리합니다.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message:
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || 'Internal server error',
        };

        // 개발 환경에서는 스택 트레이스 포함
        if (process.env.NODE_ENV === 'development') {
            (errorResponse as any).stack = exception.stack;
        }

        response.status(status).json(errorResponse);
    }
}

/**
 * 모든 예외를 처리하는 전역 필터
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
        };

        // 개발 환경에서는 스택 트레이스 포함
        if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
            (errorResponse as any).stack = exception.stack;
        }

        console.error('Exception caught:', exception);

        response.status(status).json(errorResponse);
    }
}
