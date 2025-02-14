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
  data: {
    event: {
      id: string
      status: 'updated'
    }
  }
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

    return {
      success: true, 
      data: {
        event:{
          id: rows[0].id,
          status: 'updated'
        }
      }
    };

  }catch(error) {
    if(error instanceof Error) {
      return {success: false, error: error.message};
    }
    else {
      return {success: false, error: "An unexpected error occurred"};
    }
  }

}


type EventsResult ={
  success: true
  data: {
    id: string
    name: string
    registrationDeadline: Date;
    projectSubmissionDeadline: Date;
    requirements: string;
  }[]
} | {
  success: false
  error: {
    message: string
  }
}


export async function getEvents():Promise<EventsResult> {

  try{
    const rows = await db.query.events.findMany();
    return {
      success: true,
      data: rows
    }
  }catch(err) {
    return {
      success: false,
      error: {
        message: "An expected error occured"
      }
    }
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
| { 
  success: false 
  error: {
    message: string
} };
export async function getEvent(eventId: string): Promise<EventResult> {

  try {

    const rows = await db.select().from(events).where(eq(events.id, eventId));

    if(rows.length === 0) { 
      throw new Error("Event not foundd");
    }

    return {success: true, data: {event: rows[0]}};

  } catch (error) {
    
      return {
        success: false,
        error: {
          message:error instanceof Error? error.message: "An unexpected error occurred"
        }
      }

    }
}

type DeleteEventResult = {
  success: true
  data: {
    event: {
      id: string
      status: 'deleted'
    }
  }
} | {
  success: false
  error: {
    message: string
  }
}

export async function deleteEvent(previoudState:unknown, eventId: string): Promise<DeleteEventResult> {

  try{
    const result = await db.delete(events).where(sql`${events.id} = ${eventId}`).returning()

    if (result.length === 0) {
      throw new Error("Event could not be deleted or not found");
    }

    return {
      success: true,
      data: {
        event: {
          id: eventId,
          status: "deleted"
        }
      }
    }

  }catch(err) {
    return {
      success: false,
      error: {
        message: err instanceof Error ? err.message : "An unexpected error occurred"
      }
    }
  }


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








