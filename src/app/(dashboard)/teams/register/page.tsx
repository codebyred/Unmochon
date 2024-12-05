import { getEvents } from "@/actions/events";
import AddTeamForm from "@/components/form/AddTeamForm";
import { InsertEventSchema } from "@/db/schema";

const AddTeam = async () => {

    const events: InsertEventSchema[] = await getEvents();

    return (
        events.length > 0
            ?
            <div className="p-4">
                <AddTeamForm 
                />
            </div>
            :
            <div>No Events available</div>
    )
}

export default AddTeam;