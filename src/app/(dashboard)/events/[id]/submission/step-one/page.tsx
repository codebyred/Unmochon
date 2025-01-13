import { getMyTeamForEvent } from "@/actions/teams";
import ProjectForm from "@/components/form/ProjectForm";
import { redirect } from "next/navigation";


const StepOne = async({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id;

    return (
        <div className="shadow-custom p-4 rounded-lg grow">
            <ProjectForm
                eventId={eventId}
            />
        </div>
    );
}

export default StepOne;