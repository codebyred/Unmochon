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
import { InsertProjectSchema } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { startTransition, useActionState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { ImSpinner8 } from "react-icons/im"
import { useRouter, useSearchParams } from "next/navigation"
import { MagicBackButton } from "../button/MagicBackButton"
import { Textarea } from "@/components/ui/textarea"
import { createProject } from "@/actions/projects"

const ProjectForm = () => {

    const router = useRouter()
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');

    if (!eventId) return <div>No event found</div>

    const form = useForm<InsertProjectSchema>({
        resolver: zodResolver(InsertProjectSchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });

    const [result, formAction, isPending] = useActionState(createProject, null)

    useEffect(() => {
        if (result?.error)
            toast({ 
                title: "Error",
                description: `${result.error}`, 
                variant: "destructive" 
            })
        
        else if(result?.projectId) {
            toast({ 
                title: "Success",
                description: "Project submitted successfully" 
            })
            router.push(`/projects/submission/step-two?projectId=${result?.projectId}`)
        } 

    }, [result]);

    async function onSubmit(values: InsertProjectSchema) {

        const data = {
            ...values,
            eventId: eventId,
        }

        startTransition(async() => {
            await formAction(JSON.stringify(data))
        })
    }

    return (
        <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center mb-4">
                    <MagicBackButton type="button" />
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {
                            isPending
                                ? <div className="flex items-center justify-center"><ImSpinner8 />Submitting...</div>
                                : "Submit"
                        }
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    className="resize-none min-h-[300px]"
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
    )
}

export default ProjectForm