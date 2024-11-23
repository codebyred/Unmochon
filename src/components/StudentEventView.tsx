import { getEvent } from "@/actions/events";

type StudentEventViewProps = {
    eventId: string
}

const StudentEventView = async (props: StudentEventViewProps)=>{

    const [error, result] = await getEvent(props.eventId);

    if(error || !result) return (<div>No data found related to event</div>)
    
    return (
        <div>
            {result.at(0)?.eventName}
        </div>
    )
}

export default StudentEventView;