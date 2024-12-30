import { getEvent, getEvents } from "@/actions/events";
import RefreshButton from "@/components/button/RefreshButton";
import EventRegistrationForm from "@/components/form/EventRegistrationForm";
import { currentUser } from "@clerk/nextjs/server";
import { compareAsc } from "date-fns";


const EventRegistration = async({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id;

    const {error, result} = await isRegistrationClosed(eventId);

    if(error) return (
        <div className="grow flex flex-col shadow-custom rounded-lg">
            <div className="grow flex flex-col items-center">
                {error}
                <RefreshButton/>
            </div>
        </div>
    )

    if(result) 
        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                <EventRegistrationForm/>
            </div>

        )
    else
        return (
            <div>
                Event registration is closed
            </div>
        )
}

export default EventRegistration;


async function isRegistrationClosed(eventId: string) {

    try{
      const {error, result} = await getEvent(eventId);

      if(error || result.length === 0 ) {
        throw new Error("Internal server error");
      }
  
      const currentDateIsAfterLastDateOfRegistration = 1;
      const currentDateIsBeforeLastDateOfRegistration = -1;
      const currentDateIslastDateOfRegistration = 0;
    
      const currentDate = new Date(2024, 11, 13);
      const comparedValue = compareAsc(currentDate, result.at(0)?.lastDateOfRegistration as Date)
    
      if(comparedValue === currentDateIsAfterLastDateOfRegistration){
        return {error: null, result: true}
      }
      return {error: null, result: false}

    }catch(error) {
        if(error instanceof Error)
            return {error: error.message, result: false}
        else
            return {error: "An unexpected error occured", result: false}
    }
  
  
  }