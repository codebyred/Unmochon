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
        <div className="grow p-4 shadow-custom rounded-lg" data-cy="addEvent-page">

            <UpdateEventForm
                event={result[0]}
            />
        
        </div>
    )
}

export default EventPage;