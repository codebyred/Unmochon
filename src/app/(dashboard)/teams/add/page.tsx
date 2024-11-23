import { getEvents } from "@/actions/events";
import AddTeamForm from "@/components/AddTeamForm";
import { InsertEventSchema } from "@/db/schema";

const AddTeam = async () => {

    const events: InsertEventSchema[] = await getEvents();

    return (
        events.length > 0
            ?
            <div className="p-4">
                <AddTeamForm 
                    events={events}
                />
            </div>
            :
            <div>No Events available</div>
    )
}

export default AddTeam;