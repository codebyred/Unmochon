import { getEvent } from "@/actions/events";
import StudentEventView from "@/components/StudentEventView";
import UpdateEventForm from "@/components/UpdateEventForm";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";


const EventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const id = (await params).id

    const [error, result] = await getEvent(id);
    const user = await currentUser();

    if(!user) return (
        <div></div>
    )

    return (
        error
            ?
            <div>No event found</div>
            :
            result && (
                hasPermission(user, "update:events")
                ?
                <UpdateEventForm
                    id={result[0].id as string}
                    eventName={result[0].eventName}
                    lastDateOfProjectSubmission={result[0].lastDateOfProjectSubmission}
                    lastDateOfRegistration={result[0].lastDateOfRegistration}
                    requirements={result[0].requirements}
                />
                :
                <StudentEventView eventId={id}/>
            )

    )
}

export default EventPage;