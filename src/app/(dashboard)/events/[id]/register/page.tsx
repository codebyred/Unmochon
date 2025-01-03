import { getEvent } from "@/actions/events";
import EventRegistrationForm from "@/components/form/EventRegistrationForm";
import { compareAsc } from "date-fns";


const EventRegistration = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id;

    const result = await getEvent(eventId);

    if (!result.success) return (
        <div className="p-4 grow shadow-custom rounded-lg">
            {result.error}
        </div>
    )

    const { event } = result.data;


    if(isRegistrationClosed(event.registrationDeadline))
        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                Event registration is closed
            </div>
        )
        
    return (
        <div className="p-4 grow shadow-custom rounded-lg">
            <EventRegistrationForm 
                eventId={ event .id }
                eventName={ event .name }
            />
        </div>

    )
}

export default EventRegistration;


function isRegistrationClosed(registrationDeadline: Date) {

    const currentDate = new Date();

    // Compare the current date with the registration deadline
    return compareAsc(currentDate, registrationDeadline) > 0;
}
