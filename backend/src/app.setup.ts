import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ACCESS_TOKEN_COOKIE } from './auth/constants/auth.constant.js';
import { type Environment, isEnabled, parseOrigins } from './common/config/environment.js';
import {
  API_PREFIX,
  COOKIE_AUTH_SCHEME,
  CSRF_HEADER_NAME,
  SWAGGER_DESCRIPTION,
  SWAGGER_PATH,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
} from './common/constants/api.constant.js';

const CONTENT_TYPE_HEADER = 'content-type';
const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'DELETE'];

const CONTROLLER_SUFFIX = 'Controller';

/** `UserController.findOne` becomes `userFindOne`, which names the generated client functions. */
const toOperationId = (controllerKey: string, methodKey: string) => {
  const feature = controllerKey.replace(CONTROLLER_SUFFIX, '');
  return `${feature.charAt(0).toLowerCase()}${feature.slice(1)}${methodKey.charAt(0).toUpperCase()}${methodKey.slice(1)}`;
};

export const buildOpenApiDocument = (app: INestApplication) =>
  SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(SWAGGER_TITLE)
      .setDescription(SWAGGER_DESCRIPTION)
      .setVersion(SWAGGER_VERSION)
      .addCookieAuth(ACCESS_TOKEN_COOKIE, { type: 'apiKey', in: 'cookie' }, COOKIE_AUTH_SCHEME)
      .build(),
    { operationIdFactory: toOperationId },
  );

/**
 * Everything the HTTP app needs besides its modules: the route prefix, cookies,
 * security headers, CORS and CSRF limited to the web app's origins, and the API docs.
 * Tests call it too, so they exercise the same setup as production.
 */
export const setUpApp = (app: INestApplication) => {
  const configService = app.get<ConfigService<Environment, true>>(ConfigService);
  const trustedOrigins = parseOrigins(configService.get('WEB_ORIGINS', { infer: true }));

  app.setGlobalPrefix(API_PREFIX);
  app.use(cookieParser());
  app.useSecurityHeaders();
  app.enableCsrfProtection({ trustedOrigins });
  app.enableCors({
    origin: trustedOrigins,
    credentials: true,
    methods: ALLOWED_METHODS,
    allowedHeaders: [CONTENT_TYPE_HEADER, CSRF_HEADER_NAME],
  });

  // The documentation is only served where it has been switched on deliberately.
  if (isEnabled(configService.get('SWAGGER_ENABLED', { infer: true }))) {
    SwaggerModule.setup(SWAGGER_PATH, app, buildOpenApiDocument(app));
  }
};
