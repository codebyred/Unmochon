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
import { Input } from "./ui/input"

const AddTeamForm = () => {

    const form = useForm<TeamSchema>({
        resolver: zodResolver(TeamSchema),
        defaultValues: {
            teamName: "",
            members: [{ memberName: '', studentId: '', email: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray<TeamSchema>({ name: "members", control: form.control })

    async function onSubmit(values: TeamSchema) {

        console.log(values);

    }

    return (
        <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row-reverse">

                    <Button
                        className="ml-2.5"
                        variant={'destructive'}
                        type="button"
                    //disabled={isPending}
                    //onClick={(e) => router.back()}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="mr-2.5"
                        type="submit"
                        //disabled={isPending}
                        data-cy="addEvent-btn"
                    >
                        {/* {isPending ? <ImSpinner8 /> : "Add"} */}
                        Save
                    </Button>

                </div>
                <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem>
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
                        <div key={field.id} className="flex flex-col gap-2 shadow-custom rounded-lg mt-2 mb-2 p-2">
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name={`members.${index}.memberName`}
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
                                    name={`members.${index}.studentId`}
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
                <div className="flex items-center justify-center">
                    <Button type="button" onClick={() => append({ memberName: '', studentId: '', email: '' })}>Add member</Button>
                </div>

            </form>
        </Form>
    )

}

export default AddTeamForm