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
import { Event } from "@/db/schema"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { ImSpinner8 } from "react-icons/im";
import { createEvent, updateEvent } from "@/actions/events"
import { startTransition, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"


const AddEventForm = () => {

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<Event>({
        resolver: zodResolver(Event),
        defaultValues: {
            eventName: "",
            lastDateOfRegistration: new Date(),
            lastDateOfProjectSubmission: new Date(),
            requirements: ""
        }
    })

    const [error, formAction, isPending] = useActionState(createEvent, null)

    useEffect(()=>{
        if(error)
            toast({description: error.toString(), variant:"destructive"})
    }, [error]);


    async function onSubmit(values: Event) {

        const event = {
            lastDateOfRegistration: values.lastDateOfRegistration.toISOString().split('T')[0],
            lastDateOfProjectSubmission: values.lastDateOfProjectSubmission.toISOString().split('T')[0],
            eventName: values.eventName,
            requirements: values.requirements
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(event)) {
            formData.append(key, value);
        }

        startTransition(async () =>
            await formAction(formData)
        );

    }

    return (
        <div className="px-4" data-cy="addEvent-page">
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-row-reverse">
                      
                        <Button
                            className="ml-2.5"
                            variant={'destructive'}
                            type="button"
                            disabled={isPending}
                            onClick={(e) => router.back()}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="mr-2.5"
                            type="submit"
                            disabled={isPending}
                            data-cy="addEvent-btn"
                        >
                            {isPending ? <ImSpinner8 /> : "Add"}
                        </Button>

                    </div>

                    <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col grow">
                                <FormLabel>Event name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} data-cy="eventName" />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col md:flex-row md:items-center md:justify between gap-4">
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
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
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
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
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
                                        className="resize-none"
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
            <Toaster/>
        </div>
    );
}

export default AddEventForm;