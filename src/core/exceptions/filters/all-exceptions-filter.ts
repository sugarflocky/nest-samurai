//Все ошибки
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import {
  BaseHttpExceptionFilter,
  HttpResponseBody,
} from './base-exception-filter';
import { Request } from 'express';
import { CoreConfig } from '../../core.config';

@Catch()
export class AllHttpExceptionsFilter extends BaseHttpExceptionFilter<unknown> {
  constructor(private coreConfig: CoreConfig) {
    super();
  }

  getStatus(exception: unknown): number {
    //хотя мы используем кастомные domain exception,
    //NestJs все еще может выбросить стандартное http исключение в определенных сценариях
    //например, если мы не переопределили поведение passport strategy
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getResponseBody(exception: unknown, request: Request): HttpResponseBody {
    const isProduction = this.coreConfig.getEnv === 'production';
    const status = this.getStatus(exception);

    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: null,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      extensions: [],
      code: null,
    };
  }
}
