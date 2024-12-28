"use server"

import { db } from "@/db/drizzle";
import { InsertProjectMediaSchema, InsertProjectSchema, projectMedia, projects } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { getTeamId } from "./teams";
import { eq, and } from "drizzle-orm";

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

        const  {error, result} = await getTeamId(parseResult.data.eventId as string);

        if (error) {
            throw new ValidationError(error);
        }

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
            projectId: insertedProject[0].id
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

export async function getProjectsByTeamId(teamId: string) {

    try {

        const project = await db.select()
            .from(projects)
            .where(eq(projects.teamId, teamId));

        return { error: null, result: project as InsertProjectSchema[] };
    
    } catch (error) {
        if (error instanceof ValidationError) {
            return { error: error.message, result: null };
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred", result: null };
        }
    }
}

export async function getProjectsByProjectId(projectId: string) {

    try {

        const project = await db.select({
            projectId: projects.id,
            projectName: projects.name,
            projectDescription: projects.description,
            projectMediaUrl: projectMedia.mediaUrl
        })
            .from(projects)
            .innerJoin(projectMedia, eq(projectMedia.projectId, projects.id))
            .where(eq(projects.id, projectId));

        return { 
            error: null, 
            result: project 
        };

    } catch (error) {
        if (error instanceof ValidationError) {
            return { 
                error: error.message, 
                result: [] 
            };
        } else {
            console.error("Unexpected error:", error);
            return { 
                error: "An unexpected error occurred", 
                result: [] 
            };
        }
    }
}

export async function createProjectMedia(data: string) {

    try{
        const obj = JSON.parse(data);

        const parseResult = InsertProjectMediaSchema.safeParse(obj);

        if(parseResult.error){
            throw new ValidationError("Invalid project media data");
        }
    
        const result = await db.insert(projectMedia).values(parseResult.data).returning({ id: projectMedia.id });

        return {error: null, result}
    }catch(error){
        if (error instanceof ValidationError) {
            return { error: error.message, result: null };
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred",result: null };
        }
    }


}