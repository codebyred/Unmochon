import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Member = {
    memberName: string
    memberEmail: string
    memberId: string
}

type MemberTableProps = {
    data: Member[]
}


const MemberTable = (props: MemberTableProps) => {
    return (
        <Table className="overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead>Member Id</TableHead>
                    <TableHead>Member Email</TableHead>
                    <TableHead>Member Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.data.map((item) => (
                    <TableRow key={item.memberId}>
                        <TableCell>{item.memberId}</TableCell>
                        <TableCell>{item.memberEmail}</TableCell>
                        <TableCell>{item.memberName}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
            </TableFooter>
        </Table>
    )
}

export default MemberTable;