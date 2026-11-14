import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Regroups plants by stream of the value chain (upstream, midstream, downstream), adds the
 * export terminal layout, and records whether each site is operating yet.
 *
 * Written by hand: the generated version rebuilt the enum types, which fails on existing rows.
 */
export class AddStreamsAndPlantStatus1794700000000 implements MigrationInterface {
  name = 'AddStreamsAndPlantStatus1794700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."plant_sector_enum" RENAME VALUE 'GAS' TO 'MIDSTREAM'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."plant_sector_enum" RENAME VALUE 'REFINING_AND_CHEMICALS' TO 'DOWNSTREAM'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."plant_model_enum" ADD VALUE IF NOT EXISTS 'EXPORT_TERMINAL'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."plant_status_enum" AS ENUM('OPERATING', 'UNDER_CONSTRUCTION', 'PLANNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "plant" ADD "status" "public"."plant_status_enum" NOT NULL DEFAULT 'OPERATING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plant" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."plant_status_enum"`);
    // PostgreSQL cannot remove a value from an enum type. Plants using the added layout are moved
    // to an older one, and the unused value is left in place.
    await queryRunner.query(
      `UPDATE "plant" SET "model" = 'PROCESS_PLANT' WHERE "model"::text = 'EXPORT_TERMINAL'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."plant_sector_enum" RENAME VALUE 'DOWNSTREAM' TO 'REFINING_AND_CHEMICALS'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."plant_sector_enum" RENAME VALUE 'MIDSTREAM' TO 'GAS'`,
    );
  }
}
