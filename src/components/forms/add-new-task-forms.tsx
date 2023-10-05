"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { taskSchema } from "@/lib/task"

type Inputs = z.infer<typeof taskSchema>

enum TaskStatus {
    Todo,
    canceld,
    InProgress,
    Done
}

export function AddNewTaskForm() {
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<Inputs>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: "Todo",
        },
    })

    function onSubmit(data: Inputs) {
        startTransition(async () => {

            function myStopFunction() {
                console.log("Simple2 form submitted")
                console.log("submitted", data)
                return "hello"
            }
            setTimeout(myStopFunction, 60000);
        })
    }

    const taskStatusKeys = Object.keys(TaskStatus).filter(
        (key) => isNaN(Number(key))
    ) as [keyof typeof TaskStatus];

    return (
        <Form {...form}>
            <form
                className="grid w-full max-w-2xl gap-5"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                        <Input
                            aria-invalid={!!form.formState.errors.task}
                            placeholder="Type product name here."
                            {...form.register("task")}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.task?.message}
                    />
                </FormItem>
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Type product description here."
                            {...form.register("title")}
                        />
                    </FormControl>
                    <UncontrolledFormMessage
                        message={form.formState.errors.title?.message}
                    />
                </FormItem>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value: typeof field.value) =>
                                        field.onChange(value)
                                    }
                                >
                                    <SelectTrigger className="capitalize">
                                        <SelectValue placeholder={field.value} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {taskStatusKeys.map((option) => (
                                                <SelectItem key={option} value={option} className="capitalize">
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    onClick={() =>
                        void form.trigger(["task", "title", "status"])
                    }
                    className="w-fit"
                    disabled={isPending}
                >
                    {isPending && (
                        <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add Product
                    <span className="sr-only">Add Product</span>
                </Button>
            </form>
        </Form>
    )
}