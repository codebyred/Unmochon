"use server"

import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { TeamSchema, events, students, teamMembers, teams } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { v4 } from 'uuid';
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";


export async function createTeam(previouState: unknown, values: string) {

    const valuesObj = JSON.parse(values);

    const resultOfParsing = TeamSchema.safeParse(valuesObj);

    if (!resultOfParsing.success) {
        return new Error("Invalid Form Data")
    }

    const teamId = v4()

    try {
        const resultOfTeamsInsert = await db.insert(teams).values({
            id: teamId,
            name: resultOfParsing.data.teamName,
            eventId: resultOfParsing.data.eventId,
        }).returning({ id: teams.id })

        if (resultOfTeamsInsert.length === 0) {
            throw new Error("Can not create team");
        }
    } catch (e: unknown) {
        return (e instanceof Error) ? new Error(`${e.message}`) : new Error(`${e}`)
    }


    try {
        const resultOfTeamMembersInsert = await db.insert(teamMembers).values(resultOfParsing
            .data.members.map((member) => {
                return { teamId: teamId, memberId: member.id }
            }
            )).returning({ id: teamMembers.teamId })

        if (resultOfTeamMembersInsert.length === 0) {
            throw new Error("Can not add team members")
        }
    } catch (e: unknown) {
        return (e instanceof Error) ? new Error(`${e.message}`) : new Error(`${e}`)
    }


    revalidatePath('/teams');
    redirect('/teams');

}

type Result = { teamId: string, teamName: string, eventName: string }
export async function getAllTeams() {

    try {
        const rows = await db
            .select({
                teamId: teams.id,
                teamName: teams.name,
                isBanned: teams.banned,
                eventName: events.eventName,
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
export async function getStudentTeams(email: string): Promise<{ error: string | null, result: GetAllStudentTeamsResult[] | null }> {

    try {

        const rows = await db
            .select({
                teamId: teams.id,
                teamName: teams.name,
                eventName: events.eventName,
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
        if(error instanceof Error){
            return { error: error.message, result: null }
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred", result: null }
        }
    }

}

export async function deleteTeam(previousState: unknown, teamId: string): Promise<{ error: string | null, result: {id:string} | null }> {

    try{

        const rows = await db.delete(teams).where(eq(teams.id, teamId)).returning({ id: teams.id })

        if (rows.length === 0) {
            throw new Error("Could not delete team");
        }
    
        revalidatePath('/teams');
        
        return {error: null, result: {id:rows.at(0)?.id as string}}

    }catch(error){

        if (error instanceof Error) {
            return { error: error.message, result: null };
        } else {
            console.error("Unexpected error:", error);
            return { error: "An unexpected error occurred", result: null };
        }

    }

}


export async function getTeamInfo(teamId: string) {
    const rows = await db
        .select({
            teamName: teams.name,
            eventName: events.eventName,
            memberName: students.name,
            memberEmail: students.email,
            memberId: students.id
        })
        .from(teamMembers)
        .innerJoin(teams, eq(teams.id, teamMembers.teamId))
        .innerJoin(events, eq(events.id, teams.eventId))
        .innerJoin(students, eq(teamMembers.memberId, students.id))
        .where(eq(teamMembers.teamId, teamId));

    return rows
}

export async function getTeamId(eventId: string) {

    try {

        const user = await currentUser();

        if (!user) {
            throw new Error("Please sign in");
        }

        const email = user.emailAddresses.at(0)?.emailAddress as string;

        const rows = await db
            .select({
                teamId: teamMembers.teamId
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

export async function unbanTeam(previousState: unknown,teamId: string) {

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
