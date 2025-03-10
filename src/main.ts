import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import * as dotenv from 'dotenv';
import { CoreConfig } from './core/core.config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const coreConfig = app.get(CoreConfig);
  appSetup(app);
  await app.listen(coreConfig.getPort);
}
bootstrap();
