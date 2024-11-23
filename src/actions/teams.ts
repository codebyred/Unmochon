"use server"

import { db } from "@/db/drizzle";
import { TeamSchema, teamMembers, teams } from "@/db/schema";
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