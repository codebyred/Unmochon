import { getProjectsByTeamId } from "@/actions/projects";
import { getTeamInfo } from "@/actions/teams";
import MemberTable from "@/components/table/MemberTable";
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import BackButton from "@/components/button/BackButton";
import EvaluationForm from "@/components/form/EvaluationForm";
import { isFaculty } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RiTeamFill } from "react-icons/ri";
import { FaProjectDiagram } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { FaImages } from "react-icons/fa";

const TeamView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const teamId = (await params).id;
    console.log(teamId)
    const getTeamInfoResult = await getTeamInfo(teamId);

    if(!getTeamInfoResult.success) return (
        <div>
            {getTeamInfoResult.error}
        </div>
    
    )
    const { team } = getTeamInfoResult.data;
    const { error, result } = await getProjectsByTeamId(teamId);
    const user = await currentUser();

    if (!user) redirect('/sigin');

    if (error) return (
        <div>
            lala
            {error}
        </div>
    )

    return (
        <div className="grow shadow-custom p-4 rounded-lg text-xl">
            <div className="flex justify-between mb-4">
                <BackButton />
                {
                    isFaculty(user)
                    &&
                    <EvaluationForm
                        teamId={teamId}
                        evaluatorEmail={user.emailAddresses.at(0)?.emailAddress as string}
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
                    result.length === 0 ?
                        <div className="grow flex items-center justify-center">
                            <span className="text-normal">
                                No project submitted
                            </span>
                        </div>
                        : <>
                            <h1 className="text-normal font-bold">
                                Name
                            </h1>
                            <span className="font-normal mt-2 mb-4">{result[0].projectName}</span>
                            <h1 className="text-normal font-bold">
                                Description
                            </h1>
                            <p className="mt-2 mb-4">
                                {result[0].projectDescription}
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
                    {result.map((item, index) => (
                        <div key={index} className="p-2 mt-2 mb-4">
                            <a target="_blank" href={item.projectMediaUrl} rel="noopener noreferrer">
                                <Image
                                    src={item.projectMediaUrl}
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