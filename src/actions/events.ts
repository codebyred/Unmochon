"use server"

import { InsertEventSchema } from "@/db/schema"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function createEvent(previousState: unknown, formData: FormData) {

  const result = InsertEventSchema.safeParse({
      eventName: formData.get('eventName'), 
      lastDateOfRegistration: new Date(formData.get('lastDateOfRegistration') as string), 
      lastDateOfProjectSubmission: new Date(formData.get('lastDateOfProjectSubmission') as string), 
      requirements: formData.get('requirements')
    });
    

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

export async function updateEvent(previousState: unknown, formData: FormData) {

  const result = InsertEventSchema.safeParse({
    id: formData.get('id'),
    eventName: formData.get('eventName'), 
    lastDateOfRegistration: new Date(formData.get('lastDateOfRegistration') as string), 
    lastDateOfProjectSubmission: new Date(formData.get('lastDateOfProjectSubmission') as string), 
    requirements: formData.get('requirements')
  });
  

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

export async function getEvents() {
  const events: InsertEventSchema[] = await db.query.events.findMany();

  return events;
}

export async function getEvent(eventId: string):Promise<[Error | null, InsertEventSchema[] | null]>  {

  try {
    const result = await db.select().from(events).where(sql`${events.id} = ${eventId}`);

    if (result.length === 0) {
      return [new Error("Event not found"), null];
    }

    return [null, result];
  } catch (error) {
    console.error(`Failed to fetch event with ID ${eventId}:`, error);
    return [new Error("An error occurred while fetching the event"), null];
  }
  
}

export async function deleteEvent(eventId: string){


  const result = await db.delete(events).where(sql`${events.id} = ${eventId}`).returning()

  if (result.length === 0) {
    const error = encodeURIComponent("Could not delete event");
    redirect(`/events?error=${error}`);
  }

  const success = encodeURIComponent("Event deleted successfully");
  revalidatePath('/events');
  redirect(`/events?success=${success}`);

}

