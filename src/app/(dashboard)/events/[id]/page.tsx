import { getEvent } from "@/actions/events";
import EventForm from "@/components/EventForm";
import { Event } from "@/db/schema";


const EventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const id = (await params).id

    const [error, result] = await getEvent(id);

    return (
        error
            ?
            <div>No event found</div>
            :
            result && <div>
                <EventForm
                    variant="update"
                    id={result[0].id}
                    eventName={result[0].eventName}
                    lastDateOfProjectSubmission={result[0].lastDateOfProjectSubmission}
                    lastDateOfRegistration={result[0].lastDateOfRegistration}
                    requirements={result[0].requirements}
                />
                
            </div>

    )
}

export default EventPage;