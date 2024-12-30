"use client"

import { startTransition, useActionState, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import Link from "next/link";
import { banTeam, unbanTeam, deleteTeam } from "@/actions/teams"
import { useRouter } from "next/navigation";

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
                (user === "organizer" || user === "faculty") && (
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

type DeleteButtonProps = {
    teamId: string
    label?: string
}

function DeleteTeamButton(props: DeleteButtonProps) {

    const teamId = props.teamId;
    const label = props.label;

    const [data, formAction, isPending] = useActionState(deleteTeam, null);

    useEffect(() => {
        if(data?.error){
            toast({
                title: "Error",
                description: data?.error
            });
        }else if(data?.result){
            toast({
                title: "Success",
                description: "Team deleted successfully"
            })
        }
    }, [data])

    function handleClick() {
        startTransition(async() => {
            await formAction(teamId);
            toast({ description: `Team deleted successfully` })
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"destructive"}
                >
                    {label ? label : "Delete"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This team will be permanently removed.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center flex-end gap-4">
                    <DialogClose asChild>
                        <Button
                            variant={"destructive"}
                            onClick={async () => handleClick()}
                        >
                            yes
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>

    );
}

type BanButtonProps = {
    teamId: string
}

function BanButton(props: BanButtonProps) {

    const teamId = props.teamId

    const [data, formAction, isPending] = useActionState(banTeam, null);

    useEffect(() => {
        if(data?.error){
            toast({
                title: "Error",
                description: data?.error
            });
        }else if(data?.result){
            toast({
                title: "Success",
                description: "Team banned successfully"
            })
        }
    }, [data])

    function handleClick() {
        startTransition(async () => {
            await formAction(teamId);
            toast({ 
                title: "Success",
                description: `Team banned successfully` 
            })
        })
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button
                className="bg-orange-500 hover:bg-orange-700"
            >
                Ban
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    This will Ban this team. You can unban them later
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center flex-end gap-4">
                <DialogClose asChild>
                    <Button
                        variant={"destructive"}
                        onClick={() => handleClick()}
                    >
                        yes
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
}

type UnbanButtonProps = {
    teamId: string
}

function UnbanButton(props: UnbanButtonProps) {
    const teamId = props.teamId

    const [data, formAction, isPending] = useActionState(unbanTeam, null);

    useEffect(() => {
        if(data?.error){
            toast({
                title: "Error",
                description: data?.error
            });
        }else if(data?.result){
            toast({
                title: "Success",
                description: "Team unbanned successfully"
            })
        }
    }, [data])

    function handleClick() {
        startTransition(async () => {
            await formAction(teamId);
            toast({ 
                title: "Success",
                description: `Team unbanned successfully` 
            })
        })
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button
                className="bg-orange-500 hover:bg-orange-700"
            >
                Unban
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Unban team?</DialogTitle>
                <DialogDescription>
                    The team will removed from banned list
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center flex-end gap-4">
                <DialogClose asChild>
                    <Button
                        onClick={() => handleClick()}
                    >
                        yes
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>

}
