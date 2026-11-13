import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthSession } from './entities/auth-session.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { AccessTokenCookieProvider } from './providers/access-token-cookie.provider.js';
import { SessionService } from './services/session.service.js';
import { TokenCookieService } from './services/token-cookie.service.js';
import { RefreshTokenTypeOrmStore } from './stores/refresh-token.store.js';

@Module({
  imports: [TypeOrmModule.forFeature([AuthSession, RefreshToken]), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    TokenCookieService,
    RefreshTokenTypeOrmStore,
    AccessTokenCookieProvider,
  ],
  exports: [SessionService],
})
export class AuthModule {}
