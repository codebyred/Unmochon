import Add from "@/components/Add";
import { getEvents } from "@/actions/events";
import { InsertEventSchema } from "@/db/schema";
import AddItemCard from "@/components/card/AddItemCard";
import EventCard from "@/components/card/EventCard";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { v4 } from "uuid";

const Events = async () => {

    const events: InsertEventSchema[] = await getEvents();
    const user = await currentUser()

    if(!user) return (
        <div></div>
    )

    return (

        (events.length === 0 && hasPermission(user, "add:events"))
            ?
            <div className="flex items-center justify-center grow">
                <Add path="/events/add"/>
            </div>
            :
            <>
            <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {
                    events.map((item) => (
                        <EventCard
                            key={ v4() }
                            id={item.id as string}
                            title={item.eventName}
                            lastDateOfProjectSubmission={item.lastDateOfProjectSubmission}
                            lastDateOfRegistration={item.lastDateOfRegistration}
                            path={
                                hasPermission(user, "update:events")
                                ?
                                `/events/update/${item.id as string}`
                                :
                                `/events/register/${item.id as string}`
                            }
                        />
                    ))
                }

                {hasPermission(user, "add:events") && <AddItemCard href="/events/add"/>}
                    
            </div>
            </>

    );
}

export default Events