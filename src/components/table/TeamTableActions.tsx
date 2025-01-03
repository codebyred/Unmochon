"use client"

import { BanButton } from "../button/BanTeamButton"
import { UnbanButton } from "../button/UnbanTeamButton"
import { DeleteTeamButton } from "../button/DeleteTeamButton"
import { Button }from "../ui/button"
import Link from "next/link"

type User = "organizer" | "student" | "faculty"

type TeamTableActionsProps = {
    teamId: string
    user: User
    isBanned: boolean
}

const TeamTableActions = (props: TeamTableActionsProps) => {

    const teamId = props.teamId;
    const user = props.user;
    const isBanned = props.isBanned;

    return (
        <div className="flex gap-2">
            <Button asChild>
                <Link href={`/teams/${teamId}`}>
                    View
                </Link>
            </Button>
            {
                user === "organizer" && (
                    <>
                        {
                            isBanned?
                            <UnbanButton
                            teamId={teamId}
                            />:
                            <BanButton
                            teamId={teamId}
                            />
                        }

                        <DeleteTeamButton
                            teamId={teamId}
                            label="Kick"
                        />
                    </>
                ) 
            }
        </div>
    )
}

export default TeamTableActions