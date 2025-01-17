import { getProjectByTeamId } from "@/actions/projects";
import { getMyTeamForEvent } from "@/actions/teams";
import BackButton from "@/components/button/BackButton";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CiCircleCheck } from "react-icons/ci";

const Submission = async({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const user = await currentUser();
    const eventId = (await params).id;
    if(!user) redirect('/signin');

    const myTeamResult = await getMyTeamForEvent(eventId)
    
    if(!myTeamResult.success) {
        const {error} = myTeamResult;
        return redirect(`/error?msg=${encodeURI(error)}`)
    }
        

    if(!myTeamResult.data.team.project.status.description) 
        return redirect(`/events/${eventId}/submission/step-one`)

    if(!myTeamResult.data.team.project.status.media) {

        const myProjectResult = await getProjectByTeamId(myTeamResult.data.team.id)

        if(!myProjectResult.success) {
            const {error} = myProjectResult

            return redirect(`/error?msg=${encodeURI(error)}`)
           
        }

        const {data} = myProjectResult;
        
        return redirect(`/events/${eventId}/submission/step-two?pid=${data.project.id}`)
        
    }

    return (
        <div className="grow flex p-4 shadow-custom rounded-lg">
            <BackButton/>
            <div className="grow flex flex-col items-center justify-center">
                <CiCircleCheck className="text-8xl text-green-500"/>
                You have submitted your project
            </div>
            
        </div>
    )


}

export default Submission;