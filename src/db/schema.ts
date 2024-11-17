import { integer, text, boolean, pgTable, varchar, uuid, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const events = pgTable("events",{
    id: uuid("id").primaryKey().defaultRandom(),
    eventName: varchar("eventName").notNull(),
    lastDateOfRegistration: timestamp("lastDateOfRegistration").notNull(),
    lastDateOfProjectSubmission: timestamp("lastDateOfProjectSubmission").notNull(),
    requirements: text("requirements").notNull()
});

export const Event = createInsertSchema(events);

export type Event = z.infer<typeof Event>

export const actionLogs = pgTable("action_logs", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    actionType: text("actionType").notNull(),
    entityType: text("entityType").notNull(), 
    entityId: uuid("entityId").notNull(), 
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    additionalInfo: text("additionalInfo"),
});

export const ActionLog = createInsertSchema(actionLogs);

export type ActionLog = z.infer<typeof ActionLog>

export const teams = pgTable("teams", {
    id:uuid("id").primaryKey().defaultRandom(),
    name:varchar("name").notNull(),  
    eventId: uuid("eventId").references(()=> events.id)
});


export const members = pgTable("members", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: varchar("studentId").notNull(), 
    email: varchar("email").notNull(),
    name: varchar("name").notNull(), 
});

export const teamMembers = pgTable("teamMembers",{
    id: serial("id").primaryKey(),
    teamId: uuid("teamId").references(()=> teams.id),
    memberId: uuid("id").references(()=> members.id)
});


  




