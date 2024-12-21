import ProjectForm from "@/components/form/ProjectForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StepOneProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const StepOne: React.FC<StepOneProps> = async({ searchParams }) => {

    const eventId = (await searchParams)?.eventId;

    return (
        <div className="shadow-custom p-4 rounded-lg grow">
            <ProjectForm/>
        </div>
    );
}

export default StepOne;