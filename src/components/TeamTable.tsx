import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


type Data = {
    teamId: string
    teamName:string
    eventName: string
}

type TeamTableProps = {
    data: Data[]
}

export const TeamTable = (props: TeamTableProps)=>{
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>TeamName</TableHead>
                    <TableHead>Event Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.data.map((item) => (
                    <TableRow key={item.teamId}>
                        <TableCell>{item.teamName}</TableCell>
                        <TableCell>{item.eventName}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
            </TableFooter>
        </Table>
    )
}

export default TeamTable
