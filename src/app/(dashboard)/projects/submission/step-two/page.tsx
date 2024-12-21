import { getStudentTeamId } from "@/actions/teams";
import Fileupload from "@/components/Fileupload";
import { currentUser } from "@clerk/nextjs/server";

const ProjectSubmission = async({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
})=> {

    const eventId = (await searchParams)?.eventId;
    if(!eventId) return <div>Event not found</div>

    const user = await currentUser();

    if(!user) return <div>Please sign in</div>
    const {error, result} = await getStudentTeamId(user.emailAddresses.at(0)?.emailAddress as string, eventId as string);

    if(error || result.length === 0) return (
        <div>
           An error occured or no team found
        </div>
    )

    return (
        <div className="grow p-4 shadow-custom rounded-lg">
            <Fileupload/>
        </div>
    )
}

export default ProjectSubmission;