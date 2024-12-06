import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteTeam } from "@/actions/teams"
import DeleteButton from "@/components/DeleteButton"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { hasPermission } from "@/lib/auth"


type Data = {
    teamId: string
    teamName: string
    eventName: string
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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Event Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.data.map((item) => (
                    <TableRow key={item.teamId}>
                        <TableCell>{item.teamName}</TableCell>
                        <TableCell>{item.eventName}</TableCell>
                        <TableCell>
                            <div className="flex flex-row-reverse gap-2">
                                {
                                    hasPermission(user, "delete:team")
                                    &&
                                    <DeleteButton
                                        itemId={item.teamId}
                                        itemName="Team"
                                        serverAction={deleteTeam}
                                    />}
                                <Button asChild>
                                    <Link href={`/teams/${item.teamId}`}>
                                        View
                                    </Link>
                                </Button>
                            </div>
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
