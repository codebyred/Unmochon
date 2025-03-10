import { getEvent } from "@/actions/events";
import UpdateEventForm from "@/components/form/UpdateEventForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const EventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const id = (await params).id

    console.log(id);

    const result = await getEvent(id);
    const user = await currentUser();

    if (!user) return (
        redirect('/signin')
    )

    if (!result.success) return (
        <div className="grow p-4 shadow-custom rounded-lg">
            No event found
        </div>
    )

    const { event } = result.data;

    console.log(event);
    return (
        <div className="grow p-4 shadow-custom rounded-lg" data-cy="addEvent-page">

            <UpdateEventForm
                event={ event }
            />
        
        </div>
    )
}

export default EventPage;