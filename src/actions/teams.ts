"use server"

import { db } from "@/db/drizzle";
import { sql, eq } from "drizzle-orm";
import { TeamSchema, students, teamMembers, teams } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { v4 } from 'uuid';
import { redirect } from "next/navigation";
import { teamFormDataToObject } from "@/lib/utils";


export async function createTeam(previouState:any, formData: unknown) {

    if (!(formData instanceof FormData)) {
        return new Error("Not formData");
    }

    const formDataObject = teamFormDataToObject(formData);

    console.log(formDataObject)

    const resultOfParsing = TeamSchema.safeParse(formDataObject);

    if (!resultOfParsing.success) {
        return new Error("Invalid Form Data")
    }

    const teamId = v4()

    try{
        const resultOfTeamsInsert = await db.insert(teams).values({
            id: teamId,
            name: resultOfParsing.data.teamName,
            eventId: resultOfParsing.data.eventId,
        }).returning({id: teams.id})

        if(resultOfTeamsInsert.length === 0) {
            throw new Error("Can not create team");
        }
    }catch(e: unknown) {
        return (e instanceof Error)? new Error(`${e.message}`): new Error(`${e}`) 
    } 


    try{
        const resultOfTeamMembersInsert = await db.insert(teamMembers).values(resultOfParsing
            .data.members.map((member) => 
                { 
                    return { teamId: teamId, memberId: member.id } 
                }
        )).returning({id: teamMembers.teamId})
    
        if(resultOfTeamMembersInsert.length === 0) {
            throw new Error("Can not add team members")
        }
    }catch(e: unknown){
        return (e instanceof Error)? new Error(`${e.message}`): new Error(`${e}`) 
    }


    revalidatePath('/teams');
    redirect('/teams');

}

export async function getTeam(email: string){
    const queryOfStudents = await db.select().from(students).where(sql`students.email == ${email}`);
    if(queryOfStudents.length === 0){
        return new Error("User is not a student")
    }
    const studentId = queryOfStudents.at(0)?.id as string;
    
    const queryOfTeamMembers = await db.select().from(teamMembers)
        .where(sql`teamMembers.memberId == ${studentId}`)
        .innerJoin(teams, eq(teams.id, teamMembers.teamId))

    if(queryOfTeamMembers.length === 0) {
        return new Error("Student is not in a team")
    }

    //return JSON.stringify()

}