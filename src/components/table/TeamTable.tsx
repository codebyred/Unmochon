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
}

export const TeamTable = async (props: TeamTableProps) => {

    const user = await currentUser()

    if (!user) redirect("/sigin")

    const studentResult = await getStudent(user);
    const facultyResult = await getFaculty(user);

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
                {props.data.map((item) => (
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
                                facultyResult.success && item.isBanned?
                                    <UnbanButton
                                        teamId={item.teamId}
                                    /> :
                                    <BanButton
                                        teamId={item.teamId}
                                    />

                            }
                            {
                                facultyResult.success && <DeleteTeamButton
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
