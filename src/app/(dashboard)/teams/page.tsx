import { getAllTeams, getStudentTeams } from "@/actions/teams";
import { currentUser } from "@clerk/nextjs/server";
import TeamTable from "@/components/table/TeamTable";
import { hasPermission } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

        const {error, result} = await getAllTeams();

        if(error) return (
            <div className="flex items-center justify-center grow">
                {error}
            </div>
        )

        if(!result) return (
            <div className="flex items-center justify-center grow">
                No teams available
            </div>
        )

        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                <Tabs defaultValue="all" className="">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="banned">Banned</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <TeamTable data={result.filter(((team)=> !team.isBanned))}/>
                </TabsContent>
                <TabsContent value="banned">
                    <TeamTable data={result.filter(((team)=> team.isBanned))}/>
                </TabsContent>
            </Tabs>

                
            </div>
        )

    }

    if(hasPermission(user, "view:ownteams")) {
    
        const {error, result} = await getStudentTeams(user?.emailAddresses.at(0)?.emailAddress as string);
    
        if(error) return(
            <div className="flex items-center justify-center grow">
                {error}
            </div>
        )

        if(!result) return (
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