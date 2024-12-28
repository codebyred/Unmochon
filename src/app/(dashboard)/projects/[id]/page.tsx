import { getProjectsByProjectId } from "@/actions/projects";
import BackButton from "@/components/button/BackButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const ViewProject = async({
    params,
}: {
    params: Promise<{ id: string }>
}) =>{

    const projectId = (await params).id;
    const { error, result } = await getProjectsByProjectId(projectId);

    if(error) return (
        <div>
            {error}
        </div>
    )
    
    if(result?.length === 0) return (
        <div>
            No project found
        </div>
    )


    return (
        <div className="grow shadow-custom p-4 rounded-lg">
            <div className="mb-4 flex justify-between">
                <BackButton/>
                <Button>
                    Evaluate
                </Button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Project Name: {result[0].projectName}</h1>
            <p className="mb-4">{result[0].projectDescription}</p>
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
        </div>
    )
}

export default ViewProject;