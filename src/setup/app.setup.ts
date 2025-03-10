import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger.setup';
import { pipesSetup } from './pipes.setup';
import * as cookieParser from 'cookie-parser';
import { globalPrefixSetup } from './global-prefix.setup';
import { validationConstraintSetup } from './validation-constraints.setup';

export function appSetup(app: INestApplication) {
  app.enableCors();
  app.use(cookieParser());
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
  validationConstraintSetup(app);
}
