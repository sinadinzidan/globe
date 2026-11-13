import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1794602595605 implements MigrationInterface {
  name = 'CreateInitialSchema1794602595605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."plant_sector_enum" AS ENUM('OIL_GAS_AND_CHEMICALS', 'POWER_AND_WATER', 'METALS', 'CLEAN_ENERGY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."plant_emirate_enum" AS ENUM('ABU_DHABI', 'DUBAI', 'SHARJAH', 'AJMAN', 'UMM_AL_QUWAIN', 'RAS_AL_KHAIMAH', 'FUJAIRAH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."plant_model_enum" AS ENUM('PROCESS_PLANT', 'POWER_AND_WATER_PLANT', 'METALS_PLANT', 'SOLAR_PARK', 'NUCLEAR_PLANT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "plant" ("id" character varying(64) NOT NULL, "name" character varying(200) NOT NULL, "operator" character varying(200) NOT NULL, "sector" "public"."plant_sector_enum" NOT NULL, "emirate" "public"."plant_emirate_enum" NOT NULL, "longitude" double precision NOT NULL, "latitude" double precision NOT NULL, "description" text NOT NULL, "model" "public"."plant_model_enum" NOT NULL, "scenery" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_97e1eb0d045aadea59401ece5ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."asset_type_enum" AS ENUM('STORAGE_TANK', 'SPHERE_TANK', 'PUMP', 'COMPRESSOR', 'HEAT_EXCHANGER', 'FURNACE', 'COLUMN', 'STACK', 'TURBINE', 'GENERATOR', 'BOILER', 'TRANSFORMER', 'DESALINATION_UNIT', 'PROCESS_HALL', 'SILO', 'SOLAR_ARRAY', 'INVERTER', 'REACTOR_BUILDING')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."asset_status_enum" AS ENUM('RUNNING', 'STANDBY', 'UNDER_MAINTENANCE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."asset_criticality_enum" AS ENUM('HIGH', 'MEDIUM', 'LOW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "plant_id" character varying(64) NOT NULL, "code" character varying(32) NOT NULL, "tag" character varying(32) NOT NULL, "name" character varying(200) NOT NULL, "type" "public"."asset_type_enum" NOT NULL, "area" character varying(120) NOT NULL, "status" "public"."asset_status_enum" NOT NULL, "criticality" "public"."asset_criticality_enum" NOT NULL, "description" text NOT NULL, "position_east" double precision NOT NULL, "position_south" double precision NOT NULL, "rotation" double precision NOT NULL DEFAULT '0', "scale" double precision NOT NULL DEFAULT '1', "specifications" jsonb NOT NULL DEFAULT '[]', "indicators" jsonb NOT NULL DEFAULT '[]', "trends" jsonb NOT NULL DEFAULT '[]', "inspections" jsonb NOT NULL DEFAULT '[]', "documents" jsonb NOT NULL DEFAULT '[]', "connections" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_780c39d7a1a34e71259cfdc962b" UNIQUE ("plant_id", "code"), CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4db657961ced65076bdd62333f" ON "asset"  ("plant_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMINISTRATOR', 'PLANT_MANAGER', 'RELIABILITY_ENGINEER', 'MAINTENANCE_PLANNER', 'INSPECTOR', 'OPERATOR', 'VIEWER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying(320) NOT NULL, "full_name" character varying(200) NOT NULL, "password_hash" text NOT NULL, "role" "public"."user_role_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "failed_login_count" integer NOT NULL DEFAULT '0', "locked_until" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_session" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "user_agent" character varying(400), "ip_address" character varying(64), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_19354ed146424a728c1112a8cbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8783d517fab10672700a39cb4" ON "auth_session"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" character varying(128) NOT NULL, "family_id" character varying(128) NOT NULL, "user_id" uuid NOT NULL, "session_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "family_expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "claims" jsonb, "is_revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb31f2a7917404a46e17f539f1" ON "refresh_token"  ("family_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bbe63d2fe75e7f0ba1710351d" ON "refresh_token"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7643a722ca45fb721be1c63dc0" ON "refresh_token"  ("session_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_392b6e406902d7e3c7dea07806" ON "refresh_token"  ("family_expires_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_order_type_enum" AS ENUM('PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_order_status_enum" AS ENUM('OPEN', 'PLANNED', 'IN_PROGRESS', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "work_order" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "number" character varying(32) NOT NULL, "asset_id" uuid NOT NULL, "title" character varying(200) NOT NULL, "type" "public"."work_order_type_enum" NOT NULL, "status" "public"."work_order_status_enum" NOT NULL DEFAULT 'OPEN', "due_date" date, "completed_at" TIMESTAMP WITH TIME ZONE, "created_by_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_cfc0c3c12cc31a84d49a7769ad9" UNIQUE ("number"), CONSTRAINT "PK_0730e63dd523d397530859cb6d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_241e0edfe92c4eb60a9d5b9d9b" ON "work_order"  ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_77960ce169a3d8de7739c5e0e8" ON "work_order"  ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_123ed4575427ea4b6d7e4f6fa0" ON "work_order"  ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_plant" ("user_id" uuid NOT NULL, "plant_id" character varying(64) NOT NULL, CONSTRAINT "PK_45f195c78cf068d6198c40d8a39" PRIMARY KEY ("user_id", "plant_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9bd3f2baf8decd753f5044fae" ON "user_plant"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9d54a1748a5670f9800282540" ON "user_plant"  ("plant_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_4db657961ced65076bdd62333ff" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_session" ADD CONSTRAINT "FK_b8783d517fab10672700a39cb49" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_7643a722ca45fb721be1c63dc0c" FOREIGN KEY ("session_id") REFERENCES "auth_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_order" ADD CONSTRAINT "FK_241e0edfe92c4eb60a9d5b9d9bd" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_order" ADD CONSTRAINT "FK_123ed4575427ea4b6d7e4f6fa07" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plant" ADD CONSTRAINT "FK_c9bd3f2baf8decd753f5044fae0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plant" ADD CONSTRAINT "FK_d9d54a1748a5670f98002825406" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plant" DROP CONSTRAINT "FK_d9d54a1748a5670f98002825406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plant" DROP CONSTRAINT "FK_c9bd3f2baf8decd753f5044fae0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_order" DROP CONSTRAINT "FK_123ed4575427ea4b6d7e4f6fa07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_order" DROP CONSTRAINT "FK_241e0edfe92c4eb60a9d5b9d9bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7643a722ca45fb721be1c63dc0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_session" DROP CONSTRAINT "FK_b8783d517fab10672700a39cb49"`,
    );
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_4db657961ced65076bdd62333ff"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d9d54a1748a5670f9800282540"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c9bd3f2baf8decd753f5044fae"`);
    await queryRunner.query(`DROP TABLE "user_plant"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_123ed4575427ea4b6d7e4f6fa0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_77960ce169a3d8de7739c5e0e8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_241e0edfe92c4eb60a9d5b9d9b"`);
    await queryRunner.query(`DROP TABLE "work_order"`);
    await queryRunner.query(`DROP TYPE "public"."work_order_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."work_order_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_392b6e406902d7e3c7dea07806"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7643a722ca45fb721be1c63dc0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6bbe63d2fe75e7f0ba1710351d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eb31f2a7917404a46e17f539f1"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b8783d517fab10672700a39cb4"`);
    await queryRunner.query(`DROP TABLE "auth_session"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4db657961ced65076bdd62333f"`);
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`DROP TYPE "public"."asset_criticality_enum"`);
    await queryRunner.query(`DROP TYPE "public"."asset_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."asset_type_enum"`);
    await queryRunner.query(`DROP TABLE "plant"`);
    await queryRunner.query(`DROP TYPE "public"."plant_model_enum"`);
    await queryRunner.query(`DROP TYPE "public"."plant_emirate_enum"`);
    await queryRunner.query(`DROP TYPE "public"."plant_sector_enum"`);
  }
}
