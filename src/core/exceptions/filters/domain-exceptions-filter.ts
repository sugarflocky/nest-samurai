//Ошибки класса DomainException (instanceof DomainException)
import { Catch, HttpStatus } from '@nestjs/common';
import { DomainException } from '../domain-exceptions';
import { BaseHttpExceptionFilter } from './base-exception-filter';
import { DomainExceptionCode } from '../domain-exception-codes';

@Catch(DomainException)
export class DomainHttpExceptionsFilter extends BaseHttpExceptionFilter<DomainException> {
  getStatus(exception: DomainException): number {
    switch (exception.code) {
      case DomainExceptionCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  // @ts-ignore
  getResponseBody(exception: DomainException) {
    switch (exception.code) {
      case DomainExceptionCode.BadRequest:
        return {
          errorsMessages: exception.extensions,
        };
      case DomainExceptionCode.Forbidden:
        return;
      case DomainExceptionCode.NotFound:
        return;
      case DomainExceptionCode.Unauthorized:
        return;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }
}
