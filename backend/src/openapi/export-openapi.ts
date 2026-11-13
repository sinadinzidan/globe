// Writes the OpenAPI document to openapi.json, from which the web client is generated.
// Run with: npm run openapi:export

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { buildOpenApiDocument, setUpApp } from '../app.setup.js';

const OUTPUT_FILE = 'openapi.json';
const INDENTATION = 2;

const app = await NestFactory.create(AppModule, { logger: false });
setUpApp(app);
await writeFile(
  path.resolve(import.meta.dirname, '..', '..', OUTPUT_FILE),
  `${JSON.stringify(buildOpenApiDocument(app), null, INDENTATION)}\n`,
);
await app.close();
