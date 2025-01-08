"use server"

import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { InsertEvaluationSchema, TeamSchema, evaluations, events, projectMedia, projects, students, teamMembers, teams } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { v4 } from 'uuid';
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';


type CreateTeamResult = {
    success: true
} | {
    success: false
    error: string
}
export async function createTeam(previouState: unknown, rawData: string): Promise<CreateTeamResult> {

    try {

        const data = JSON.parse(rawData);

        const teamData = TeamSchema.safeParse(data);

        if (!teamData.success) {
            throw new Error("Invalid Form Data")
        }

        const rows = await db.insert(teams).values({
            name: teamData.data.teamName,
            eventId: teamData.data.eventId,
        }).returning({ id: teams.id });

        const teamId = rows.at(0)?.id;

        if (!teamId) {
            throw new Error("Failed to create team");
        }

        await db.insert(teamMembers).values(teamData
            .data.members.map((member) => {
                return { teamId: teamId, memberId: member.id }
            }
            ))

        revalidatePath('/teams');

        return {
            success: true,
        }

    } catch (e: unknown) {
        return {
            success: false,
            error: (e instanceof Error) ? e.message : "An unexpected error occurred"
        }

    }


}

type Result = { teamId: string, teamName: string, eventName: string }
export async function getAllTeams() {

    try {
        const rows = await db
            .select({
                teamId: teams.id,
                teamName: teams.name,
                isBanned: teams.banned,
                isEvaluated: teams.evaluated,
                eventName: events.name,
            })
            .from(teams)
            .innerJoin(events, eq(events.id, teams.eventId));

        if (rows.length === 0) {
            throw new Error("No teams available")
        }

        return { error: null, result: rows }

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message, result: null }
        } else {
            return { error: "An unexpected error occurred", result: null }
        }
    }

}

type GetAllStudentTeamsResult = { teamId: string, teamName: string, eventName: string, isBanned: boolean }
export async function getMyTeams(email: string): Promise<{ error: string | null, result: GetAllStudentTeamsResult[] | null }> {

    try {

        const rows = await db
            .select({
                teamId: teams.id,
                teamName: teams.name,
                eventName: events.name,
                memberEmail: students.email,
                isBanned: teams.banned
            })
            .from(teams)
            .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
            .innerJoin(events, eq(teams.eventId, events.id))
            .innerJoin(students, eq(students.id, teamMembers.memberId));

        const result = rows.filter((row) => {
            return row.memberEmail === email
        }).map((row) => {
            return { teamId: row.teamId, teamName: row.teamName, eventName: row.eventName, isBanned: row.isBanned }
        })

        if (result.length === 0) {
            throw new Error("You have not registered in any event")
        }

        return { error: null, result }

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message, result: null }
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred", result: null }
        }
    }

}

export async function deleteTeam(previousState: unknown, teamId: string): Promise<{ error: string | null, result: { id: string } | null }> {

    try {

        const rows = await db.delete(teams).where(eq(teams.id, teamId)).returning({ id: teams.id })

        if (rows.length === 0) {
            throw new Error("Could not delete team");
        }

        revalidatePath('/teams');

        return { error: null, result: { id: rows.at(0)?.id as string } }

    } catch (error) {

        if (error instanceof Error) {
            return { error: error.message, result: null };
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred", result: null };
        }

    }

}


type GetTeamInfoResult = {
    success: true,
    data: {
        team: {
            name: string,
            event: {
                name: string
            },
            members: {
                name: string,
                email: string,
                id: string
            }[]
        }
    }
} | {
    success: false,
    error: string
}

