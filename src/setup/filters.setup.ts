import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../core/exceptions/exception-filter';

export function filtersSetup(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}
