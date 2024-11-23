CREATE TABLE IF NOT EXISTS "actionLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"actionType" text NOT NULL,
	"entityType" text NOT NULL,
	"entityId" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"additionalInfo" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventName" varchar NOT NULL,
	"lastDateOfRegistration" timestamp NOT NULL,
	"lastDateOfProjectSubmission" timestamp NOT NULL,
	"requirements" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teamMembers" (
	"teamId" uuid NOT NULL,
	"memberId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"eventId" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_memberId_students_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
