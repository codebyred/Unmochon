"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InsertEventSchema } from "@/db/schema"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { ImSpinner8 } from "react-icons/im";
import { deleteEvent, updateEvent } from "@/actions/events"
import { startTransition, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TimePicker } from "@/components/timepicker/Timepicker"
import { toast, useToast } from "@/hooks/use-toast"
import DeleteButton from "../DeleteButton"
import { MagicBackButton } from "@/components/button/MagicBackButton"

type UpdateEventFormProps = {
    event: InsertEventSchema
}

const UpdateEventForm = (props: UpdateEventFormProps) => {

    const { event } = props;
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<InsertEventSchema>({
        resolver: zodResolver(InsertEventSchema),
        defaultValues:
        {
            id: event.id,
            eventName: event.eventName,
            lastDateOfRegistration: event.lastDateOfRegistration,
            lastDateOfProjectSubmission: event.lastDateOfProjectSubmission,
            requirements: event.requirements
        }

    });


    const [error, formAction, isPending] = useActionState(updateEvent, null);

    useEffect(() => {
        if (error)
            toast({ description: error.toString(), variant: "destructive" })
    }, [error, toast]);


    async function onSubmit(values: InsertEventSchema) {

        startTransition(async () => {
            try {
                await formAction(JSON.stringify(values))
                toast({ description: "Event updated successfully" })
            } catch (err) {
                toast({ description: "Could not update event", variant: "destructive" })
            }

        });

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between mb-4">
                    <MagicBackButton type="button"/>
                    <div className="gap-4">
                        <Button
                            className="mr-2.5"
                            type="submit"
                            disabled={isPending}
                            data-cy="updateEvent-btn"
                        >
                            {
                                isPending
                                    ? <div className="flex items-center justify-center"><ImSpinner8 />Updating...</div>
                                    : "Update"
                            }
                        </Button>
                        <DeleteButton
                            itemId={event.id as string}
                            itemName={event.eventName}
                            serverAction={deleteEvent}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify between gap-4">
                    <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col grow">
                                <FormLabel>Event name</FormLabel>
                                <FormControl>
                                    <Input {...field} data-cy="eventName" />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastDateOfRegistration"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Last date for registration</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[320px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                data-cy="registration-date-btn"
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP hh:mm:ss aa")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 h-[380px] overflow-y-auto" align="start">
                                        <div>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                            <div className="p-4 border-t border-border">
                                                <TimePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastDateOfProjectSubmission"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Last date of project submission</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[320px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                data-cy="projectSubmission-date-btn"
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP hh:mm:ss aa")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 h-[380px] overflow-y-auto" align="start">
                                        <div>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                            <div className="p-4 border-t border-border">
                                                <TimePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Requirements</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    className="resize-none min-h-[300px]"
                                    {...field}
                                    data-cy="requirements"
                                />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>


    );
}

type DeleteButtonProps = {
    itemId: string
    itemName: string
}

const DeleteEventButton = (props: DeleteButtonProps) => {

    const [error, formAction, isPending] = useActionState(deleteEvent, null);

    function handleClick() {
        startTransition(() => {
            formAction(props.itemId);
            toast({ description: `${props.itemName} deleted successfully` })
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

export default UpdateEventForm;