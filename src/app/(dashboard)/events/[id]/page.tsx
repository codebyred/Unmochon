import { getEvent } from "@/actions/events";
import UpdateEventForm from "@/components/UpdateEventForm";
import { Event } from "@/db/schema";
import { hasPermission } from "@/lib/auth";
import { role } from "@/lib/data";


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
            result && (
                hasPermission(role, "update:events")
                ?
                <UpdateEventForm
                    id={result[0].id as string}
                    eventName={result[0].eventName}
                    lastDateOfProjectSubmission={result[0].lastDateOfProjectSubmission}
                    lastDateOfRegistration={result[0].lastDateOfRegistration}
                    requirements={result[0].requirements}
                />
                :
                <div>
                    student view
                </div>
            )

    )
}

export default EventPage;