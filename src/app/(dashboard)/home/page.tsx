import EventOrganizer from "@/components/EventOrganizer";
import Faculty from "@/components/Faculty";
import Student from "@/components/Student";
import { hasPermission, isEventOrganizer, isStudent } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";


const Dashboard = async () => {

    const user = await currentUser();

    if(!user) return (
        <div className="flex grow items-center justify-center">Please sign in</div>
    )
    return (
        <>
        {hasPermission(user, "view:eventorganizerdashboard") && <EventOrganizer/>} 
        
        {hasPermission(user, "view:studentdashboard") && <Student/>}
        
        {hasPermission(user, "view:studentdashboard") && <Faculty/>}
        </>
    )

}

export default Dashboard;