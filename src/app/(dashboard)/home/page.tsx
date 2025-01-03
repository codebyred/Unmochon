import { hasPermission, isEventOrganizer, isFaculty, isStudent } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { Calendar } from "@/components/ui/calendar"
import DashboardCard from "@/components/card/DashboardCard";
import Analytics from "@/components/chart/Analytics";
import { getEvents } from "@/actions/events";
import { getMyTeams } from "@/actions/teams";
import { v4 } from "uuid";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import OrganizerDashboard from "@/components/dashboard/OrganizerDashboard";

const Dashboard = async () => {

    const user = await currentUser();

    if (!user) return (
        <div className="flex grow items-center justify-center">Please sign in</div>
    )

    if(isEventOrganizer(user) || isFaculty(user)) return (
       <OrganizerDashboard/>
    )
    if(isStudent(user)) return (
        <StudentDashboard/>
    )

}


export default Dashboard;