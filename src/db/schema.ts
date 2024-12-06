import { integer, text, pgTable, varchar, uuid, timestamp, serial, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const events = pgTable("events",{
    id: uuid("id").primaryKey().defaultRandom(),
    eventName: varchar("eventName").notNull(),
    lastDateOfRegistration: timestamp("lastDateOfRegistration").notNull(),
    lastDateOfProjectSubmission: timestamp("lastDateOfProjectSubmission").notNull(),
    requirements: text("requirements").notNull()
});

export const actionLogs = pgTable("actionLogs", {
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
    eventId: uuid("eventId").notNull().references(()=> events.id, {onDelete:'cascade'})
});

export const students = pgTable("students", {
    id: varchar("id").notNull().primaryKey(), 
    email: varchar("email").notNull(),
    name: varchar("name").notNull(), 
},(table) =>{
    return {
      emailIdx: uniqueIndex("emailIdx").on(table.email)
    };
});

export const teamMembers = pgTable("teamMembers",{
    teamId: uuid("teamId").references(()=> teams.id, {onDelete:'cascade'}).notNull(),
    memberId: varchar("memberId").references(()=> students.id, {onDelete:'cascade'}).notNull(),
});

export const InsertStudentSchema = createInsertSchema(students,{
    id: (schema) => schema.id.min(7).max(10).regex(/^\d+$/, "ID must contain only digits"),
    email: (schema) => schema.email.email()
})

export const TeamSchema = z.object({
    eventId: z.string().uuid(),
    teamName: z.string().min(3).max(20),
    members: z.array(InsertStudentSchema).min(1).max(6)
})

export const InsertEventSchema = createInsertSchema(events);

export type InsertEventSchema = z.infer<typeof InsertEventSchema>

export const InsertActionLog = createInsertSchema(actionLogs);

export type InsertActionLog = z.infer<typeof InsertActionLog>

export type InsertStudentSchema = z.infer<typeof InsertStudentSchema>

export type TeamSchema = z.infer<typeof TeamSchema>
  




