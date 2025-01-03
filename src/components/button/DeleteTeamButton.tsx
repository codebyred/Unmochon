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


type DeleteButtonProps = {
    teamId: string
    label?: string
}

export function DeleteTeamButton(props: DeleteButtonProps) {

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