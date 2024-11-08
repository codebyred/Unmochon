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
import { Event } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"

import { createEvent } from "@/actions/events"
import { startTransition, useActionState } from "react"

const AddEvent = () => {

    const form = useForm<Event>({
        resolver: zodResolver(Event),
        defaultValues: {
            eventName: "",
            lastDateOfRegistration: new Date(),
            lastDateOfProjectSubmission: new Date(),
            requirements: ""
        },
    });

    const [error, formAction, isPending] = useActionState(createEvent, null);

    console.log(error);

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

        startTransition(async ()=>
            await formAction(formData)
        );
        
    }

    return (
        <div className="px-4">
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-row-reverse">
                        <Button className="ml-2.5" disabled={isPending}>Cancel</Button>
                        <Button className="mr-2.5" type="submit" disabled={isPending}>Add</Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col grow">
                                <FormLabel>Event name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
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
        </div>
    );
}

export default AddEvent;