import { getEvents } from "@/actions/events";
import EventRegistrationForm from "@/components/form/EventRegistrationForm";


const EventRegistration = () => {

    return (
        <div className="p-4 grow shadow-custom rounded-lg">
            <EventRegistrationForm/>
        </div>

    )
}

export default EventRegistration;