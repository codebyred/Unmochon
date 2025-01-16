import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getFaculty, getStudent } from "@/actions/roles"
import { Button } from "../ui/button"
import Link from "next/link"
import { UnbanButton } from "../button/UnbanTeamButton"
import { BanButton } from "../button/BanTeamButton"
import { DeleteTeamButton } from "../button/DeleteTeamButton"

type Data = {
    teamId: string
    teamName: string
    eventName: string
    isBanned: boolean
}

type TeamTableProps = {
    data: Data[]
    userRole: "Faculty" | "Organizer" | "Student"
}

export const TeamTable = async (props: TeamTableProps) => {

    const {data, userRole} = props;

    console.log(userRole)

    return (
        <Table className="overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.teamId}>
                        <TableCell>{item.teamName}</TableCell>
                        <TableCell>{item.eventName}</TableCell>
                        <TableCell className="flex gap-2">
                            <Button asChild>
                                <Link href={`/teams/${item.teamId}`}>
                                    View
                                </Link>
                            </Button>
                            {
                                userRole === "Faculty" && item.isBanned &&
                                <UnbanButton
                                    teamId={item.teamId}
                                /> 
                            }
                            {
                                userRole === "Faculty" && !item.isBanned &&
                                <BanButton
                                    teamId={item.teamId}
                                />

                            }
                            {
                                userRole === "Faculty" && <DeleteTeamButton
                                    teamId={item.teamId}
                                    label="Kick"
                                />
                            }

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
            </TableFooter>
        </Table>
    )
}



export default TeamTable
