import EventOrganizer from "@/components/EventOrganizer";
import Faculty from "@/components/Faculty";
import Student from "@/components/Student";
import {role} from "@/lib/data"


const Dashboard = async () => {

    return (
        role === "event-organizer"
        ?
        <EventOrganizer/>
        : role === "student"
        ?
        <Student/>
        :
        <Faculty/>
    )

}

export default Dashboard;