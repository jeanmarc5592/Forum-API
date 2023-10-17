import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');

  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
