import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773271853568 implements MigrationInterface {
    name = 'InitialSchema1773271853568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "mentor_connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "mentor_id" character varying(120) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ce7b7ce433618e22342ea9fae27" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "videos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "video_url" character varying(500) NOT NULL, "thumbnail_url" character varying(500), "category" character varying(100) NOT NULL, "duration_seconds" integer NOT NULL DEFAULT '0', "order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "needs_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "needs" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d181c4dd2166613a4f41d354c33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "sector_selections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "sectors" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1537dc8cff87dc5385f6eabd5cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "entrepreneurship_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "skills" jsonb NOT NULL, "ratings" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7b32ccd994c8cd174fb2d0e6d64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "business_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "project_name" character varying(200) NOT NULL, "description" text NOT NULL, "value_proposition" text NOT NULL, "target_customers" text NOT NULL, "costs" text NOT NULL, "first_steps" text NOT NULL, "sector" character varying(40), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_461167914444abdd6e3aa36ea2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "pitches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "project_name" character varying(255) NOT NULL, "pitch_text" text NOT NULL, "sector" character varying(60), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c0ab1fa10a5750d17b935c60854" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "entrepreneurship_barriers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "barriers" jsonb NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d303a7c6c1f5c96f89e752ecf8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "support_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "preferences" jsonb NOT NULL, "details" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9b09b0b067ea2baf9236233342" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "communication_trainings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(120) NOT NULL, "skills" jsonb NOT NULL, "ratings" jsonb, "completedModules" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_71234c0a5de80c0aafd5e6df01f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "questionnaire_answers" ADD COLUMN IF NOT EXISTS "interest_categories" jsonb`);
        await queryRunner.query(`ALTER TABLE "questionnaire_answers" ADD COLUMN IF NOT EXISTS "soft_skills_answers" jsonb`);
        await queryRunner.query(`ALTER TABLE "opportunities" ADD COLUMN IF NOT EXISTS "description" text`);
        await queryRunner.query(`ALTER TABLE "opportunities" ADD COLUMN IF NOT EXISTS "required_skills" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "opportunities" ADD COLUMN IF NOT EXISTS "suitable_for_needs" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "answers" jsonb`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "feedback" jsonb`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "score" integer`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "status" character varying(20) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" ALTER COLUMN "scheduled_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview_sessions" ALTER COLUMN "scheduled_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" DROP COLUMN "feedback"`);
        await queryRunner.query(`ALTER TABLE "interview_sessions" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "opportunities" DROP COLUMN "suitable_for_needs"`);
        await queryRunner.query(`ALTER TABLE "opportunities" DROP COLUMN "required_skills"`);
        await queryRunner.query(`ALTER TABLE "opportunities" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "questionnaire_answers" DROP COLUMN "soft_skills_answers"`);
        await queryRunner.query(`ALTER TABLE "questionnaire_answers" DROP COLUMN "interest_categories"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_expires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token"`);
        await queryRunner.query(`DROP TABLE "communication_trainings"`);
        await queryRunner.query(`DROP TABLE "support_preferences"`);
        await queryRunner.query(`DROP TABLE "entrepreneurship_barriers"`);
        await queryRunner.query(`DROP TABLE "pitches"`);
        await queryRunner.query(`DROP TABLE "business_plans"`);
        await queryRunner.query(`DROP TABLE "entrepreneurship_skills"`);
        await queryRunner.query(`DROP TABLE "sector_selections"`);
        await queryRunner.query(`DROP TABLE "needs_assessments"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`DROP TABLE "mentor_connections"`);
    }

}
