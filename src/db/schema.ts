import {boolean, integer, text, pgTable, varchar, uuid, timestamp, serial, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const events = pgTable("events",{
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    registrationDeadline: timestamp("registration_deadline").notNull(),
    projectSubmissionDeadline: timestamp("project_submission_deadline").notNull(),
    requirements: text("requirements").notNull()
});

export const actionLogs = pgTable("action_logs", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    actionType: text("action_type").notNull(),
    entityType: text("entity_type").notNull(), 
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    additionalInfo: text("additional_info"),
});

export const teams = pgTable("teams", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
    banned: boolean("banned").default(false).notNull(),
    evaluated: boolean("evaluated").default(false).notNull() 
});

export const students = pgTable("students", {
    id: varchar("id").notNull().primaryKey(), 
    email: varchar("email").notNull(),
    name: varchar("name").notNull(), 
},(table) =>{
    return {
      emailIdx: uniqueIndex("student_email_idx").on(table.email)
    };
});

export const teamMembers = pgTable("team_members",{
    teamId: uuid("team_id").references(()=> teams.id, {onDelete:'cascade'}).notNull(),
    memberId: varchar("member_id").references(()=> students.id, {onDelete:'cascade'}).notNull(),
});

export const projects = pgTable("projects",{
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id").references(()=> teams.id, {onDelete:'cascade'}).notNull(),
    eventId: uuid("event_id").references(()=> events.id, {onDelete:'cascade'}).notNull(),
    name: varchar("name").notNull(),
    description: text("description").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull()
});

export const projectMedia = pgTable("project_media",{
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(()=> projects.id, {onDelete:'cascade'}).notNull(),
    mediaUrl: varchar("media_url").notNull(),
    mediaType: varchar("media_type").notNull()
})

export const designationEnum = pgEnum("designation",["Assistant Professor", "Associate Professor", "Professor", "lecuturer"]);

export const facutly = pgTable("faculty",{  
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email").notNull(),
    name: varchar("name").notNull(),
    department: varchar("department").notNull(),
    designation: designationEnum().notNull()
},(table) =>{
    return {
      emailIdx: uniqueIndex("faculty_email_idx").on(table.email)
    };
})

export const evaluations = pgTable("evaluations", {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("teamId").references(() => teams.id, { onDelete: 'cascade' }).notNull(),
    evaluatorId: uuid("evaluator_id").notNull().references(()=> facutly.id, {onDelete: 'cascade'}),
    presentationScore: integer("presentation_score").notNull(),
    outcomeScore: integer("outcome_score").notNull(),
    technologyScore: integer("technology_score").notNull(),
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

export const InsertProjectSchema = createInsertSchema(projects,{
    teamId: (schema) => schema.teamId.optional(),
    eventId: (schema) => schema.eventId.optional(),
    name: (schema) => schema.name.min(3).max(50),
    description: (schema) => schema.description.min(10).max(4000),
});

export const InsertEvaluationSchema = createInsertSchema(evaluations, {
    teamId: (schema) => schema.teamId.optional(),
    evaluatorId: (schema) => schema.evaluatorId.optional(),
    presentationScore: z.coerce.number().min(0).max(10),
    outcomeScore: z.coerce.number().min(0).max(10),
    technologyScore: z.coerce.number().min(0).max(10)
});

export const InsertEventSchema = createInsertSchema(events);

export const InsertActionLogSchema = createInsertSchema(actionLogs);

export const InsertProjectMediaSchema = createInsertSchema(projectMedia)

export type InsertEventSchema = z.infer<typeof InsertEventSchema>

export type InsertProjectSchema = z.infer<typeof InsertProjectSchema>

export type InsertActionLogSchema = z.infer<typeof InsertActionLogSchema>

export type InsertStudentSchema = z.infer<typeof InsertStudentSchema>

export type TeamSchema = z.infer<typeof TeamSchema>

export type InsertProjectMediaSchema = z.infer<typeof InsertProjectMediaSchema>

export type InsertEvaluationSchema = z.infer<typeof InsertEvaluationSchema>





