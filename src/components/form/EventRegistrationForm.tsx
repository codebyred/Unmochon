"use client"

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
import { TeamSchema } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Input } from "../ui/input"
import { createTeam } from "@/actions/teams"
import { startTransition, useActionState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { ImSpinner8 } from "react-icons/im"
import { useRouter, useSearchParams } from "next/navigation"
import { MagicBackButton } from "../button/MagicBackButton"
import { FaPlus } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { Separator } from "@/components/ui/separator"

const EventRegistrationForm = () => {

    const router = useRouter()
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const eventName = searchParams.get('eventName');

    const form = useForm<TeamSchema>({
        resolver: zodResolver(TeamSchema),
        defaultValues: {
            eventId: eventId as string,
            teamName: "",
            members: [{ name: '', id: '', email: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray<TeamSchema>({ name: "members", control: form.control })

    const [error, formAction, isPending] = useActionState(createTeam, null)

    useEffect(() => {
        if (error)
            toast({ description: error.toString(), variant: "destructive" })
    }, [error]);

    async function onSubmit(values: TeamSchema) {


        startTransition(async () =>{
            try{
                await formAction(JSON.stringify(values))
                toast({description: "Team registration completed"})
            }catch(err){
                toast({description: "Could not register", variant:"destructive"})
            }

        });

    }

    return (

        <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">   
                        <MagicBackButton type="button"/>
                        <Button
                            type="submit"
                            disabled={isPending}
                            data-cy="addEvent-btn"
                        >
                        {
                            isPending 
                            ? <div className="flex items-center justify-center"><ImSpinner8/>Creating...</div>
                            : "Submit"
                        }
                        </Button>
                    </div>
                    <span className="text-4xl">
                        {eventName}
                    </span>
                    <Separator className="my-4"/>
                    <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {
                        fields.map((field, index) => (
                            <div key={field.id} className="">
                                <div className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`members.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Member Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="w-full" />
                                                </FormControl>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`members.${index}.id`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Student Id</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="w-full" />
                                                </FormControl>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`members.${index}.email`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="w-full" />
                                                </FormControl>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    {
                                        index > 0 && (
                                            <Button 
                                                className="w-12 h-12 rounded-full"
                                                type="button" 
                                                variant={"destructive"} 
                                                onClick={() => remove(index)}
                                            >
                                                    <ImCross/>
                                            </Button>
                                        )
                                    }
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className="flex items-center justify-center">
                    <Button 
                        className="rounded-full w-12 h-12"
                        type="button" 
                        onClick={() => append({ name: '', id: '', email: '' })}>
                        <FaPlus/>
                    </Button>
                </div>
            </form>
        </Form>


    )

}

export default EventRegistrationForm