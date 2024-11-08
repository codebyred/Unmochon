CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventName" varchar NOT NULL,
	"lastDateOfRegistration" timestamp NOT NULL,
	"lastDateOfProjectSubmission" timestamp NOT NULL,
	"requirements" text NOT NULL
);
