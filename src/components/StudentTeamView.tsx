import { getStudentTeams } from "@/actions/teams";
import Add from "./Add";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "./ui/button";
import TeamTable from "./TeamTable";

const StudentTeamView = async ()=>{

    const user = await currentUser();

    type Result = {
        teamId: string,
        teamName:string,
        eventName: string,
    }

    const result: Result[] = await getStudentTeams(user?.emailAddresses.at(0)?.emailAddress as string);

    if(result.length === 0) return(
        <div className="flex items-center justify-center grow">
            <Add path={"/teams/add"}/>
        </div>
    )

    return (
        <div className="flex flex-col">
            <div className="flex flex-row-reverse p-4">
            <Button asChild>
                <Link href={"/teams/add"}>Create Team</Link>
            </Button>
            </div>

            <TeamTable data={result}/>
        </div>
    )
}

export default StudentTeamView;