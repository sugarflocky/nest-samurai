import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import * as dotenv from 'dotenv';
import { useContainer } from 'class-validator';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  appSetup(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
