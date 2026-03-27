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
        message:
          'Сервер хүсэлтийг боловсруулах явцад урьдчилан тооцоогүй алдаа гаргалаа. Хэрэв асуудал давтагдвал серверийн лог болон тохиргоог шалгана уу.',
        ...basePayload,
      };
    }

    const rawResponse = exception.getResponse();

    if (typeof rawResponse === 'string') {
      return {
        statusCode: status,
        error: exception.name,
        message: this.translateMessage(rawResponse, status),
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
        message: this.translateMessage(
          body.message ??
            'Сервер хоосон алдааны хариу буцаасан тул хүсэлтийг гүйцээж чадсангүй.',
          status,
        ),
        ...basePayload,
      };
    }

    return {
      statusCode: status,
      error: exception.name,
      message:
        'Хүсэлт амжилтгүй болсон ч сервер уншигдахуйц алдааны мэдээлэл өгөөгүй байна.',
      ...basePayload,
    };
  }

  private translateMessage(
    message: string | string[],
    status: number,
  ): string | string[] {
    if (Array.isArray(message)) {
      return message.map((entry) => this.translateSingleMessage(entry, status));
    }

    return this.translateSingleMessage(message, status);
  }

  private translateSingleMessage(message: string, status: number): string {
    if (!message) {
      return status >= 500
        ? 'Сервер дотоод алдаа гаргасан байна.'
        : 'Хүсэлтийн мэдээлэл буруу байна.';
    }

    if (message.includes('Cloudflare D1 credentials are not fully configured')) {
      return 'Cloudflare D1-ийн орчны хувьсагч дутуу байна. `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN` утгуудыг `.env` эсвэл deployment secret дээр бүрэн тохируулна уу.';
    }

    if (message.includes('Cloudflare D1 request timed out')) {
      return 'Cloudflare D1 өгөгдлийн сан одоогоор хугацаандаа хариу өгсөнгүй. D1 үйлчилгээ ачаалалтай эсвэл түр доголдолтой байж магадгүй. Дахин оролдоно уу.';
    }

    if (message.includes('Cloudflare D1 request failed with status')) {
      return `Cloudflare D1 өгөгдлийн сан одоогоор хүсэлтийг боловсруулах боломжгүй байна. Дэлгэрэнгүй: ${message}. Cloudflare талын төлөв болон D1 тохиргоог шалгана уу.`;
    }

    if (message.includes('Cloudflare D1 rejected the request')) {
      return 'Cloudflare D1 хүсэлтийг буцаалаа. SQL хүсэлт, токен эрх, эсвэл өгөгдлийн сангийн тохиргоог шалгана уу.';
    }

    if (message.includes('Cloudflare D1 statement failed')) {
      return 'Cloudflare D1 дээр SQL ажиллагаа амжилтгүй боллоо. Миграци, хүсэлтийн бүтэц, хүснэгтийн схемийг шалгана уу.';
    }

    if (message.includes('Cloudflare R2 credentials are not fully configured')) {
      return 'Cloudflare R2-ийн орчны хувьсагч дутуу байна. `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY` утгуудыг бүрэн тохируулна уу.';
    }

    if (message.includes('Missing API_BASE_URL')) {
      return 'Frontend серверийн орчинд `API_BASE_URL` тохируулагдаагүй байна. Production орчинд backend-ийн бүрэн `/api` URL-ийг env дээр заавал тохируулна уу.';
    }

    if (message.startsWith('Failed to handle GET /student-exam-results')) {
      return 'Оюутны шалгалтын дүнг унших үед сервер талд алдаа гарлаа. Cloudflare D1 одоогоор ажиллахгүй байгаа эсвэл хүснэгтийн миграци дутуу байж магадгүй.';
    }

    if (message.startsWith('Failed to handle POST /student-exam-results')) {
      return 'Оюутны шалгалтын дүнг хадгалах үед сервер талд алдаа гарлаа. Cloudflare D1 одоогоор боломжгүй эсвэл `student_exam_results` хүснэгт миграцаар үүсээгүй байж магадгүй.';
    }

    if (message.startsWith('Failed to list exams')) {
      return 'Шалгалтын жагсаалтыг унших үед алдаа гарлаа. Cloudflare D1 холболт болон шалгалтын хүснэгтийн төлөвийг шалгана уу.';
    }

    if (message.startsWith('Failed to create exam')) {
      return 'Шалгалт үүсгэх үед алдаа гарлаа. Cloudflare D1 одоогоор бичих хүсэлтийг хүлээж авахгүй байгаа эсвэл шалгалтын өгөгдөл буруу байна.';
    }

    return message;
  }
}
