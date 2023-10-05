"use client"

import * as React from "react"
import { Task, TaskStatus, Prisma } from "@prisma/client"
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
import { Icons } from "@/components/icons"
import { taskSchema } from "@/lib/task"
import { toast } from "sonner"
import { catchError } from "@/lib/errors"
import { trpc } from "@/app/_trpc/client"

export function AddTaskForm() {

    const [isPending, startTransition] = React.useTransition()
    const form = useForm<Prisma.InventoryCreateInput>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: "Todo",
        },
    })

    const { mutate: createInventoryTask, isLoading: iscreating } = trpc.createInventoryTask.useMutation();

    function onSubmit(data: Task) {
        console.log("onsubmit started", data)
        // createInventoryTask({
        //     name: data.task,
        //     title: data.title,
        //     status: data.status,
        //     inventoryId: data.inventoryId
        // })

        toast.success("Product added successfully.")

        form.reset()
    }


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
                                            {Object.keys(TaskSchema).map((option) => (
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

// https://railway.app/project/2525d910-d917-44e2-837e-0b3caf294d5a/plugin/acb185a1-e098-4738-8a27-230e5e02384d/Data