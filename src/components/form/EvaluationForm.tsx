"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { InsertEvaluationSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { evaluateTeam } from "@/actions/teams";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type EvaluationFormProps = {
    teamId: string
    evaluatorEmail: string
}

const EvaluationForm = (props: EvaluationFormProps) => {

    const { teamId, evaluatorEmail } = props;

    const form = useForm<InsertEvaluationSchema>({
        resolver: zodResolver(InsertEvaluationSchema),
        defaultValues: {
            presentationScore: 0,
            outcomeScore: 0,
            technologyScore: 0
        },
        mode: "onSubmit"
    });

    const [result, formAction, isPending] = useActionState(evaluateTeam, null);

    useEffect(() => {
        if (result && result?.success) {
            toast({
                title: "Success",
                description: "Evaluation submitted successfully"
            })
        } else if (result && result?.error) {
            toast({
                title: "Error",
                description: `${result?.error}`,
                variant: "destructive"
            })
        }
    }, [result])

    function onSubmit(data: InsertEvaluationSchema) {

        const evaluation = {
            teamId: teamId,
            evaluatorEmail: evaluatorEmail,
            ...data
        }

        startTransition(async()=> {
            await formAction(JSON.stringify(evaluation));
        })
        

    }

    if(isPending) return (
        <div className="flex grow justify-center items-center min-h-[70vh]">
            <Loader2 className="size-24 animate-spin" />
        </div>
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Evaluation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Evaluation Form</DialogTitle>
                    <DialogDescription>
                        Fill the forms for evaluation
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="presentationScore"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Presentation Score</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="outcomeScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Outcome Score</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="technologyScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technology Score</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="sm:justify-start">

                                <Button type="submit">Submit</Button>

                            </DialogFooter>

                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default EvaluationForm;