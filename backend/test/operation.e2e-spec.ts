import { Role } from '../src/common/enums/role.enum.js';
import { PlantSector } from '../src/plant/enums/plant-sector.enum.js';
import {
  api,
  ASSIGNED_PLANT_ID,
  ASSET_CODE,
  createTestApp,
  resetFixtures,
  signIn,
  type TestApp,
} from './support/test-app.js';

interface Summary {
  streams: {
    sector: PlantSector;
    plantCount: number;
    assetCount: number;
    runningAssetCount: number;
    openWorkOrderCount: number;
  }[];
  attention: unknown[];
  hasWorkOrderCounts: boolean;
}

const SUMMARY = '/api/operations/summary';

describe('Operations summary', () => {
  let app: TestApp;

  const summaryFor = async (role: Role) => {
    const { cookies } = await signIn(app, role);
    const response = await api(app).get(SUMMARY).set('Cookie', cookies);
    expect(response.status).toBe(200);
    return response.body as Summary;
  };

  const midstream = (summary: Summary) =>
    summary.streams.find((stream) => stream.sector === PlantSector.MIDSTREAM);

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetFixtures(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('refuses a request without a session', async () => {
    expect((await api(app).get(SUMMARY)).status).toBe(401);
  });

  it('reports every stream in order, upstream first', async () => {
    const summary = await summaryFor(Role.ADMINISTRATOR);
    expect(summary.streams.map((stream) => stream.sector)).toEqual([
      PlantSector.UPSTREAM,
      PlantSector.MIDSTREAM,
      PlantSector.DOWNSTREAM,
    ]);
  });

  it('counts only the plants the user can reach', async () => {
    expect(midstream(await summaryFor(Role.RELIABILITY_ENGINEER))).toMatchObject({
      plantCount: 2,
      assetCount: 2,
      runningAssetCount: 2,
    });
    expect(midstream(await summaryFor(Role.OPERATOR))).toMatchObject({
      plantCount: 1,
      assetCount: 1,
      runningAssetCount: 1,
    });
  });

  it('counts open work orders only for roles that may see work orders', async () => {
    const planner = await signIn(app, Role.MAINTENANCE_PLANNER);
    const created = await api(app)
      .post(`/api/plants/${ASSIGNED_PLANT_ID}/assets/${ASSET_CODE}/work-orders`)
      .set('Cookie', planner.cookies)
      .send({ title: 'Check the seal', type: 'CORRECTIVE' });
    expect(created.status).toBe(201);

    const operatorSummary = await summaryFor(Role.OPERATOR);
    expect(operatorSummary.hasWorkOrderCounts).toBe(true);
    expect(midstream(operatorSummary)?.openWorkOrderCount).toBe(1);

    const viewerSummary = await summaryFor(Role.VIEWER);
    expect(viewerSummary.hasWorkOrderCounts).toBe(false);
    expect(midstream(viewerSummary)?.openWorkOrderCount).toBe(0);
  });
});
