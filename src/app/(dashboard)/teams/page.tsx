import { getAllTeams, getMyTeams } from "@/actions/teams";
import { currentUser } from "@clerk/nextjs/server";
import TeamTable from "@/components/table/TeamTable";
import { hasPermission, isEventOrganizer, isFaculty, isStudent } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Teams = async ()=>{

    const user = await currentUser();

    if(!user) return (
        <div>You are not signed in</div>
    )

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
            {
                isEventOrganizer(user)?
                    <TeamsTabForOrganizer/>
                    :isFaculty(user)?
                        <TeamsTabForFaculty/>
                        :isStudent(user)?
                            <TeamsTabForStudent studentEmail={user.emailAddresses.at(0)?.emailAddress as string}/>
                            :<div></div>
            }          
        </div>
    )

}

type MyTeamsTab = {
    studentEmail: string
}
async function TeamsTabForStudent(props: MyTeamsTab) {
    const { studentEmail } = props;
    const {error: myTeamsErr, result: myTeams} = await getMyTeams(studentEmail);
    const {error: allTeamsErr, result: allTeams} = await getAllTeams();

    if(myTeamsErr || allTeamsErr) return (
        <div>Something went wrong</div>
    )

    if(!myTeams || !allTeams) return (
        <div>No team data found</div>
    )

    return (
        <Tabs defaultValue="all" className="">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="my">My</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <TeamTable data={allTeams as {
                    teamId: string;
                    teamName: string;
                    isBanned: boolean;
                    eventName: string;
                }[]}/>
            </TabsContent>
            <TabsContent value="my">
                <TeamTable data={myTeams as {
                    teamId: string;
                    teamName: string;
                    isBanned: boolean;
                    eventName: string;
                }[]}/>
            </TabsContent>
        </Tabs>
    )
}

async function TeamsTabForFaculty() {
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
        <Tabs defaultValue="all" className="">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
                <TabsTrigger value="ungraded">Ungraded</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <TeamTable data={result}/>
            </TabsContent>
            <TabsContent value="graded">
                <TeamTable data={result.filter((team)=> team.isEvaluated)}/>
            </TabsContent>
            <TabsContent value="ungraded">
                <TeamTable data={result.filter((team)=> !team.isEvaluated)}/>
            </TabsContent>
        </Tabs>
    )
}

async function TeamsTabForOrganizer() {

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
    )
}

export default Teams;