export async function getTeamInfo(teamId: string): Promise<GetTeamInfoResult> {

    try {
        const rows = await db
            .select({
                teamName: teams.name,
                eventName: events.name,
                memberName: students.name,
                memberEmail: students.email,
                memberId: students.id
            })
            .from(teamMembers)
            .innerJoin(teams, eq(teams.id, teamMembers.teamId))
            .innerJoin(events, eq(events.id, teams.eventId))
            .innerJoin(students, eq(teamMembers.memberId, students.id))
            .where(eq(teamMembers.teamId, teamId));

        return {
            success: true,
            data: {
                team: {
                    name: rows.at(0)?.teamName as string,
                    event: {
                        name: rows.at(0)?.eventName as string
                    },
                    members: rows.map((row) => {
                        return {
                            name: row.memberName,
                            email: row.memberEmail,
                            id: row.memberId
                        }
                    })
                }
            }
        }
    } catch (error: unknown) {
        return {
            success: false,
            error: (error instanceof Error) ? error.message : "An unexpected error occurred"
        }
    }

}

export async function getMyTeamForEvent(eventId: string) {

    try {

        const user = await currentUser();

        if (!user) {
            redirect('/signin')
        }

        const email = user.emailAddresses.at(0)?.emailAddress as string;

        const rows = await db
            .select({
                teamId: teamMembers.teamId,
            })
            .from(teamMembers)
            .innerJoin(students, eq(students.id, teamMembers.memberId))
            .innerJoin(teams, eq(teamMembers.teamId, teams.id))
            .innerJoin(events, eq(events.id, teams.eventId))
            .where(and(eq(students.email, email), eq(events.id, eventId)))


        return {
            error: null,
            result: rows
        }
    } catch (err) {
        return {
            error: "Student team information not found",
            result: []
        }
    }

}

export async function banTeam(previousState: unknown, teamId: string): Promise<{ error: string | null, result: { id: string } | null }> {
    try {
        const rows = await db.update(teams).set({ banned: true }).where(eq(teams.id, teamId)).returning({ id: teams.id });
        if (rows.length === 0) {
            throw new Error("Could not unban team");
        }
        revalidatePath('/teams');
        return { error: null, result: { id: rows.at(0)?.id as string } }
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message, result: null }
        } else {
            return { error: "An unexpected error occurred", result: null }
        }
    }

}

export async function unbanTeam(previousState: unknown, teamId: string) {

    try {
        const rows = await db.update(teams).set({ banned: false }).where(eq(teams.id, teamId)).returning({ id: teams.id });
        if (rows.length === 0) {
            throw new Error("Could not unban team");
        }
        revalidatePath('/teams');
        return { error: null, result: rows }
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message, result: null }
        } else {
            return { error: "An unexpected error occurred", result: null }
        }
    }

}

type EvaluationResult = { success: true; data: { id: string } } | { success: false; error: string };
export async function evaluateTeam(previousState: unknown, data: string): Promise<EvaluationResult> {

    try {

        const sql = neon(process.env.DATABASE_URL!);

        const rawData = JSON.parse(data);
        console.log(rawData)
        const { success, data: EvaluationData, error } = InsertEvaluationSchema.safeParse(rawData);

        if (!success) {
            throw new Error(error.message);
        }

        if (!EvaluationData.teamId) {
            throw new Error("Team ID is required");
        }

        if(!EvaluationData.evaluatorId) {
            throw new Error("Evaluator Id is required")
        }

        const evaluationsRows = await db.insert(evaluations).values({
            teamId: EvaluationData.teamId,
            evaluatorId: EvaluationData.evaluatorId,
            presentationScore: EvaluationData.presentationScore,
            outcomeScore: EvaluationData.outcomeScore,
            technologyScore: EvaluationData.technologyScore,
        }).returning({ id: evaluations.id, teamId: evaluations.teamId });

        await db.update(teams).set({ evaluated: true }).where(eq(teams.id, evaluationsRows.at(0)?.teamId as string));

        return { success: true, data: { id: EvaluationData.teamId! } }

    } catch (err) {

        if (err instanceof Error) {
            return { success: false, error: err.message }
        } else {
            return { success: false, error: "An unexpected error occurred" }
        }

    }

}
