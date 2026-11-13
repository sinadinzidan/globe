import { ROLE_PERMISSIONS } from '../src/common/constants/role-permission.constant.js';
import { COOKIE_AUTH_SCHEME } from '../src/common/constants/api.constant.js';
import { Permission } from '../src/common/enums/permission.enum.js';
import { Role } from '../src/common/enums/role.enum.js';
import { buildOpenApiDocument } from '../src/app.setup.js';
import {
  api,
  ASSET_CODE,
  ASSIGNED_PLANT_ID,
  createTestApp,
  OTHER_PLANT_ID,
  resetFixtures,
  signIn,
  TEST_EMAIL,
  TEST_PASSWORD,
  type SignedIn,
  type TestApp,
} from './support/test-app.js';

const PUBLIC_OPERATIONS = ['post /api/auth/login', 'post /api/auth/refresh'];
const UNKNOWN_UUID = '00000000-0000-4000-8000-000000000000';
const assetPath = (plantId: string, suffix = '') =>
  `/api/plants/${plantId}/assets/${ASSET_CODE}${suffix}`;

describe('Authorization', () => {
  let app: TestApp;
  const sessions = {} as Record<Role, SignedIn>;

  const as = (role: Role) => ({
    get: (path: string) => api(app).get(path).set('Cookie', sessions[role].cookies),
    post: (path: string) => api(app).post(path).set('Cookie', sessions[role].cookies),
    patch: (path: string) => api(app).patch(path).set('Cookie', sessions[role].cookies),
  });

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetFixtures(app);
    for (const role of Object.values(Role)) {
      sessions[role] = await signIn(app, role);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('deny by default', () => {
    it('answers 401 on every documented route except the two public ones', async () => {
      const document = buildOpenApiDocument(app);
      const operations = Object.entries(document.paths).flatMap(([path, methods]) =>
        Object.keys(methods).map((method) => ({
          method,
          path: path.replaceAll(/\{\w+\}/g, UNKNOWN_UUID),
        })),
      );
      expect(operations.length).toBeGreaterThan(PUBLIC_OPERATIONS.length);

      for (const { method, path } of operations) {
        if (PUBLIC_OPERATIONS.includes(`${method} ${path}`)) {
          continue;
        }
        const client = api(app) as unknown as Record<
          string,
          (path: string) => Promise<{ status: number }>
        >;
        const response = await client[method](path);
        expect(response.status, `${method} ${path}`).toBe(401);
      }
    });

    it('documents the cookie scheme and the 401 and 403 answers on every protected route', () => {
      const document = buildOpenApiDocument(app);
      for (const [path, methods] of Object.entries(document.paths)) {
        for (const [method, operation] of Object.entries(methods as Record<string, never>)) {
          const documented = operation as {
            security?: object[];
            responses: Record<string, unknown>;
            summary?: string;
          };
          expect(documented.summary, `${method} ${path}`).toBeTruthy();
          if (PUBLIC_OPERATIONS.includes(`${method} ${path}`)) {
            expect(documented.security ?? []).toHaveLength(0);
            continue;
          }
          expect(documented.security, `${method} ${path}`).toEqual([{ [COOKIE_AUTH_SCHEME]: [] }]);
          expect(Object.keys(documented.responses), `${method} ${path}`).toEqual(
            expect.arrayContaining(['401', '403']),
          );
        }
      }
    });
  });

  describe('permissions', () => {
    it('reports each role its own permissions', async () => {
      for (const role of Object.values(Role)) {
        const me = await as(role).get('/api/auth/me');
        expect((me.body as { permissions: Permission[] }).permissions).toEqual([
          ...ROLE_PERMISSIONS[role],
        ]);
      }
    });

    it.each([
      ['/api/users', Permission.USER_READ],
      ['/api/roles', Permission.ROLE_READ],
      [assetPath(ASSIGNED_PLANT_ID, '/trends'), Permission.ASSET_PERFORMANCE_READ],
      [assetPath(ASSIGNED_PLANT_ID, '/inspections'), Permission.ASSET_INSPECTION_READ],
      [assetPath(ASSIGNED_PLANT_ID, '/documents'), Permission.ASSET_DOCUMENT_READ],
      [assetPath(ASSIGNED_PLANT_ID, '/work-orders'), Permission.WORK_ORDER_READ],
    ])('%s answers 200 with %s and 403 without it', async (path, permission) => {
      for (const role of Object.values(Role)) {
        const response = await as(role).get(path);
        expect(response.status, role).toBe(ROLE_PERMISSIONS[role].includes(permission) ? 200 : 403);
      }
    });

    it('lets only roles with WORK_ORDER_CREATE raise a work order', async () => {
      for (const role of Object.values(Role)) {
        const response = await as(role)
          .post(assetPath(ASSIGNED_PLANT_ID, '/work-orders'))
          .send({ title: 'Check the seal', type: 'CORRECTIVE' });
        expect(response.status, role).toBe(
          ROLE_PERMISSIONS[role].includes(Permission.WORK_ORDER_CREATE) ? 201 : 403,
        );
      }
    });

    it('lets only an administrator manage users, and never returns a password hash', async () => {
      const newUser = {
        email: 'new@test.example',
        fullName: 'New User',
        role: Role.VIEWER,
        password: TEST_PASSWORD,
      };
      expect((await as(Role.PLANT_MANAGER).post('/api/users').send(newUser)).status).toBe(403);

      const created = await as(Role.ADMINISTRATOR).post('/api/users').send(newUser);
      expect(created.status).toBe(201);
      expect(JSON.stringify(created.body)).not.toContain('argon2');
      expect(created.body).not.toHaveProperty('passwordHash');

      const listed = await as(Role.ADMINISTRATOR).get('/api/users');
      expect(JSON.stringify(listed.body)).not.toContain('passwordHash');
      expect((await as(Role.ADMINISTRATOR).post('/api/users').send(newUser)).status).toBe(409);
    });

    it('rejects fields the API does not define', async () => {
      const response = await as(Role.ADMINISTRATOR).post('/api/users').send({
        email: 'x@test.example',
        fullName: 'X',
        role: Role.VIEWER,
        password: TEST_PASSWORD,
        isAdministrator: true,
      });
      expect(response.status).toBe(400);
    });
  });

  describe('object-level access', () => {
    it('shows roles without PLANT_READ_ALL only their assigned plants', async () => {
      const scoped = await as(Role.MAINTENANCE_PLANNER).get('/api/plants');
      expect((scoped.body as { id: string }[]).map((plant) => plant.id)).toEqual([
        ASSIGNED_PLANT_ID,
      ]);

      const everything = await as(Role.RELIABILITY_ENGINEER).get('/api/plants');
      expect(everything.body).toHaveLength(2);
    });

    it('reports a plant outside the user’s scope exactly like one that does not exist', async () => {
      const outOfScope = await as(Role.MAINTENANCE_PLANNER).get(`/api/plants/${OTHER_PLANT_ID}`);
      const missing = await as(Role.MAINTENANCE_PLANNER).get('/api/plants/no-such-plant');
      expect(outOfScope.status).toBe(404);
      expect(outOfScope.body).toEqual(missing.body);

      expect((await as(Role.MAINTENANCE_PLANNER).get(assetPath(OTHER_PLANT_ID))).status).toBe(404);
      expect(
        (await as(Role.MAINTENANCE_PLANNER).get(assetPath(OTHER_PLANT_ID, '/work-orders'))).status,
      ).toBe(404);
      expect((await as(Role.ADMINISTRATOR).get(assetPath(OTHER_PLANT_ID))).status).toBe(200);
    });

    it('lets a user with WORK_ORDER_UPDATE_OWN change only work orders they raised', async () => {
      const raise = (role: Role) =>
        as(role)
          .post(assetPath(ASSIGNED_PLANT_ID, '/work-orders'))
          .send({ title: 'Inspect coupling', type: 'PREVENTIVE' });
      const own = (await raise(Role.OPERATOR)).body as { id: string; canUpdate: boolean };
      const someoneElses = (await raise(Role.INSPECTOR)).body as { id: string };
      expect(own.canUpdate).toBe(true);

      const complete = { status: 'COMPLETED' };
      expect(
        (await as(Role.OPERATOR).patch(`/api/work-orders/${own.id}`).send(complete)).status,
      ).toBe(200);
      expect(
        (await as(Role.OPERATOR).patch(`/api/work-orders/${someoneElses.id}`).send(complete))
          .status,
      ).toBe(403);
      // The wider permission reaches both.
      expect(
        (
          await as(Role.MAINTENANCE_PLANNER)
            .patch(`/api/work-orders/${someoneElses.id}`)
            .send(complete)
        ).status,
      ).toBe(200);
      // No update permission at all.
      expect(
        (await as(Role.VIEWER).patch(`/api/work-orders/${own.id}`).send(complete)).status,
      ).toBe(403);
    });

    it('hides work orders of plants outside the user’s scope, even with the wider permission', async () => {
      const elsewhere = await as(Role.ADMINISTRATOR)
        .post(assetPath(OTHER_PLANT_ID, '/work-orders'))
        .send({ title: 'Elsewhere', type: 'PREVENTIVE' });
      const id = (elsewhere.body as { id: string }).id;
      const response = await as(Role.MAINTENANCE_PLANNER)
        .patch(`/api/work-orders/${id}`)
        .send({ status: 'COMPLETED' });
      expect(response.status).toBe(404);
    });

    it('stops an administrator from changing their own role or deactivating themselves', async () => {
      const me = (await as(Role.ADMINISTRATOR).get('/api/auth/me')).body as { id: string };
      expect(
        (await as(Role.ADMINISTRATOR).patch(`/api/users/${me.id}`).send({ isActive: false }))
          .status,
      ).toBe(403);
      expect(
        (await as(Role.ADMINISTRATOR).patch(`/api/users/${me.id}`).send({ role: Role.VIEWER }))
          .status,
      ).toBe(403);
      expect(
        (await as(Role.ADMINISTRATOR).patch(`/api/users/${me.id}`).send({ fullName: 'Renamed' }))
          .status,
      ).toBe(200);
    });

    it('applies a role change at once and signs the user out everywhere', async () => {
      const users = (await as(Role.ADMINISTRATOR).get('/api/users')).body as {
        items: { id: string; email: string }[];
      };
      const viewer = users.items.find((user) => user.email === TEST_EMAIL[Role.VIEWER]);

      const promoted = await as(Role.ADMINISTRATOR)
        .patch(`/api/users/${String(viewer?.id)}`)
        .send({ role: Role.OPERATOR });
      expect(promoted.status).toBe(200);
      expect((await as(Role.VIEWER).get('/api/auth/me')).status).toBe(401);

      sessions[Role.VIEWER] = await signIn(app, Role.VIEWER);
      const me = (await as(Role.VIEWER).get('/api/auth/me')).body as { role: Role };
      expect(me.role).toBe(Role.OPERATOR);
    });

    it('signs a user out everywhere when an administrator resets their password', async () => {
      const users = (await as(Role.ADMINISTRATOR).get('/api/users')).body as {
        items: { id: string; email: string }[];
      };
      const viewer = users.items.find((user) => user.email === TEST_EMAIL[Role.VIEWER]);
      const reset = await as(Role.ADMINISTRATOR)
        .post(`/api/users/${String(viewer?.id)}/reset-password`)
        .send({ password: 'an entirely new passphrase' });
      expect(reset.status).toBe(204);
      expect((await as(Role.VIEWER).get('/api/auth/me')).status).toBe(401);
      await signIn(app, Role.VIEWER, 'an entirely new passphrase');
    });
  });
});
