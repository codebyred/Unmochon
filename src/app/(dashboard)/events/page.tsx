import Add from "@/components/Add";
import { getEvents } from "@/actions/events";
import { Event } from "@/db/schema";
import AddItemCard from "@/components/AddItemCard";
import EventCard from "@/components/EventCard";
import { hasPermission } from "@/lib/auth";
import { role } from "@/lib/data";
import { Toaster } from "@/components/ui/toaster";
import FooterToaster from "@/components/FooterToaster";

const Events = async () => {

    const events: Event[] = await getEvents();

    return (

        events.length === 0
            ?
            <div className="flex items-center justify-center grow">
                <Add path="/events/add" />
            </div>
            :
            <>
            <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {
                    events.map((item, index) => (
                        <EventCard
                            key={ Math.floor(Math.random() * 9231)}
                            id={item.id as string}
                            title={item.eventName}
                            lastDateOfProjectSubmission={item.lastDateOfProjectSubmission}
                            lastDateOfRegistration={item.lastDateOfRegistration}
                            path={`/events/${item.id? item.id: ""}`}
                        />
                    ))
                }

                {hasPermission(role, "add:events") && <AddItemCard href="/events/add"/>}
                    
            </div>
            <FooterToaster/>
            </>

    );
}

export default Events