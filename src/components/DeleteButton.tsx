"use client"

import { startTransition, useActionState } from "react";
import { Button } from "./ui/button";
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

type DeleteButtonProps = {
    itemId: string
    serverAction: (previousState:unknown,id: string) => Promise<void>
}

const DeleteButton = (props: DeleteButtonProps) => {

    const [error, formAction, isPending] = useActionState(props.serverAction, null);

    function handleClick() {
        startTransition(()=> {
            formAction(props.itemId);
            toast({description: "Event deleted successfully"})
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"destructive"}
                >
                    delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this item.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center flex-end gap-4">
                    <Button
                        variant={"destructive"}
                        onClick={async () => handleClick()}
                    >
                        yes
                    </Button>
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

export default DeleteButton;