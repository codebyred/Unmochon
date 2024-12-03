import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { deleteTeam } from "@/actions/teams"
import DeleteButton from "./DeleteButton"
import Link from "next/link"


type Data = {
    teamId: string
    teamName: string
    eventName: string
}

type TeamTableProps = {
    data: Data[]
}

export const TeamTable = (props: TeamTableProps) => {
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
                                <DeleteButton
                                    itemId={item.teamId}
                                    serverAction={deleteTeam}
                                />
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
