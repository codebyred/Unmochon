"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { InsertEventSchema, TeamSchema } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Input } from "../ui/input"
import { createTeam } from "@/actions/teams"
import { startTransition, useActionState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "../ui/toaster"
import { ImSpinner8 } from "react-icons/im"
import { useRouter, useSearchParams } from "next/navigation"


const AddTeamForm = () => {

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
    }, [error, toast]);

    async function onSubmit(values: TeamSchema) {

        console.log(values)

        const formData = new FormData()

        formData.append("teamName", values.teamName);
        if (values.eventId) {
            formData.append("eventId", values.eventId);
        }

        // Append array fields
        values.members.forEach((member, index) => {
            formData.append(`members[${index}][id]`, member.id);
            formData.append(`members[${index}][name]`, member.name);
            formData.append(`members[${index}][email]`, member.email);
        });

        startTransition(async () =>
            await formAction(formData)
        );

    }

    return (

        <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>

                <div className="flex flex-col gap-2 shadow-custom rounded-lg mt-2 mb-2 p-2">
                    <div className="flex flex-row-reverse">

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
                            data-cy="addEvent-btn"
                        >
                            {isPending ? <ImSpinner8 /> : "Save"}
                        </Button>

                    </div>
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
                                            <Button type="button" variant={"destructive"} onClick={() => remove(index)}>Remove member</Button>
                                        )
                                    }
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className="flex items-center justify-center">
                    <Button type="button" onClick={() => append({ name: '', id: '', email: '' })}>Add member</Button>
                </div>

            </form>
        </Form>


    )

}

export default AddTeamForm