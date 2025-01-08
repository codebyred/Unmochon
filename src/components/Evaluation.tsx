import { isFaculty } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server"
import EvaluationForm from "./form/EvaluationForm";
import { getFacultyByEmail } from "@/actions/faculty";

type EvaluationProps = {
    teamId: string
}
const Evaluation = async(props: EvaluationProps)=> {

    const {teamId} = props;

    const user = await currentUser();

    if(!user) return (
        <div></div>
    )

    if(!isFaculty(user)) return (
        <div></div>
    )

    const {success, result, error} = await getFacultyByEmail(user.emailAddresses.at(0)?.emailAddress as string);

    if(!result) return (
        <div></div>
    )

    return (
        <EvaluationForm
            teamId={teamId}
            evaluatorId={result.at(0)?.id as string}
        />
    )

}

export default Evaluation