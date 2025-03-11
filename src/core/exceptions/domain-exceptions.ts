import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorExtension {
  constructor(
    public message: string,
    public field: string | null = null,
  ) {}
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public extensions: ErrorExtension[],
  ) {
    super(message);
  }
}

export class BadRequestDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Bad Request', DomainExceptionCode.BadRequest, extensions);
  }

  /**
   * To create the most common exception with one extension or without one
   * @param message
   * @param field
   */
  static create(message?: string, field?: string) {
    return new this(message ? [new ErrorExtension(message, field)] : []);
  }
}

export class ForbiddenDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Forbidden', DomainExceptionCode.Forbidden, extensions);
  }

  /**
   * To create the most common exception with one extension or without one
   * @param message
   * @param field
   */
  static create(message?: string, field?: string) {
    return new this(message ? [new ErrorExtension(message, field)] : []);
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Unauthorized', DomainExceptionCode.Unauthorized, extensions);
  }

  /**
   * To create the most common exception with one extension or without one
   * @param message
   * @param field
   */
  static create(message?: string, field?: string) {
    return new this(message ? [new ErrorExtension(message, field)] : []);
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Not Found', DomainExceptionCode.NotFound, extensions);
  }

  /**
   * To create the most common exception with one extension or without one
   * @param message
   * @param field
   */
  static create(message?: string, field?: string) {
    return new this(message ? [new ErrorExtension(message, field)] : []);
  }
}
