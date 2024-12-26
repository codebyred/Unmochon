import { getTeamId } from "@/actions/teams";
import Fileupload from "@/components/Fileupload";
import { currentUser } from "@clerk/nextjs/server";

const ProjectSubmission = async({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
})=> {

    const projectId = (await searchParams)?.projectId;
    if(!projectId) return <div>You have not submitted project name and description</div>

    const user = await currentUser();

    if(!user) return <div>Please sign in</div>


    return (
        <div className="grow p-4 shadow-custom rounded-lg">
            <Fileupload/>
        </div>
    )
}

export default ProjectSubmission;