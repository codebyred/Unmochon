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
import TeamTableActions from "./TeamTableActions"
import { isEventOrganizer, isStudent } from "@/lib/auth"

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

    const user = await currentUser();

    if (!user) return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Event Name</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
    )

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
                        <TableCell>
                            <TeamTableActions
                                teamId={item.teamId}
                                user={
                                    isStudent(user)?"student": isEventOrganizer(user)?"organizer":"faculty"
                                }
                                isBanned={item?.isBanned}
                            />
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
