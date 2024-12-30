import { getProjectsByTeamId } from "@/actions/projects";
import { getMyTeamForEvent } from "@/actions/teams";
import ProjectForm from "@/components/form/ProjectForm";
import { redirect } from "next/navigation";


const StepOne = async({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id;
    const {error: TeamError, result: TeamResult} = await getMyTeamForEvent(eventId);
    //const {error: ProjectError, result: ProjectResult} = await getProjectsByTeamId(TeamResult.at(0)?.teamId as string)

    //if(ProjectResult.length === 0)

    return (
        <div className="shadow-custom p-4 rounded-lg grow">
            <ProjectForm
                eventId={eventId}
            />
        </div>
    );
}

export default StepOne;