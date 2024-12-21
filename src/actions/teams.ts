"use server"

import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { TeamSchema, events, students, teamMembers, teams } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { v4 } from 'uuid';
import { redirect } from "next/navigation";


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

type Result = {teamId: string, teamName: string, eventName: string}
export async function getAllTeams():Promise<[Error | null, Result[] | null]> {

    try{
        const rows = await db
        .select({
            teamId: teams.id,
            teamName: teams.name,
            eventName: events.eventName,
        })
        .from(teams)
        .innerJoin(events, eq(events.id, teams.eventId));

        if(rows.length === 0) {
            return [new Error("No teams available"), null]
        }

        return [null, rows]

    }catch(error) {
        return [new Error("An error occured while fetching teams"), null]
    }

}

export async function getStudentTeams(email: string) {

    const rows = await db
        .select({
            teamId: teams.id,
            teamName: teams.name,
            eventName: events.eventName,
            memberEmail: students.email
        })
        .from(teams)
        .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
        .innerJoin(events, eq(teams.eventId, events.id))
        .innerJoin(students, eq(students.id, teamMembers.memberId));

    const result = rows.filter((row)=>{
        return row.memberEmail === email
    }).map((row)=>{
        return {teamId: row.teamId, teamName: row.teamName, eventName: row.eventName}
    })

    return result
}

export async function deleteTeam(previousState:unknown, teamId: string){
    
    const result = await db.delete(teams).where(eq(teams.id, teamId)).returning({id: teams.id})

    if (result.length === 0) {
        const error = encodeURIComponent("Could not delete Team");
        redirect(`/teams?error=${error}`);
      }
    
    revalidatePath('/teams');
    redirect(`/teams`);
}


export async function getTeamInfo(teamId: string) {
    const rows =  await db
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

export async function getStudentTeamId(email: string, eventId: string) {

    try{
        const rows = await db
        .select({
            teamId: teamMembers.teamId
        })
        .from(teamMembers)
        .innerJoin(students,eq(students.id, teamMembers.memberId))
        .innerJoin(teams, eq(teamMembers.teamId, teams.id))
        .innerJoin(events, eq(events.id, teams.eventId))
        .where(and(eq(students.email, email), eq(events.id, eventId)))


        return {
            error: "",
            result: rows
        }
    }catch(err){
        return {
            error: "Student team information not found",
            result: []
        }
    }

}
