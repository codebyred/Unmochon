"use client"

import { Button } from "./ui/button";
import { deleteEvent } from "@/actions/events";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type DeleteButtonProps = {
    itemId: string
}

const DeleteButton = (props: DeleteButtonProps) => {

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
                        onClick={async () => await deleteEvent(props.itemId)}
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