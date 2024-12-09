import { getEvents } from "@/actions/events";
import CreateTeamForm from "@/components/form/CreateTeamForm";


const CreateTeam = async () => {

    return (

        <div className="p-4 grow shadow-custom rounded-lg">
            <CreateTeamForm/>
        </div>

    )
}

export default CreateTeam;