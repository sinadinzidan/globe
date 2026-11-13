import { JwtSigner } from '@nestjs/authentication';
import { DataSource } from 'typeorm';
import { SESSION_CLAIM } from '../src/auth/constants/auth.constant.js';
import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '../src/common/constants/api.constant.js';
import { Role } from '../src/common/enums/role.enum.js';
import { User } from '../src/user/entities/user.entity.js';
import {
  api,
  createTestApp,
  readCookies,
  resetFixtures,
  signIn,
  TEST_EMAIL,
  TEST_PASSWORD,
  type TestApp,
} from './support/test-app.js';

const ME = '/api/auth/me';
const LOGIN = '/api/auth/login';
const REFRESH = '/api/auth/refresh';
const NEW_PASSWORD = 'a much better passphrase 2026';

describe('Authentication', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('sign-in', () => {
    it('answers an unknown email and a wrong password identically', async () => {
      const unknownUser = await api(app)
        .post(LOGIN)
        .send({ email: 'nobody@test.example', password: TEST_PASSWORD });
      const wrongPassword = await api(app)
        .post(LOGIN)
        .send({ email: TEST_EMAIL[Role.VIEWER], password: 'not the password' });

      expect(unknownUser.status).toBe(401);
      expect(wrongPassword.status).toBe(401);
      expect(wrongPassword.body).toEqual(unknownUser.body);
      expect(wrongPassword.get('Set-Cookie')).toBeUndefined();
    });

    it('sets both tokens as HttpOnly, Secure, SameSite cookies and puts none in the body', async () => {
      const response = await api(app)
        .post(LOGIN)
        .send({ email: TEST_EMAIL[Role.VIEWER], password: TEST_PASSWORD });
      const { setCookieHeaders } = readCookies(response.get('Set-Cookie'));

      expect(response.body).toEqual({});
      expect(setCookieHeaders).toHaveLength(2);
      for (const header of setCookieHeaders) {
        expect(header).toContain('HttpOnly');
        expect(header).toContain('Secure');
        expect(header).toContain('SameSite=Strict');
      }
      expect(setCookieHeaders.find((header) => header.startsWith('globe_access='))).toContain(
        'Path=/api;',
      );
      expect(setCookieHeaders.find((header) => header.startsWith('globe_refresh='))).toContain(
        'Path=/api/auth',
      );
    });

    it('locks the account after repeated wrong passwords, with the same answer as before', async () => {
      const attempt = (password: string) =>
        api(app).post(LOGIN).send({ email: TEST_EMAIL[Role.OPERATOR], password });
      for (let count = 0; count < 5; count += 1) {
        expect((await attempt('wrong password')).status).toBe(401);
      }

      const lockedOut = await attempt(TEST_PASSWORD);
      expect(lockedOut.status).toBe(401);

      const user = await app
        .get(DataSource)
        .getRepository(User)
        .findOneByOrFail({ email: TEST_EMAIL[Role.OPERATOR] });
      expect(user.lockedUntil?.getTime()).toBeGreaterThan(Date.now());
    });

    it('refuses a deactivated user', async () => {
      await app
        .get(DataSource)
        .getRepository(User)
        .update({ email: TEST_EMAIL[Role.VIEWER] }, { isActive: false });
      const response = await api(app)
        .post(LOGIN)
        .send({ email: TEST_EMAIL[Role.VIEWER], password: TEST_PASSWORD });
      expect(response.status).toBe(401);
    });
  });

  describe('access tokens', () => {
    const buildToken = async (overrides: Partial<ConstructorParameters<typeof JwtSigner>[0]>) => {
      const session = await signIn(app, Role.VIEWER);
      const me = await api(app).get(ME).set('Cookie', session.cookies);
      const body = me.body as { id: string; sessionId: string };
      const signer = new JwtSigner({
        key: 'test-only-secret-that-is-at-least-32-bytes-long',
        issuer: 'globe-api-test',
        audience: 'globe-web-test',
        ...overrides,
      });
      return `globe_access=${signer.sign({ sub: body.id, [SESSION_CLAIM]: body.sessionId })}`;
    };

    it('accepts a token it would have issued itself', async () => {
      const response = await api(app)
        .get(ME)
        .set('Cookie', [await buildToken({})]);
      expect(response.status).toBe(200);
    });

    it.each([
      ['expired', { now: () => Date.now() - 3_600_000 }],
      ['signed with another key', { key: 'another-secret-that-is-also-32-bytes-long!!' }],
      ['from another issuer', { issuer: 'someone-else' }],
      ['for another audience', { audience: 'another-app' }],
    ])('rejects a token that is %s', async (_name, overrides) => {
      const response = await api(app)
        .get(ME)
        .set('Cookie', [await buildToken(overrides)]);
      expect(response.status).toBe(401);
    });

    it('rejects a tampered token', async () => {
      const { accessCookie } = await signIn(app, Role.VIEWER);
      const [header, payload, signature] = accessCookie.replace('globe_access=', '').split('.');
      const forgedPayload = Buffer.from(
        JSON.stringify({
          ...JSON.parse(Buffer.from(payload, 'base64url').toString()),
          sub: 'someone-else',
        }),
      ).toString('base64url');
      const response = await api(app)
        .get(ME)
        .set('Cookie', [`globe_access=${header}.${forgedPayload}.${signature}`]);
      expect(response.status).toBe(401);
    });

    it('rejects an unsigned token', async () => {
      const unsigned = [
        Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url'),
        Buffer.from(JSON.stringify({ sub: 'anyone', exp: 9_999_999_999 })).toString('base64url'),
        '',
      ].join('.');
      const response = await api(app)
        .get(ME)
        .set('Cookie', [`globe_access=${unsigned}`]);
      expect(response.status).toBe(401);
    });
  });

  describe('refresh tokens', () => {
    it('works once, and reusing it revokes the whole session', async () => {
      const first = await signIn(app, Role.VIEWER);

      const rotated = await api(app).post(REFRESH).set('Cookie', [first.refreshCookie]);
      expect(rotated.status).toBe(204);
      const second = readCookies(rotated.get('Set-Cookie'));
      expect(second.refreshCookie).not.toBe(first.refreshCookie);
      expect((await api(app).get(ME).set('Cookie', [second.accessCookie])).status).toBe(200);

      const reused = await api(app).post(REFRESH).set('Cookie', [first.refreshCookie]);
      expect(reused.status).toBe(401);

      // The thief and the owner are both signed out: the newer tokens are dead too.
      expect((await api(app).post(REFRESH).set('Cookie', [second.refreshCookie])).status).toBe(401);
      expect((await api(app).get(ME).set('Cookie', [second.accessCookie])).status).toBe(401);
    });

    it('lets only one of two simultaneous exchanges of a token succeed', async () => {
      const { refreshCookie } = await signIn(app, Role.VIEWER);
      const responses = await Promise.all([
        api(app).post(REFRESH).set('Cookie', [refreshCookie]),
        api(app).post(REFRESH).set('Cookie', [refreshCookie]),
      ]);
      expect(responses.filter((response) => response.status === 204).length).toBeLessThanOrEqual(1);
      expect(responses.some((response) => response.status === 401)).toBe(true);
    });

    it('refuses a missing or made-up refresh token', async () => {
      expect((await api(app).post(REFRESH)).status).toBe(401);
      expect((await api(app).post(REFRESH).set('Cookie', ['globe_refresh=made-up'])).status).toBe(
        401,
      );
    });
  });

  describe('sessions', () => {
    it('logout revokes the session, so its old tokens stop working', async () => {
      const session = await signIn(app, Role.VIEWER);
      const logout = await api(app).post('/api/auth/logout').set('Cookie', session.cookies);
      expect(logout.status).toBe(204);
      expect(logout.get('Set-Cookie')?.join()).toContain('globe_access=;');

      expect((await api(app).get(ME).set('Cookie', [session.accessCookie])).status).toBe(401);
      expect((await api(app).post(REFRESH).set('Cookie', [session.refreshCookie])).status).toBe(
        401,
      );
    });

    it('a password change revokes every other session and keeps this device signed in', async () => {
      const otherDevice = await signIn(app, Role.VIEWER);
      const thisDevice = await signIn(app, Role.VIEWER);

      const change = await api(app)
        .post('/api/auth/change-password')
        .set('Cookie', thisDevice.cookies)
        .send({ currentPassword: TEST_PASSWORD, newPassword: NEW_PASSWORD });
      expect(change.status).toBe(204);
      const renewed = readCookies(change.get('Set-Cookie'));

      expect((await api(app).get(ME).set('Cookie', [otherDevice.accessCookie])).status).toBe(401);
      expect((await api(app).post(REFRESH).set('Cookie', [otherDevice.refreshCookie])).status).toBe(
        401,
      );
      expect((await api(app).get(ME).set('Cookie', [thisDevice.accessCookie])).status).toBe(401);
      expect((await api(app).get(ME).set('Cookie', [renewed.accessCookie])).status).toBe(200);
      await signIn(app, Role.VIEWER, NEW_PASSWORD);
    });

    it('refuses a wrong current password and a too common new one', async () => {
      const session = await signIn(app, Role.VIEWER);
      const change = (body: object) =>
        api(app).post('/api/auth/change-password').set('Cookie', session.cookies).send(body);

      expect((await change({ currentPassword: 'wrong', newPassword: NEW_PASSWORD })).status).toBe(
        400,
      );
      expect(
        (await change({ currentPassword: TEST_PASSWORD, newPassword: 'password1234' })).status,
      ).toBe(400);
      expect((await change({ currentPassword: TEST_PASSWORD, newPassword: 'short' })).status).toBe(
        400,
      );
    });

    it('lists only your own sessions and cannot end someone else’s', async () => {
      const viewer = await signIn(app, Role.VIEWER);
      const operator = await signIn(app, Role.OPERATOR);
      const operatorSessions = await api(app)
        .get('/api/auth/sessions')
        .set('Cookie', operator.cookies);
      const [operatorSession] = operatorSessions.body as { id: string; isCurrent: boolean }[];
      expect(operatorSessions.body).toHaveLength(1);
      expect(operatorSession.isCurrent).toBe(true);

      const attempt = await api(app)
        .delete(`/api/auth/sessions/${operatorSession.id}`)
        .set('Cookie', viewer.cookies);
      expect(attempt.status).toBe(404);
      expect((await api(app).get(ME).set('Cookie', operator.cookies)).status).toBe(200);
    });
  });

  describe('cross-site request forgery', () => {
    it('refuses a state-changing request without the required header', async () => {
      const session = await signIn(app, Role.VIEWER);
      const response = await request(app).post('/api/auth/logout').set('Cookie', session.cookies);
      expect(response.status).toBe(403);
      expect((await api(app).get(ME).set('Cookie', session.cookies)).status).toBe(200);
    });

    it('refuses a state-changing request from another site, even with the header', async () => {
      const session = await signIn(app, Role.VIEWER);
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', session.cookies)
        .set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE)
        .set('Origin', 'https://evil.example')
        .set('Sec-Fetch-Site', 'cross-site');
      expect(response.status).toBe(403);
    });

    it('does not allow another origin through CORS', async () => {
      const response = await request(app)
        .options('/api/auth/logout')
        .set('Origin', 'https://evil.example')
        .set('Access-Control-Request-Method', 'POST');
      expect(response.get('Access-Control-Allow-Origin')).toBeUndefined();
    });
  });
});

// Imported last so the helper above stays the only place that adds the CSRF header.
import supertest from 'supertest';

function request(app: TestApp) {
  return supertest(app.getHttpServer());
}
