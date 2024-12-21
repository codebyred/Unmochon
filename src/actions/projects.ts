"use server"

import { db } from "@/db/drizzle";
import { InsertProjectSchema, projects } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { getStudentTeamId } from "./teams";

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export async function createProject(previoudState:unknown, data: string) {

    try {
        const obj = JSON.parse(data);

        const parseResult = InsertProjectSchema.safeParse(obj);

        if (!parseResult.success) {
            throw new ValidationError("Invalid project data");
        }

        const user = await currentUser();


        if (!user) {
            throw new ValidationError("Please sign in");
        }

        const  {error, result} = await getStudentTeamId(user.emailAddresses.at(0)?.emailAddress as string, parseResult.data.eventId as string);

        if(!parseResult.data.eventId) {
            throw new ValidationError("Event not found");
        }

        const project = {
            ...parseResult.data,
            eventId: parseResult.data.eventId,
            teamId: result.at(0)?.teamId as string,
            submittedAt: new Date()
        };

        const insertedProject = await db.insert(projects)
            .values(project)
            .returning({ id: projects.id });

        console.log(insertedProject)

        return { 
            message: `Project id: ${insertedProject[0].id}`
        };


    } catch (error) {

        if (error instanceof ValidationError) {

            return { error: error.message };

        } else {

            console.error("Unexpected error:", error);

            return { error: "An unexpected error occurred" };

        }

    }

}