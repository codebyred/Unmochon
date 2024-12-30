import { getProjectsByTeamId } from "@/actions/projects";
import { getMyTeamForEvent } from "@/actions/teams";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Submission = async({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const user = await currentUser();
    const eventId = (await params).id;
    if(!user) redirect('/signin');

    const {error: TeamError, result: TeamResult} = await getMyTeamForEvent(eventId)
    
    if(TeamError) return (
        <div>
            {TeamError}
        </div>
    )
    
    const {error: ProjectError, result: ProjectResult} = await getProjectsByTeamId(TeamResult.at(0)?.teamId as string)

    if(ProjectError) return (
        <div>
            {ProjectError}
        </div>
    )
    if(ProjectResult.length === 0)
        redirect(`/events/${eventId}/submission/step-one`)

    return (
        <div>
            You have submitted your project
        </div>
    )
}

export default Submission;