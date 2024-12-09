import { getAllTeams, getStudentTeams } from "@/actions/teams";
import { currentUser } from "@clerk/nextjs/server";
import TeamTable from "@/components/table/TeamTable";
import { hasPermission } from "@/lib/auth";


const Teams = async ()=>{

    const user = await currentUser();

    if(!user) return (
        <div>You are not signed in</div>
    )


    type Result = {
        teamId: string,
        teamName:string,
        eventName: string,
    }

    if(hasPermission(user, "view:allteams")) {


        const [error, result] = await getAllTeams();

        if(error || result === null) return (
            <div className="flex items-center justify-center grow">
                {error?.message}
            </div>
        )

        if(result.length === 0) return(
            <div className="flex items-center justify-center grow">
                No teams found
            </div>
        )

        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                <TeamTable data={result}/>
            </div>
        )

    }

    if(hasPermission(user, "view:ownteams")) {
    
        const result: Result[] = await getStudentTeams(user?.emailAddresses.at(0)?.emailAddress as string);
    
        if(result.length === 0) return(
            <div className="flex items-center justify-center grow">
                You have not registered in any event
            </div>
        )
    
        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                <TeamTable data={result}/>
            </div>
        )
    }

   
}

export default Teams;