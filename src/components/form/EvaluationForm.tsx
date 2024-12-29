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

const EvaluationForm = () => {

    const form = useForm<InsertEvaluationSchema>({
        resolver: zodResolver(InsertEvaluationSchema),
        defaultValues: {
            teamId: '',
            evaluatorId: '',
            presentationScore: 0,
            outcomeScore: 0,
            technologyScore: 0
        }
    });

    function onSubmit() {

    }

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
                                            <Input {...field} type="number" />
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
                                            <Input {...field} type="number" />
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
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="submit">Submit</Button>
                                </DialogClose>
                            </DialogFooter>

                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default EvaluationForm;