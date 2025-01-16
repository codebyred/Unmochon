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

type UnbanButtonProps = {
    teamId: string
}

export function UnbanButton(props: UnbanButtonProps) {
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