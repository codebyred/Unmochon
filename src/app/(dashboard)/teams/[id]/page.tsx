import { getTeamInfo } from "@/actions/teams";
import MemberTable from "@/components/MemberTable";

const TeamView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {


    const teamId = (await params).id;
    const teamInfo = await getTeamInfo(teamId);

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col grow">
                <div className="flex gap-12 mb-4 shadow-custom rounded p-2">
                    <h1 className="text-2xl font-bold ">
                        Team Name
                        <p className="font-normal">{teamInfo.at(0)?.teamName}</p>
                    </h1>
                    <h1 className="text-2xl font-bold">
                        Event Name
                        <p className="font-normal">{teamInfo.at(0)?.eventName}</p>
                    </h1>
                </div>


            </div>
            <div className="shadow-custom p-2 rounded">
                <h1 className="text-2xl font-bold">
                    Members
                </h1>
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
        </div>
    )
}

export default TeamView;