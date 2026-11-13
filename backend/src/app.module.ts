import { type ExecutionContext, Module, ValidationPipe } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from './asset/asset.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import {
  type Environment,
  NodeEnvironment,
  validateEnvironment,
} from './common/config/environment.js';
import {
  AUTH_RATE_LIMITED_KEY,
  AUTH_THROTTLER_NAME,
  DEFAULT_RATE_LIMIT,
  DEFAULT_THROTTLER_NAME,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_MINUTE,
} from './common/constants/throttle.constant.js';
import { buildDatabaseOptions } from './common/database/database-options.js';
import { CsrfHeaderGuard } from './common/guards/csrf-header.guard.js';
import { PlantModule } from './plant/plant.module.js';
import { RoleModule } from './role/role.module.js';
import { UserModule } from './user/user.module.js';
import { WorkOrderModule } from './work-order/work-order.module.js';

const SIGNING_ALGORITHM = 'HS256';

const isAuthRateLimited = (context: ExecutionContext) =>
  new Reflector().get<boolean | undefined>(AUTH_RATE_LIMITED_KEY, context.getHandler()) === true;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Environment, true>) =>
        buildDatabaseOptions(configService.get('DATABASE_URL', { infer: true })),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Environment, true>) => [
        { name: DEFAULT_THROTTLER_NAME, ttl: MILLISECONDS_PER_MINUTE, limit: DEFAULT_RATE_LIMIT },
        {
          name: AUTH_THROTTLER_NAME,
          ttl: MILLISECONDS_PER_MINUTE,
          limit: configService.get('AUTH_RATE_LIMIT', { infer: true }),
          skipIf: (context: ExecutionContext) => !isAuthRateLimited(context),
        },
      ],
    }),
    // Authentication first: its guard sets the user that the authorization guard reads.
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Environment, true>) => ({
        accessToken: {
          key: configService.get('JWT_SECRET', { infer: true }),
          alg: SIGNING_ALGORITHM,
          issuer: configService.get('JWT_ISSUER', { infer: true }),
          audience: configService.get('JWT_AUDIENCE', { infer: true }),
          ttl:
            configService.get('ACCESS_TOKEN_TTL_MINUTES', { infer: true }) *
            MILLISECONDS_PER_MINUTE,
        },
        refreshToken: {
          ttl: configService.get('REFRESH_TOKEN_TTL_DAYS', { infer: true }) * MILLISECONDS_PER_DAY,
          absoluteTtl:
            configService.get('SESSION_TTL_DAYS', { infer: true }) * MILLISECONDS_PER_DAY,
        },
        // Tests run without NODE_ENV=production; production refuses to start without the database store.
        allowInMemoryStorage:
          configService.get('NODE_ENV', { infer: true }) === NodeEnvironment.TEST,
      }),
    }),
    AuthorizationModule.forRoot(),
    CommonModule,
    UserModule,
    AuthModule,
    RoleModule,
    PlantModule,
    AssetModule,
    WorkOrderModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfHeaderGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
