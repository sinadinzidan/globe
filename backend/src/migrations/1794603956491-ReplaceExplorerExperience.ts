import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceExplorerExperience1794603956491 implements MigrationInterface {
  name = 'ReplaceExplorerExperience1794603956491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_e1f9c70e8aa9fea8b6d3f4cdc6"`);
    await queryRunner.query(
      `ALTER TABLE "explorer_progress" RENAME COLUMN "experience" TO "unlocked_achievement_count"`,
    );
    // The old values were experience points, which mean nothing as a count. Each row is
    // recalculated the next time its user explores something.
    await queryRunner.query(`UPDATE "explorer_progress" SET "unlocked_achievement_count" = 0`);
    await queryRunner.query(
      `CREATE INDEX "IDX_09d59377c2ed36c839f51ded64" ON "explorer_progress"  ("unlocked_achievement_count") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_09d59377c2ed36c839f51ded64"`);
    await queryRunner.query(
      `ALTER TABLE "explorer_progress" RENAME COLUMN "unlocked_achievement_count" TO "experience"`,
    );
    await queryRunner.query(`UPDATE "explorer_progress" SET "experience" = 0`);
    await queryRunner.query(
      `CREATE INDEX "IDX_e1f9c70e8aa9fea8b6d3f4cdc6" ON "explorer_progress" USING btree ("experience") `,
    );
  }
}
