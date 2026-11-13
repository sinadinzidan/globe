import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setUpApp } from './app.setup.js';
import type { Environment } from './common/config/environment.js';

const app = await NestFactory.create(AppModule);
setUpApp(app);
await app.listen(
  app.get<ConfigService<Environment, true>>(ConfigService).get('PORT', { infer: true }),
);
