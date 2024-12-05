import { getEvent } from "@/actions/events";
import UpdateEventForm from "@/components/form/UpdateEventForm";
import { currentUser } from "@clerk/nextjs/server";


const EventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const id = (await params).id

    const [error, result] = await getEvent(id);
    const user = await currentUser();

    if (!user) return (
        <div></div>
    )

    if (error || result === null) return (
        <div>No event found</div>
    )

    return (
        <div className="px-4" data-cy="addEvent-page">

            <UpdateEventForm
                id={result[0].id as string}
                eventName={result[0].eventName}
                lastDateOfProjectSubmission={result[0].lastDateOfProjectSubmission}
                lastDateOfRegistration={result[0].lastDateOfRegistration}
                requirements={result[0].requirements}
            />
        
        </div>
    )
}

export default EventPage;