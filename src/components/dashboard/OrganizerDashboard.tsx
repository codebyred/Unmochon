import { currentUser } from "@clerk/nextjs/server";
import { Calendar } from "@/components/ui/calendar"
import DashboardCard from "@/components/card/DashboardCard";
import Analytics from "@/components/chart/Analytics";
import { getEvents } from "@/actions/events";
import { v4 } from "uuid";
import { numberOfProjects } from "@/actions/projects";
import { redirect } from "next/navigation";
import { numberOfTeams } from "@/actions/teams";

const OrganizerDashboard = async() => {

    const user = await currentUser();

    if (!user) redirect("/signin")

    const [error,events] = await getEvents();

    const numberOfProjectsResult = await numberOfProjects();

    const numberOfTeamsResult = await numberOfTeams();

    if(error || events === null) return (
        <div>An error occured or could not get events</div>
    )

    return (
        <div className="flex p-4 grow">
            {/*LEFT */}
            <div className="flex flex-col grow mr-4">
                <div className="flex justify-between">
                    <DashboardCard
                        topic="Number of Events"
                        amount={`${events.length}`}
                    />
                    <DashboardCard
                        topic="Registered Teams"
                        amount={numberOfTeamsResult.success?`${numberOfTeamsResult.data?.teams.count}`:`0`}
                    />
                    <DashboardCard
                        topic="Submitted Projects "
                        amount={numberOfProjectsResult.success?`${numberOfProjectsResult.data?.projects.count}`:'0'}
                    /> 
                </div>
                <div>
                    <Analytics className="mt-4 mb-4" />
                </div>
            </div>

            {/*RIGHT */}
            <div className="">
                <Calendar
                    mode="single"
                    className="rounded-md border"
                />
                {
                    events.map((event) => (
                        <div className="shadow-custom rounded-lg p-4" key={v4()}>
                            <h1 className="text-sm font-bold">{event.name}</h1>
                            <p className="text-sm">Registration Deadline: {event.registrationDeadline.toDateString()}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default OrganizerDashboard;