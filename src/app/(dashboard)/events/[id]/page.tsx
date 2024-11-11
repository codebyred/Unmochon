import { getEvent } from "@/actions/events";
import { Event } from "@/db/schema";
import {role} from "@/lib/data"

const EventPage = async()=> {

    return (
        role === "event-organizer"
        ?
        <div>
            can update
        </div>
        :
        <div>
            student can view and register
        </div>
    )
}

export default EventPage;