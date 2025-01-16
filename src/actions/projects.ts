"use server"

import { db } from "@/db/drizzle";
import { events, InsertProjectMediaSchema, InsertProjectSchema, projectMedia, projects, teams } from "@/db/schema";
import { getMyTeamForEvent } from "./teams";
import { eq, count } from "drizzle-orm";


class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

type CreateProjectResult = {
    success: true
    data: {
        event: {
            id: string
        }
    }
} | {
    success: false
    error: string
}

export async function createProject(previoudState:unknown, data: string) {

    try {
        const parsedData = JSON.parse(data);

        const validationResult = InsertProjectSchema.safeParse(parsedData);

        if (!validationResult.success) {
            throw new ValidationError("Invalid project data");
        }

        const  teamResult = await getMyTeamForEvent(validationResult.data.eventId as string);

        if (!teamResult.success) {
            throw new ValidationError(teamResult.error);
        }

        if(!validationResult.data.eventId) {
            throw new ValidationError("Event not found");
        }

        const project = {
            ...validationResult.data,
            eventId: validationResult.data.eventId,
            teamId: teamResult.data.team.id as string,
            submittedAt: new Date()
        };

        await db.transaction(async(tx)=>{

            await tx.insert(projects)
                .values(project)

            await tx.update(teams)
                .set({projectDescriptionSubmitted: true})
                .where(eq(teams.id, teamResult.data.team.id as string))

        })

        return { 
            success: true,
            data: {
                event:{
                    id: validationResult.data.eventId
                }
            }
        };


    } catch (error) {

        if (error instanceof ValidationError) {

            return { success: false, error: error.message };

        } else {

            return { success: false, error: "An unexpected error occurred" };

        }

    }

}

type ProjectsByTeamIdResult = {
    success: true
    data: {       
        project:{
            id: string,
            name: string,
            description: string,
            media?: {
                url: string
                type: string
            }[],
        },
        event:{
            id: string,
            name: string,
        }
    }
} | {
    success: false
    error: string
}
export async function getProjectByTeamId(teamId: string): Promise<ProjectsByTeamIdResult> {

    try {

        const rows = await db.select({
            project:{
                id: projects.id,
                name: projects.name,
                description: projects.description,
            },
            event:{
                id: projects.eventId,
                name: events.name
            }
        })
            .from(projects)
            .innerJoin(events, eq(events.id, projects.eventId))
            .where(eq(projects.teamId, teamId));


        if(rows.length === 0) {
            throw new ValidationError("No project submitted by team")
        }

        const projectMediaRows = await db.select({
            media: {
                url: projectMedia.mediaUrl,
                type: projectMedia.mediaType
            }
        })
            .from(projectMedia)
            .where(eq(projectMedia.projectId, rows.at(0)?.project.id as string))

        return { 
            success: true,
            data: {
                project: {
                    id: rows.at(0)?.project.id as string,
                    name: rows.at(0)?.project.name as string,
                    description: rows.at(0)?.project.description as string,
                    media: projectMediaRows.length > 0?
                        projectMediaRows.map((row)=>  ({url: row.media.url, type: row.media.type}))
                        :undefined
                },
                event: {
                    id: rows.at(0)?.event.id as string,
                    name: rows.at(0)?.event.name as string
                }
            }
        };
    
    } catch (error) {
        if (error instanceof ValidationError) {
            return { 
                success: false,
                error: error.message
            };
        } else {
            console.error("Unexpected error:", error);
            return { 
                success: false,
                error: "An unexpected error occurred"
            };
        }
    }
}

export async function getProjectsByProjectId(projectId: string) {

    try {

        const project = await db.select({
            projectId: projects.id,
            eventId: projects.eventId,
            eventName: events.name,
            projectName: projects.name,
            projectDescription: projects.description,
            projectMediaUrl: projectMedia.mediaUrl
        })
            .from(projects)
            .innerJoin(projectMedia, eq(projectMedia.projectId, projects.id))
            .innerJoin(events, eq(events.id, projects.eventId))
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

type ProjectMediaResult = {
    success: true
    data: {
        project: {
            id: string
        }
    }
} | {
    success: false,
    error: string
}

export async function createProjectMedia(data: string): Promise<ProjectMediaResult> {

    try{
        const obj = JSON.parse(data);

        const {success, error, data: parsedData} = InsertProjectMediaSchema.safeParse(obj);

        if(error){
            throw new ValidationError("Invalid project media data");
        }

        const teamIdRows =  await db.select({teamId: projects.teamId})
            .from(projects)
            .where(eq(projects.id, parsedData.projectId));

        if(teamIdRows.length === 0) {
            throw new ValidationError("Invalid team information");
        }
    
        await db.transaction(async(tx)=>{

            await tx.insert(projectMedia)
                .values(parsedData)
                .returning({ id: projectMedia.id });

            await tx.update(teams)
                .set({projectMediaSubmitted: true})
                .where(eq(teams.id, teamIdRows.at(0)?.teamId as string))
        })
        

        return {success: true, data: {project: {id: parsedData?.id as string}} }

    }catch(error){
        if (error instanceof ValidationError) {
            return { success: false, error: error.message};
        } else {
            return { success: false, error: "An unexpected error occurred" };
        }
    }
}

type NumberOfProjectsResult = {
    success: true
    data: {
        projects: {
            count: number
        }
    }
} | {
    success: false
    error: string
}

export async function numberOfProjects() {
    try{
        const rows = await db.select({count: count()}).from(projects);

        return {
            success: true,
            data: {
                projects: {
                    count: rows.at(0)?.count as number
                }
            }
        }
    }catch(err) {
        return {
            success: false,
            error: "An unexpected error occured"
        }
    }
}