import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type RequestWithId = Request & {
  requestId?: string;
};

type ErrorResponseBody = {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  requestId: string | null;
  timestamp: string;
};

@Catch()
export class HttpExceptionLoggingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = this.buildResponseBody(exception, request, status);

    const message =
      Array.isArray(responseBody.message)
        ? responseBody.message.join(' ')
        : responseBody.message;

    const errorLog = {
      level: status >= 500 ? 'error' : 'warn',
      requestId: request?.requestId ?? null,
      method: request?.method ?? 'UNKNOWN',
      path: request?.originalUrl ?? 'UNKNOWN',
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      console.error(JSON.stringify(errorLog));
    } else {
      console.warn(JSON.stringify(errorLog));
    }

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    exception: unknown,
    request: RequestWithId,
    status: number,
  ): ErrorResponseBody {
    const basePayload = {
      path: request?.originalUrl ?? 'UNKNOWN',
      requestId: request?.requestId ?? null,
      timestamp: new Date().toISOString(),
    };

    if (!(exception instanceof HttpException)) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'The server hit an unexpected error while processing the request.',
        ...basePayload,
      };
    }

    const rawResponse = exception.getResponse();

    if (typeof rawResponse === 'string') {
      return {
        statusCode: status,
        error: exception.name,
        message: rawResponse,
        ...basePayload,
      };
    }

    if (rawResponse && typeof rawResponse === 'object') {
      const body = rawResponse as {
        error?: string;
        message?: string | string[];
        statusCode?: number;
      };

      return {
        statusCode: body.statusCode ?? status,
        error: body.error ?? exception.name,
        message:
          body.message ??
          'The request could not be completed because the server returned an empty error response.',
        ...basePayload,
      };
    }

    return {
      statusCode: status,
      error: exception.name,
      message: 'The request failed, but the server did not provide a readable error message.',
      ...basePayload,
    };
  }
}
