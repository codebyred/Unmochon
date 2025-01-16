import { currentUser } from "@clerk/nextjs/server";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import OrganizerDashboard from "@/components/dashboard/OrganizerDashboard";
import { redirect } from "next/navigation";
import { getFaculty, getStudent } from "@/actions/roles";

const Dashboard = async () => {

    const user = await currentUser()

    if (!user) redirect("/sigin")

    const studentResult = await getStudent(user);
    const facultyResult = await getFaculty(user);

    if(studentResult.success) return (
        <StudentDashboard/>
    )
    else if(facultyResult.success) return (
        <OrganizerDashboard/>
    )
    return (
        <div></div>
    )
}


export default Dashboard;