import { currentUser } from "@clerk/nextjs/server"
import EvaluationForm from "./form/EvaluationForm";
import { getFaculty } from "@/actions/roles";
import { redirect } from "next/navigation";


type EvaluationProps = {
    teamId: string
}
const Evaluation = async(props: EvaluationProps)=> {

    const {teamId} = props;

    const user = await currentUser();
    
    if(!user) redirect('/sigin')

    const isFacultyOrOrganizerResult = await getFaculty(user);

    if(!isFacultyOrOrganizerResult.success) {
        return (
            <div className="grow shadow-custom rounded-lg justify-center items-center">
                {isFacultyOrOrganizerResult.error}
            </div>
        )
    }

    const {data} = isFacultyOrOrganizerResult

    return (
        <EvaluationForm
            teamId={teamId}
            evaluatorId={data.id}
        />
    )

}

export default Evaluation