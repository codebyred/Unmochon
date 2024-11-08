import { integer, text, boolean, pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events",{
    id: uuid("id").primaryKey().defaultRandom(),
    eventName: varchar("eventName").notNull(),
    lastDateOfRegistration: timestamp("lastDateOfRegistration").notNull(),
    lastDateOfProjectSubmission: timestamp("lastDateOfProjectSubmission").notNull(),
    requirements: text("requirements").notNull()
});