import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { Calendar } from "@/components/ui/calendar"
import DashboardCard from "@/components/card/DashboardCard";
import Analytics from "@/components/Analytics";
import { getEvents } from "@/actions/events";
import { getStudentTeams } from "@/actions/teams";
import { v4 } from "uuid";

const Dashboard = async () => {

    const user = await currentUser();
    const events = await getEvents();

    if (!user) return (
        <div className="flex grow items-center justify-center">Please sign in</div>
    )

    let myteams: number = 0;

    if(hasPermission(user, "view:ownteams")) {
        const teams = await getStudentTeams(user.emailAddresses.at(0)?.emailAddress as string)
        myteams = teams.length;
    }

    return (

        <div className="flex p-4 grow justify-between">
            {/*LEFT */}
            <div className="flex flex-col grow mr-4">
                <div className="flex justify-between">
                    {
                        hasPermission(user, "view:evaluationboard") &&
                        <DashboardCard
                            topic="Evaluation board members"
                            amount="0"
                        />
                    }
                    {
                        hasPermission(user, "view:ownteams") &&
                        <DashboardCard
                            topic="My teams"
                            amount={`${myteams}`}
                        />
                    }

                    <DashboardCard
                        topic="Teams"
                        amount="0"
                    />
                    <DashboardCard
                        topic="Current Events"
                        amount={`${events.length}`}
                    />
                </div>
                <div>
                    <Analytics />
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
                            <h1 className="text-sm font-bold">{event.eventName}</h1>
                            <p className="text-sm">last date of registration: {event.lastDateOfRegistration.toDateString()}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )

}


export default Dashboard;