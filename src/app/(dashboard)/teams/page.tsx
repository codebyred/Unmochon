import StudentTeamView from "@/components/StudentTeamView";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";


const Teams = async() => {

    const user = await currentUser();

    if(!user) return (
        <div className="flex grow items-center justify-center">Please sign in</div>
    )

    return (
        hasPermission(user, "create:team")
            ?
            <StudentTeamView />
            :
            hasPermission(user, "view:allteams")
                ?
                <div>Teams</div>
                :
                <div></div>
    )
}

export default Teams;