"use server"

import { Event } from "@/lib/types"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/db/drizzle";
import { events } from "@/db/schema";

export async function createEvent(previousState: any, formData: FormData) {

    const result = Event.safeParse({
        eventName: formData.get('eventName') || "", 
        lastDateOfRegistration: formData.get('lastDateOfRegistration')
          ? new Date(formData.get('lastDateOfRegistration') as string) 
          : null, 
        lastDateOfProjectSubmission: formData.get('lastDateOfProjectSubmission')
          ? new Date(formData.get('lastDateOfProjectSubmission') as string)
          : null, 
        requirements: formData.get('requirements') || ''
      });
      

    if (!result.success) {
        return JSON.stringify(result.error.issues)
    }

    const event: Event = {
        id: uuidv4(),
        ...result.data
    };

    const eventId = await db.insert(events).values(event).returning({id: events.id});

    if(eventId.length === 0) {
      return JSON.stringify({message: "can not create event"});
    }

    revalidatePath('/events');
    redirect('/events');

}

export async function getEvents() {
    const events: Event[] = await db.query.events.findMany({
      columns: {id: false}
    });

    return events;
}