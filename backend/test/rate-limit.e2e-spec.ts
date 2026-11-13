import { Role } from '../src/common/enums/role.enum.js';
import { api, createTestApp, resetFixtures, TEST_EMAIL, type TestApp } from './support/test-app.js';

const ALLOWED_ATTEMPTS = 3;

describe('Rate limiting', () => {
  let app: TestApp;

  beforeAll(async () => {
    // Read when the app module is first imported, which the helper does on demand.
    process.env.AUTH_RATE_LIMIT = String(ALLOWED_ATTEMPTS);
    app = await createTestApp();
    await resetFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('limits sign-in attempts more strictly than other routes', async () => {
    const attempt = () =>
      api(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL[Role.VIEWER], password: 'wrong password' });

    for (let count = 0; count < ALLOWED_ATTEMPTS; count += 1) {
      expect((await attempt()).status).toBe(401);
    }
    expect((await attempt()).status).toBe(429);

    // Ordinary routes are counted separately, so they still answer.
    expect((await api(app).get('/api/plants')).status).toBe(401);
  });
});
