CREATE TYPE "public"."designation" AS ENUM('Assistant Professor', 'Associate Professor', 'Professor', 'lecuturer');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faculty" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"department" varchar NOT NULL,
	"designation" "designation" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;