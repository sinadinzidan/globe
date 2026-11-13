import { plainToInstance, Transform } from 'class-transformer';
import { isString } from '../utilities/type-guard.utility.js';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  TEST = 'TEST',
  PRODUCTION = 'PRODUCTION',
}

const MINIMUM_SECRET_LENGTH = 32;
const MINIMUM_PORT = 1;
const MAXIMUM_PORT = 65_535;
const DEFAULT_PORT = 3000;
const TRUE_TEXT = 'true';
const FALSE_TEXT = 'false';
const DEFAULT_ACCESS_TOKEN_TTL_MINUTES = 10;
const DEFAULT_REFRESH_TOKEN_TTL_DAYS = 7;
const DEFAULT_SESSION_TTL_DAYS = 30;
const DEFAULT_AUTH_RATE_LIMIT = 10;

const toNumber = ({ value }: { value: unknown }) => Number(value);

/** Every setting the app reads from the environment, validated once at startup. */
export class Environment {
  @Transform(({ value }: { value: unknown }) => (isString(value) ? value.toUpperCase() : value))
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEVELOPMENT;

  @Transform(toNumber)
  @IsInt()
  @Min(MINIMUM_PORT)
  @Max(MAXIMUM_PORT)
  PORT: number = DEFAULT_PORT;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  /** Signs access tokens. Generate with `openssl rand -base64 32`. */
  @IsString()
  @MinLength(MINIMUM_SECRET_LENGTH)
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  JWT_AUDIENCE: string;

  @Transform(toNumber)
  @IsInt()
  @Min(1)
  ACCESS_TOKEN_TTL_MINUTES: number = DEFAULT_ACCESS_TOKEN_TTL_MINUTES;

  /** How long one refresh token works before it must be exchanged. */
  @Transform(toNumber)
  @IsInt()
  @Min(1)
  REFRESH_TOKEN_TTL_DAYS: number = DEFAULT_REFRESH_TOKEN_TTL_DAYS;

  /** How long a sign-in lasts at most, however often it is refreshed. */
  @Transform(toNumber)
  @IsInt()
  @Min(1)
  SESSION_TTL_DAYS: number = DEFAULT_SESSION_TTL_DAYS;

  /** Sign-in, refresh and password requests allowed per minute from one address. */
  @Transform(toNumber)
  @IsInt()
  @Min(1)
  AUTH_RATE_LIMIT: number = DEFAULT_AUTH_RATE_LIMIT;

  /** Comma-separated origins of the web app, for CORS and CSRF. */
  @IsString()
  @IsNotEmpty()
  WEB_ORIGINS: string;

  /** Only turn off on a plain-HTTP host that is not localhost. */
  @IsBooleanString()
  COOKIE_SECURE: string = TRUE_TEXT;

  @IsBooleanString()
  SWAGGER_ENABLED: string = FALSE_TEXT;
}

/** Fails startup with the list of problems when the environment is incomplete or invalid. */
export const validateEnvironment = (values: Record<string, unknown>) => {
  const environment = plainToInstance(Environment, values, { exposeDefaultValues: true });
  const errors = validateSync(environment, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.toString()).join('\n'));
  }
  return environment;
};

export const parseOrigins = (origins: string) =>
  origins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

/** Reads an on/off setting, which the environment supplies as text. */
export const isEnabled = (setting: string) => setting.toLowerCase() === TRUE_TEXT;
