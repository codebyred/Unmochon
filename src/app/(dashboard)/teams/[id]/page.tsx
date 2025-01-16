import { getProjectByTeamId } from "@/actions/projects";
import { getTeamInfo } from "@/actions/teams";
import MemberTable from "@/components/table/MemberTable";
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import BackButton from "@/components/button/BackButton";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RiTeamFill } from "react-icons/ri";
import { FaProjectDiagram } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Evaluation from "@/components/Evaluation";

const TeamView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const teamId = (await params).id;

    const getTeamInfoResult = await getTeamInfo(teamId);  

    if(!getTeamInfoResult.success) return (
        <div>
            {getTeamInfoResult.error}
        </div>  
    )

    const { team } = getTeamInfoResult.data;

    const projectResult = await getProjectByTeamId(teamId);

    return (
        <div className="grow shadow-custom p-4 rounded-lg text-xl">
            <div className="flex justify-between mb-4">
                <BackButton /> 
                {
                    team.evaluation.status?
                    <span className="border border-orange-400 rounded-lg flex items-center justify-center p-2">
                        <label>Score: </label>
                        {team.evaluation.grade}/30
                    </span>
                    :<Evaluation
                        teamId={teamId}
                    />   
                }
            </div>
            <div className="mb-4 shadow-custom rounded-lg p-4">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <IoMdInformationCircle />Team Information
                </h1>
                <Separator className="my-4" />
                <h1 className="text-normal font-bold">
                    Name
                </h1>
                <span className="font-normal mt-2 mb-4">{team.name}</span>
                <h1 className="text-normal font-bold">
                    Event
                </h1>
                <span className="font-normal mt-2 mb-4">
                    {
                        team.event.name
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                    }
                </span>
            </div>
            <div className="grow shadow-custom rounded-lg p-4 mb-4">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <RiTeamFill />Team Members
                </h1>
                <Separator className="my-4" />
                {
                    <MemberTable
                        data={team.members.map((item) => {
                            return {
                                memberId: item.id,
                                memberName: item.name,
                                memberEmail: item.email
                            }
                        })}
                    />
                }
            </div>
            <div className="grow shadow-custom rounded-lg p-4 mb-4">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <FaProjectDiagram />Team Project
                </h1>
                <Separator className="my-4" />
                {
                    !projectResult.success ?
                        <div className="grow flex items-center justify-center">
                            <span className="text-normal">
                                No project submitted
                            </span>
                        </div>
                        : <>
                            <h1 className="text-normal font-bold">
                                Name
                            </h1>
                            <span className="font-normal mt-2 mb-4">{projectResult.data.project.name}</span>
                            <h1 className="text-normal font-bold">
                                Description
                            </h1>
                            <p className="mt-2 mb-4">
                                {projectResult.data.project.description}
                            </p>
                        </>
                }
            </div>
            <div className="grow shadow-custom rounded-lg p-4">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <FaImages />Project Screenshots
                </h1>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4">
                    {projectResult.success &&  projectResult.data.project.media?.map((item, index) => (
                        <div key={index} className="p-2 mt-2 mb-4">
                            <a target="_blank" href={item.url} rel="noopener noreferrer">
                                <Image
                                    src={item.url}
                                    alt={"a image"}
                                    className="w-full h-auto"
                                    width={200}
                                    height={100}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default TeamView;