import BackButton from "@/components/button/BackButton";
import { currentUser } from "@clerk/nextjs/server";

const History = async() => {


    const user = await currentUser();

    return (
        <div className="p-4 grow flex flex-col shadow-custom rounded-lg">
            <div className="flex justify-between mb-4">
                <BackButton/>
                <div>
                    
                </div>
            </div>
            <div className="shadow-custom rounded-lg p-4">
                <span>{user?.fullName}</span>
            </div>
        </div>
    )
}

export default History;