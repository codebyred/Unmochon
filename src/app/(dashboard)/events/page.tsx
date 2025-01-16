import Add from "@/components/Add";
import { getEvents, getRegisteredEvents } from "@/actions/events";
import AddItemCard from "@/components/card/AddItemCard";
import EventCard from "@/components/card/EventCard";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation";
import { getFaculty, getStudent } from "@/actions/roles";



const Events = async () => {

    const [error, events] = await getEvents();
    const user = await currentUser()

    if (!user) redirect("/sigin")

    const studentResult = await getStudent(user);
    const facultyResult = await getFaculty(user);

    if (error || events === null) return (
        <div>An error occured or no events found</div>
    )

    if (events.length === 0 && facultyResult.success && facultyResult.data.organizer) return (
        <div className="flex items-center justify-center grow">
            <Add path="/events/create" />
        </div>
    )

    return (
        <div className="p-4 shadow-custom rounded-lg grow ">
            <Tabs defaultValue="all" className="">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {studentResult.success && <TabsTrigger value="registered">Registered</TabsTrigger>}
                    
                </TabsList>
                <TabsContent value="all">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

                        {
                            studentResult.success && events.map((event) => {

                                return <EventCard
                                    key={Math.floor(Math.random()*1111 + 1)}
                                    event={{ ...event, id: event.id as string}}
                                    userRole="Student"
                                />
                            })

                        }
                        {
                            facultyResult.success && events.map((event) => {

                                return <EventCard
                                    key={Math.floor(Math.random()*1111 + 1)}
                                    event={{ ...event, id: event.id as string}}
                                    userRole={facultyResult.data.organizer?"Organizer":"Faculty"}
                                />
                            })

                        }
                        {facultyResult.success && facultyResult.data.organizer && <AddItemCard href="/events/create" />}
                    </div>
                </TabsContent>
                <TabsContent value="registered">
                    <RegisteredEvents/>
                </TabsContent>
            </Tabs>

        </div>
    );
}


async function RegisteredEvents() {
    
    const result = await getRegisteredEvents();

    if(!result.success) return (
        <div className="flex items-center justify-center grow">
            No registered events
        </div>
    )
    const { data } = result;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {
            data.events.map((event) => {

                return <EventCard
                    key={Math.floor(Math.random() * 1111 + 1)}
                    event={event}
                    userRole="Student"
                />
            })

        }
        </div>
    )
} 

export default Events