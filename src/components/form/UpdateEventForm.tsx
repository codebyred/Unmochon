"use client"

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
import { updateEvent } from "@/actions/events"
import { startTransition, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TimePicker } from "@/components/timepicker/Timepicker"
import { useToast } from "@/hooks/use-toast"

type UpdateEventFormProps = {
    id: string
    eventName: string
    lastDateOfRegistration: Date
    lastDateOfProjectSubmission: Date
    requirements: string
}

const UpdateEventForm = (props: UpdateEventFormProps) => {

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<InsertEventSchema>({
        resolver: zodResolver(InsertEventSchema),
        defaultValues:
        {
            id: props.id.length >= 0 ? props.id : "",
            eventName: props.eventName ? props.eventName : "",
            lastDateOfRegistration: props.lastDateOfRegistration ? props.lastDateOfRegistration : new Date(),
            lastDateOfProjectSubmission: props.lastDateOfProjectSubmission ? props.lastDateOfProjectSubmission : new Date(),
            requirements: props.requirements ? props.requirements : ""
        }

    });


    const [error, formAction, isPending] = useActionState(updateEvent, null);

    useEffect(() => {
        if (error)
            toast({ description: error.toString(), variant: "destructive" })
    }, [error, toast]);


    async function onSubmit(values: InsertEventSchema) {

        const event = {
            id: props.id ? props.id : "",
            lastDateOfRegistration: values.lastDateOfRegistration.toISOString().split('T')[0],
            lastDateOfProjectSubmission: values.lastDateOfProjectSubmission.toISOString().split('T')[0],
            eventName: values.eventName,
            requirements: values.requirements
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(event)) {
            formData.append(key, value);
        }

        startTransition(async () =>{
            await formAction(formData)
            toast({description: "Event updated successfully"})
        });

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row-reverse mb-4">
                    <Button
                        className="ml-2.5"
                        variant={'destructive'}
                        type="button"
                        disabled={isPending}
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="mr-2.5"
                        type="submit"
                        disabled={isPending}
                        data-cy="updateEvent-btn"
                    >
                        {isPending ? <ImSpinner8 /> : "Update"}
                    </Button>
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
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                data-cy="registration-date-btn"
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
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
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                data-cy="projectSubmission-date-btn"
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
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

export default UpdateEventForm;