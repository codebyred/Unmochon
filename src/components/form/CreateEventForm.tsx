"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { addDays, format } from "date-fns"
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
import { createEvent } from "@/actions/events"
import { startTransition, useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { TimePicker } from "@/components/timepicker/Timepicker"
import { MagicBackButton } from "@/components/MagicBackButton"



const AddEventForm = () => {

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<InsertEventSchema>({
        resolver: zodResolver(InsertEventSchema),
        defaultValues: {
            eventName: "",
            lastDateOfRegistration: undefined,
            lastDateOfProjectSubmission: undefined,
            requirements: ""
        }
    })

    const [error, formAction, isPending] = useActionState(createEvent, null)

    useEffect(() => {
        if (error)
            toast({ description: error.toString(), variant: "destructive" })
    }, [error, toast]);


    async function onSubmit(values: InsertEventSchema) {

        startTransition(async () => {
            try{
                await formAction(JSON.stringify(values));
                toast({ description: "Event created successfully" })
            }catch(err){
                toast({description:"Could not create event", variant:"destructive"})
            }

        });

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between mb-4">
                    <MagicBackButton type="button"/>
                    <Button
                        type="submit"
                        disabled={isPending}
                        data-cy="addEvent-btn"
                    >
                        {
                            isPending 
                            ? <div className="flex items-center justify-center"><ImSpinner8 /> Creating...</div>
                            : "Create"
                        }
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
                                <FormLabel>Last date of registration</FormLabel>
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

export default AddEventForm;