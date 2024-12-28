import { getProjectsByTeamId } from "@/actions/projects";
import { getTeamInfo } from "@/actions/teams";
import MagicButtonContainer from "@/components/button/MagicButtonContainer";
import MemberTable from "@/components/table/MemberTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";

const TeamView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const teamId = (await params).id;
    const teamInfo = await getTeamInfo(teamId);
    const {error, result} = await getProjectsByTeamId(teamId)

    return (
        <div className="grow shadow-custom p-4 rounded-lg text-xl">
            <div className="flex justify-between mb-4">              
                <MagicButtonContainer/>
                {
                    result && result.length === 0 ?
                    <div>No project submitted</div>
                    :<Button asChild>
                        <Link href={`/projects/${result?.at(0)?.id as string}`}>
                            view project
                        </Link>
                    </Button>
                }

            </div>
            <div className="flex flex-col"> 
                <span className="text-4xl">
                    {
                        teamInfo.at(0)?.teamName.toLowerCase().includes('team')
                        ?`${teamInfo.at(0)?.teamName}`
                        :`Team ${teamInfo.at(0)?.teamName}`
                    }
                </span>
                <span className="text-xl font-thin">
                    Event: {teamInfo.at(0)?.eventName}
                </span>  
            </div>
            <Separator className="my-4"/>
            {
                <MemberTable
                    data={teamInfo.map((item) => {
                        return {
                            memberId: item.memberId,
                            memberName: item.memberName,
                            memberEmail: item.memberEmail
                        }
                    })}
                />
            }
        </div>
    )
}

export default TeamView;