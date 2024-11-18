import { create } from "domain";
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

export const actionLogs = pgTable("action_logs", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    actionType: text("actionType").notNull(),
    entityType: text("entityType").notNull(), 
    entityId: uuid("entityId").notNull(), 
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    additionalInfo: text("additionalInfo"),
});

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

export const MemberSchema = z.object({
    memberName: z.string(),
    studentId: z.string().min(8).max(11).regex(/^\d+$/, "Must contain only numbers"),
    email: z.string().email(),
})

export const TeamSchema = z.object({
    teamName: z.string().min(3).max(20),
    members: z.array(MemberSchema)
})

export const InsertEventSchema = createInsertSchema(events);

export type InsertEventSchema = z.infer<typeof InsertEventSchema>

export const ActionLog = createInsertSchema(actionLogs);

export type ActionLog = z.infer<typeof ActionLog>

export type MemberSchema = z.infer<typeof MemberSchema>

export type TeamSchema = z.infer<typeof TeamSchema>
  




