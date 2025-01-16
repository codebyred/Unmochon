import { getAllTeams, getMyTeams } from "@/actions/teams";
import { currentUser } from "@clerk/nextjs/server";
import TeamTable from "@/components/table/TeamTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFaculty, getStudent } from "@/actions/roles";
import { redirect } from "next/navigation";

const Teams = async ()=>{

    const user = await currentUser();

    if(!user) redirect("/signin")

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

    const studentResult = await getStudent(user);
    const facultyResult = await getFaculty(user);

    if(studentResult.success) {

        const { data } = studentResult;

        return (
            <div className="p-4 grow shadow-custom rounded-lg">
                <TeamsTabForStudent studentEmail={user.emailAddresses.at(0)?.emailAddress as string}/>      
            </div>
        )

    }
    else if(facultyResult.success) {

        const { data } = facultyResult

        return (
            <div className="p-4 grow shadow-custom rounded-lg">

                <TeamsTabForFaculty/>
                  
            </div>
        )
    }

    return (
        <div className="p-4 grow shadow-custom rounded-lg">
        </div>
    )

}

export default Teams;

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
                <TabsTrigger value="ungraded">Ungraded</TabsTrigger>
                <TabsTrigger value="banned">Banned</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <TeamTable data={result}/>
            </TabsContent>
            <TabsContent value="ungraded">
                <TeamTable data={result.filter((team)=> !team.isEvaluated)}/>
            </TabsContent>
            <TabsContent value="banned">
                <TeamTable data={result.filter((team)=> team.isBanned)}/>
            </TabsContent>
        </Tabs>
    )
}
