import { Calendar } from "@/components/ui/calendar"
import DashboardCard from "./DashboardCard";
import Analytics from "./Analytics";
import { getEvents } from "@/actions/events";

const EventOrganizer = async () => {

    const events = await getEvents();

    return (
        <div className="flex p-4 grow justify-between">
            {/*LEFT */}
            <div className="flex flex-col grow mr-4">
                <div className="flex justify-between">
                    <DashboardCard
                        topic="Evaluation board members"
                        amount="0"
                    />
                    <DashboardCard
                        topic="Number of Teams"
                        amount="0"
                    />
                    <DashboardCard
                        topic="Total Events"
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
                    events.map((event, index) => (
                        <div className="shadow-custom rounded-lg p-4" key={Math.floor(Math.random() * (index + 1))}>
                            <h1 className="text-sm font-bold">{event.eventName}</h1>
                            <p className="text-sm">last date of registration: {event.lastDateOfRegistration.toDateString()}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )

}

export default EventOrganizer;