import { getEvents } from "@/actions/events";
import CreateTeamForm from "@/components/form/CreateTeamForm";
import { InsertEventSchema } from "@/db/schema";

const AddTeam = async () => {

    const events: InsertEventSchema[] = await getEvents();

    if (events.length <= 0) return (
        <div>No Events available</div>
    )

    return (

        <div className="p-4">
            <CreateTeamForm/>
        </div>

    )
}

export default AddTeam;