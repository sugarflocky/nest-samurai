import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger.setup';
import { pipesSetup } from './pipes.setup';
import { filtersSetup } from './filters.setup';
import * as cookieParser from 'cookie-parser';

export function appSetup(app: INestApplication) {
  app.enableCors();
  app.use(cookieParser());
  pipesSetup(app);
  filtersSetup(app);
  //globalPrefixSetup(app);
  swaggerSetup(app);
}
