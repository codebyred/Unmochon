import { getProjectsByTeamId } from "@/actions/projects";
import { getTeamInfo } from "@/actions/teams";
import MagicButtonContainer from "@/components/button/MagicButtonContainer";
import MemberTable from "@/components/table/MemberTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import Image from "next/image"
import BackButton from "@/components/button/BackButton";
import EvaluationForm from "@/components/form/EvaluationForm";
import { isFaculty } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeamView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const teamId = (await params).id;
    const teamInfo = await getTeamInfo(teamId);
    const {error, result} = await getProjectsByTeamId(teamId);
    const user = await currentUser();

    if(!user) redirect('/sigin');

    if(error) return (
        <div>
            {error}
        </div>
    )


    return (
        <div className="grow shadow-custom p-4 rounded-lg text-xl">
            <div className="flex justify-between mb-4">              
                <BackButton/>
                {
                    isFaculty(user) && <EvaluationForm/>
                }
                
            </div>

            <h1 className="text-2xl font-bold mb-4">
                Team Name:
                <span className="font-normal ml-4">{teamInfo.at(0)?.teamName}</span>
            </h1>
            <h1 className="text-2xl font-bold mb-4">
                Event: 
                <span className="font-normal ml-4">
                {
                    teamInfo.at(0)?.eventName
                    .split(' ')
                    .map((word)=> word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                }
                </span>
            </h1>  

            <h1 className="text-2xl font-bold mb-4">
                Members:
            </h1>
            <div className="mb-4 shadow-custom rounded-lg">
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

            {
                result.length === 0 ?
                <div>No project submitted</div>
                :<><h1 className="text-2xl font-bold mb-4">
                    Project Name: 
                    <span className="font-normal ml-4">{result[0].projectName}</span>
                </h1>
                <h1 className="text-2xl font-bold mb-4">
                    Description:
                </h1>
                <p className="mb-4">
                    {result[0].projectDescription}
                </p>
                <h1 className="text-2xl font-bold mb-4">
                    Screenshots:
                </h1>
                <div className="grid grid-cols-3 gap-4">
                    {result.map((item, index) => (
                        <div key={index} className="border p-2 rounded">

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
            
            </>
            }
        </div>
            
    )
}

export default TeamView;