"use server"

import { InsertEventSchema, students, teamMembers, teams } from "@/db/schema"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { eventNames } from "process";
import { currentUser } from "@clerk/nextjs/server";

type CreateEventResult = {
  success: true;
  data: string;
} | {
  success: false;
  error: string;
}
export async function createEvent(previousState: unknown, data: string): Promise<CreateEventResult> {

  try{
    const rawData = JSON.parse(data);

    if(Object.hasOwn(rawData, "registrationDeadline")) {
      rawData.registrationDeadline = new Date(rawData.registrationDeadline)
    }
  
    if(Object.hasOwn(rawData, "projectSubmissionDeadline")) {
      rawData.projectSubmissionDeadline = new Date(rawData.projectSubmissionDeadline)
    }
  
    const result = InsertEventSchema.safeParse(rawData); 
  
    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }

  
    const eventId = await db.insert(events).values(result.data).returning({id: events.id});
  
    if(eventId.length === 0) {
      throw new Error("Can not create event");
    }
  
    revalidatePath('/events');
    
    return {success: true, data: eventId[0].id};

  }catch(error) {
    if( error instanceof Error) {
      return {success: false, error: error.message};
    }else {
      return {success: false, error: "An unexpected error occurred"};
    }
  }

}

type UpdateEventResult = {
  success: true;
  data: string;
} | {
  success: false;
  error: string;
}

export async function updateEvent(previousState: unknown, data: string): Promise<UpdateEventResult> {

  try {
    const rawData = JSON.parse(data);

    if(Object.hasOwn(rawData, "registrationDeadline")) {
      rawData.registrationDeadline = new Date(rawData.registrationDeadline)
    }
  
    if(Object.hasOwn(rawData, "projectSubmissionDeadline")) {
      rawData.projectSubmissionDeadline = new Date(rawData.projectSubmissionDeadline)
    }
  
    const result = InsertEventSchema.safeParse(rawData); 
    
    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }
  
    const rows = await db.update(events)
      .set(result.data)
      .where(eq(events.id,result.data.id as string))
      .returning({id: events.id});
  
    if(rows.length === 0) {
      throw new Error("no event found");
    }
  
    revalidatePath('/events');

    return {success: true, data: rows[0].id};

  }catch(error) {
    if(error instanceof Error) {
      return {success: false, error: error.message};
    }
    else {
      return {success: false, error: "An unexpected error occurred"};
    }
  }

}

export async function getEvents():Promise<[Error | null, InsertEventSchema[] | null]> {

  try{
    const events: InsertEventSchema[] = await db.query.events.findMany();
    return [null, events];
  }catch(err) {
    return [new Error("Could not fetch events"), null]
  }

}

type EventResult = 
{ 
  success: true
  data: {
    event:  {
      id: string
      name: string
      registrationDeadline: Date
      projectSubmissionDeadline: Date
      requirements: string
    }
  }
}
| { success: false; error: string };
export async function getEvent(eventId: string): Promise<EventResult> {

  try {

    const rows = await db.select().from(events).where(eq(events.id, eventId));

    return {success: true, data: {event: rows[0]}};

  } catch (error) {
    if(error instanceof Error)
      return {
        success: false,
        error: error.message
      }
    else
      return {
        success: false,
        error: "An unexpected error occurred"
      }
  }
  
}

export async function deleteEvent(previoudState:unknown, eventId: string){


  const result = await db.delete(events).where(sql`${events.id} = ${eventId}`).returning()

  if (result.length === 0) {
    const error = encodeURIComponent("Could not delete event");
    redirect(`/events?error=${error}`);
  }

  revalidatePath('/events');
  redirect('/events');

}

type RegisteredEventsResult = 
{ 
  success: true
  data: {
    events:  {
      id: string
      name: string
      registrationDeadline: Date
      projectSubmissionDeadline: Date
      requirements: string
  }[]
  }
}
| { success: false; error: string };

export async function getRegisteredEvents(): Promise<RegisteredEventsResult> {
  

  try{
    
    const user = await currentUser();

    const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;

    const rows = await db.select( {
      id: events.id,
      name: events.name,
      registrationDeadline: events.registrationDeadline,
      projectSubmissionDeadline: events.projectSubmissionDeadline,
      requirements: events.requirements 
    })
    .from(teamMembers)
    .innerJoin(students, eq(students.id, teamMembers.memberId))
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(events, eq(events.id, teams.eventId))
    .where(eq(students.email, userEmail))

    return {
      success: true, 
      data: {
        events:rows
      }
    }

  }catch(error){
    return { success: false, error: "An unexpected error occurred" }
  }

}








