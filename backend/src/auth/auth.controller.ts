import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CurrentUser, Public } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ApiProtected } from '../common/decorators/api-errors.decorator.js';
import { AuthRateLimited } from '../common/decorators/auth-rate-limited.decorator.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type.js';
import { AuthService } from './auth.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { CurrentUserDto } from './dto/current-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SessionDto } from './dto/session.dto.js';
import { SessionService } from './services/session.service.js';
import { TokenCookieService } from './services/token-cookie.service.js';
import { toClientDetails } from './utilities/client-details.utility.js';

const COOKIES_SET_DESCRIPTION =
  'The access and refresh tokens are set as HttpOnly cookies. The body is empty.';
const CSRF_DESCRIPTION =
  'The required request header is missing, or the request came from another site.';
const RATE_LIMIT_DESCRIPTION = 'Too many attempts. Try again later.';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly tokenCookieService: TokenCookieService,
  ) {}

  @Public()
  @AuthRateLimited()
  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign in with an email and password. Public.' })
  @ApiNoContentResponse({ description: COOKIES_SET_DESCRIPTION })
  @ApiBadRequestResponse({ description: 'The request body is not valid.' })
  @ApiUnauthorizedResponse({ description: 'The email or password is incorrect.' })
  @ApiForbiddenResponse({ description: CSRF_DESCRIPTION })
  @ApiTooManyRequestsResponse({ description: RATE_LIMIT_DESCRIPTION })
  async login(
    @Body() credentials: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.tokenCookieService.write(
      response,
      await this.authService.login(credentials, toClientDetails(request)),
    );
  }

  @Public()
  @AuthRateLimited()
  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Exchange the refresh token cookie for new tokens. Public: it is called when the access token has expired.',
  })
  @ApiNoContentResponse({ description: COOKIES_SET_DESCRIPTION })
  @ApiUnauthorizedResponse({
    description:
      'The refresh token is missing, expired, revoked or already used. A reused token ends the session.',
  })
  @ApiForbiddenResponse({ description: CSRF_DESCRIPTION })
  @ApiTooManyRequestsResponse({ description: RATE_LIMIT_DESCRIPTION })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const tokens = await this.authService.refresh(
        this.tokenCookieService.readRefreshToken(request),
      );
      this.tokenCookieService.write(response, tokens);
    } catch (error) {
      this.tokenCookieService.clear(response);
      throw error;
    }
  }

  @Can.Anyone()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign out: end the session and clear the cookies. Any signed-in user.' })
  @ApiNoContentResponse({ description: 'The session was ended.' })
  @ApiProtected()
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user);
    this.tokenCookieService.clear(response);
  }

  @Can.Anyone()
  @Get('me')
  @ApiOperation({
    summary: 'The signed-in user, with their role and permissions. Any signed-in user.',
  })
  @ApiOkResponse({ type: CurrentUserDto })
  @ApiProtected()
  me(@CurrentUser() user: AuthenticatedUser) {
    return CurrentUserDto.from(user);
  }

  @Can.Anyone()
  @AuthRateLimited()
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Change your own password. Ends all your sessions and starts a new one here. Any signed-in user.',
  })
  @ApiNoContentResponse({ description: COOKIES_SET_DESCRIPTION })
  @ApiBadRequestResponse({
    description: 'The current password is wrong, or the new one is not acceptable.',
  })
  @ApiProtected()
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() change: ChangePasswordDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.changePassword(user, change, toClientDetails(request));
    this.tokenCookieService.write(response, tokens);
  }

  @Can.Anyone()
  @Get('sessions')
  @ApiOperation({ summary: 'The places you are signed in. Any signed-in user, own sessions only.' })
  @ApiOkResponse({ type: [SessionDto] })
  @ApiProtected()
  async listSessions(@CurrentUser() user: AuthenticatedUser) {
    const sessions = await this.sessionService.listForUser(user.id);
    return sessions.map((session) => SessionDto.from(session, user.sessionId));
  }

  @Can.Anyone()
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Sign out one of your sessions. Any signed-in user, own sessions only.',
  })
  @ApiNoContentResponse({ description: 'The session was ended.' })
  @ApiNotFoundResponse({ description: 'You have no such session.' })
  @ApiProtected()
  async endSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    await this.sessionService.endOwned(user.id, sessionId);
  }
}
