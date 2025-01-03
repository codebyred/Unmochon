CREATE TYPE "public"."designation" AS ENUM('Assistant Professor', 'Associate Professor', 'Professor', 'lecuturer');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "action_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"additional_info" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teamId" uuid NOT NULL,
	"evaluator_id" uuid NOT NULL,
	"presentation_score" integer NOT NULL,
	"outcome_score" integer NOT NULL,
	"technology_score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"registration_deadline" timestamp NOT NULL,
	"project_submission_deadline" timestamp NOT NULL,
	"requirements" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faculty" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"department" varchar NOT NULL,
	"designation" "designation" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"media_url" varchar NOT NULL,
	"media_type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"team_id" uuid NOT NULL,
	"member_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"event_id" uuid NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"evaluated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluator_id_faculty_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_id_students_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "faculty_email_idx" ON "faculty" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "student_email_idx" ON "students" USING btree ("email");