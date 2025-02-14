"use client"

import { deleteEvent } from "@/actions/events";
import { toast } from "@/hooks/use-toast";
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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
    itemId: string
}

export const DeleteEventButton = (props: DeleteButtonProps) => {

    const router = useRouter();

    const [result, formAction, isPending] = useActionState(deleteEvent, null);

    useEffect(() => {
        if (result && !result.success){
            toast({
                title: "Error",
                description: result.error.message, 
                variant: "destructive" 
            })
        }
        else if( result && result.success) {
            toast({
                title: "Success",
                description: "Event deleted successfully"
            })
            router.push(`/events`)
        }
        
    }, [result, router]);

    function handleClick() {
        startTransition(async () => {
            await formAction(props.itemId);
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

