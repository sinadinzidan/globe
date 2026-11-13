import { defineConfig } from 'vitest/config';

const TEST_TIMEOUT_MILLISECONDS = 30_000;

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/support/global-setup.ts'],
    // Every file works on the same test database, so files run one after another.
    fileParallelism: false,
    testTimeout: TEST_TIMEOUT_MILLISECONDS,
    hookTimeout: TEST_TIMEOUT_MILLISECONDS,
    env: {
      NODE_ENV: 'test',
      // The tests empty this database. Point it at one that holds nothing you want to keep.
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
      JWT_SECRET: 'test-only-secret-that-is-at-least-32-bytes-long',
      JWT_ISSUER: 'globe-api-test',
      JWT_AUDIENCE: 'globe-web-test',
      WEB_ORIGINS: 'http://localhost:5173',
      COOKIE_SECURE: 'true',
      SWAGGER_ENABLED: 'false',
      AUTH_RATE_LIMIT: '1000',
    },
  },
});
