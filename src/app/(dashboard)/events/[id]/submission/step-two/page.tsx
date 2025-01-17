import Fileupload from "@/components/input/Fileupload";
import { currentUser } from "@clerk/nextjs/server";

const ProjectSubmission = async()=> {

    return (
        <div className="grow p-4 shadow-custom rounded-lg">
            <Fileupload/>
        </div>
    )
}

export default ProjectSubmission;