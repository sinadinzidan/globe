import { EXPERIENCE } from '../src/explorer/constants/explorer.constant.js';
import { AchievementId } from '../src/explorer/enums/achievement-id.enum.js';
import { Role } from '../src/common/enums/role.enum.js';
import {
  api,
  ASSET_CODE,
  ASSIGNED_PLANT_ID,
  createTestApp,
  OTHER_PLANT_ID,
  resetFixtures,
  signIn,
  type SignedIn,
  type TestApp,
} from './support/test-app.js';

interface Progress {
  discoveredPlantIds: string[];
  inspectedAssetKeys: string[];
  experience: number;
  totalCount: number;
  achievements: { id: AchievementId; isUnlocked: boolean }[];
}

const PROGRESS = '/api/explorer/progress';

describe('Explorer progress', () => {
  let app: TestApp;
  let operator: SignedIn;
  let engineer: SignedIn;

  const unlocked = (progress: Progress) =>
    progress.achievements
      .filter((achievement) => achievement.isUnlocked)
      .map((achievement) => achievement.id);

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetFixtures(app);
    operator = await signIn(app, Role.OPERATOR);
    engineer = await signIn(app, Role.RELIABILITY_ENGINEER);
  });

  afterAll(async () => {
    await app.close();
  });

  it('starts empty and counts only the plants the user can reach', async () => {
    const response = await api(app).get(PROGRESS).set('Cookie', operator.cookies);
    const progress = response.body as Progress;
    expect(response.status).toBe(200);
    expect(progress.experience).toBe(0);
    expect(progress.totalCount).toBe(1);
  });

  it('earns experience for a plant once, however often it is opened', async () => {
    const discover = () =>
      api(app).post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}`).set('Cookie', operator.cookies);
    const first = (await discover()).body as Progress;
    const second = (await discover()).body as Progress;

    expect(first.discoveredPlantIds).toEqual([ASSIGNED_PLANT_ID]);
    expect(unlocked(first)).toEqual(
      expect.arrayContaining([AchievementId.FIRST_DISCOVERY, AchievementId.FULL_SURVEY]),
    );
    expect(first.experience).toBeGreaterThanOrEqual(
      EXPERIENCE.PLANT_DISCOVERED + EXPERIENCE.ACHIEVEMENT_UNLOCKED,
    );
    expect(second.experience).toBe(first.experience);
  });

  it('inspecting an asset also discovers its plant', async () => {
    const response = await api(app)
      .post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}/assets/${ASSET_CODE}`)
      .set('Cookie', operator.cookies);
    const progress = response.body as Progress;

    expect(progress.inspectedAssetKeys).toEqual([`${ASSIGNED_PLANT_ID}/${ASSET_CODE}`]);
    expect(progress.discoveredPlantIds).toEqual([ASSIGNED_PLANT_ID]);
    expect(unlocked(progress)).toEqual(
      expect.arrayContaining([AchievementId.FIRST_INSPECTION, AchievementId.PLANT_SURVEYED]),
    );
  });

  it('refuses discoveries in plants the user cannot reach, and unknown assets', async () => {
    const outOfScope = await api(app)
      .post(`/api/explorer/plants/${OTHER_PLANT_ID}`)
      .set('Cookie', operator.cookies);
    const unknownAsset = await api(app)
      .post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}/assets/no-such-asset`)
      .set('Cookie', operator.cookies);
    expect(outOfScope.status).toBe(404);
    expect(unknownAsset.status).toBe(404);
    expect(
      ((await api(app).get(PROGRESS).set('Cookie', operator.cookies)).body as Progress).experience,
    ).toBe(0);
  });

  it('keeps simultaneous discoveries from overwriting each other', async () => {
    await Promise.all(
      [ASSIGNED_PLANT_ID, OTHER_PLANT_ID].map((plantId) =>
        api(app).post(`/api/explorer/plants/${plantId}`).set('Cookie', engineer.cookies),
      ),
    );
    const progress = (await api(app).get(PROGRESS).set('Cookie', engineer.cookies))
      .body as Progress;
    expect([...progress.discoveredPlantIds].sort()).toEqual([ASSIGNED_PLANT_ID, OTHER_PLANT_ID]);
  });

  it('keeps each user’s progress to themselves, and lets them reset only their own', async () => {
    await api(app)
      .post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}`)
      .set('Cookie', operator.cookies);
    await api(app).post(`/api/explorer/plants/${OTHER_PLANT_ID}`).set('Cookie', engineer.cookies);

    const reset = await api(app).delete(PROGRESS).set('Cookie', operator.cookies);
    expect((reset.body as Progress).experience).toBe(0);
    const other = (await api(app).get(PROGRESS).set('Cookie', engineer.cookies)).body as Progress;
    expect(other.discoveredPlantIds).toEqual([OTHER_PLANT_ID]);
  });

  it('ranks explorers on the leaderboard by experience, showing names and standing only', async () => {
    await api(app)
      .post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}`)
      .set('Cookie', operator.cookies);
    await api(app)
      .post(`/api/explorer/plants/${ASSIGNED_PLANT_ID}`)
      .set('Cookie', engineer.cookies);
    await api(app).post(`/api/explorer/globe`).set('Cookie', engineer.cookies);

    const response = await api(app)
      .get('/api/explorer/leaderboard')
      .set('Cookie', operator.cookies);
    const board = response.body as {
      fullName: string;
      experience: number;
      isCurrentUser: boolean;
    }[];
    expect(board).toHaveLength(2);
    expect(board[0].experience).toBeGreaterThanOrEqual(board[1].experience);
    expect(board.filter((entry) => entry.isCurrentUser)).toHaveLength(1);
    expect(JSON.stringify(board)).not.toContain('@');
  });
});
