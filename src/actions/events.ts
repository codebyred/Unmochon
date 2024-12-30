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

export async function createEvent(previousState: unknown, values: string) {

  const valuesObj = JSON.parse(values);

  if(Object.hasOwn(valuesObj, "lastDateOfRegistration")) {
    valuesObj.lastDateOfRegistration = new Date(valuesObj.lastDateOfRegistration)
  }

  if(Object.hasOwn(valuesObj, "lastDateOfProjectSubmission")) {
    valuesObj.lastDateOfProjectSubmission = new Date(valuesObj.lastDateOfProjectSubmission)
  }

  const result = InsertEventSchema.safeParse(valuesObj); 

  if (!result.success) {
    return new Error(result.error.issues[0].message);
  }

  const event: InsertEventSchema = {
      id: uuidv4(),
      ...result.data
  };


  const eventId = await db.insert(events).values(event).returning({id: events.id});

  if(eventId.length === 0) {
    return new Error("Can not create event");
  }

  revalidatePath('/events');
  redirect('/events');

}

export async function updateEvent(previousState: unknown, values: string) {

  const valuesObj = JSON.parse(values);

  if(Object.hasOwn(valuesObj, "lastDateOfRegistration")) {
    valuesObj.lastDateOfRegistration = new Date(valuesObj.lastDateOfRegistration)
  }

  if(Object.hasOwn(valuesObj, "lastDateOfProjectSubmission")) {
    valuesObj.lastDateOfProjectSubmission = new Date(valuesObj.lastDateOfProjectSubmission)
  }

  const result = InsertEventSchema.safeParse(valuesObj); 
  

  if (!result.success) {
    return new Error(result.error.issues[0].message);
  }


  const eventId = await db.update(events)
    .set(result.data)
    .where(eq(events.id,result.data.id as string))
    .returning({id: events.id});

  if(eventId.length === 0) {
    return new Error("no event found");
  }

  revalidatePath('/events');
  redirect('/events');
}

export async function getEvents():Promise<[Error | null, InsertEventSchema[] | null]> {

  try{
    const events: InsertEventSchema[] = await db.query.events.findMany();
    return [null, events];
  }catch(err) {
    return [new Error("Could not fetch events"), null]
  }

}

export async function getEvent(eventId: string) {

  try {

    const rows = await db.select().from(events).where(eq(events.id, eventId));

    return {error: null, result: rows};

  } catch (error) {
    if(error instanceof Error)
      return {
        error: error.message, 
        result: [] as {
          id: string;
          eventName: string;
          lastDateOfRegistration: Date;
          lastDateOfProjectSubmission: Date;
          requirements: string;
      }[]
      };
    else
      return {
        error: "An unexpected error occurred" , 
        result: [] as {
          id: string;
          eventName: string;
          lastDateOfRegistration: Date;
          lastDateOfProjectSubmission: Date;
          requirements: string;
        }[]
      };
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

export async function getRegisteredEvents(): Promise<{error: string | null, result: InsertEventSchema[]}> {

  try{
    
    const user = await currentUser();

    const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;

    const rows = await db.select( {
      id: events.id,
      lastDateOfRegistration: events.lastDateOfRegistration,
      lastDateOfProjectSubmission: events.lastDateOfProjectSubmission,
      eventName: events.eventName,
      requirements: events.requirements 
    })
    .from(teamMembers)
    .innerJoin(students, eq(students.id, teamMembers.memberId))
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(events, eq(events.id, teams.eventId))
    .where(eq(students.email, userEmail))

    return {error: null, result: rows }

  }catch(error){
    return {
      error: "An unexpected error occured", 
      result: []
    }
  }

}








