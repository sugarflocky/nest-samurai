import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger.setup';
import { pipesSetup } from './pipes.setup';
import { filtersSetup } from './filters.setup';

export function appSetup(app: INestApplication) {
  app.enableCors();
  pipesSetup(app);
  filtersSetup(app);
  //globalPrefixSetup(app);
  swaggerSetup(app);
}
