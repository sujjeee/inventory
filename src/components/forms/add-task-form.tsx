"use client"

import * as React from "react"
import { Task, TaskStatus } from "@prisma/client"
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

export function AddTaskForm() {

    const [isPending, startTransition] = React.useTransition()
    const form = useForm<Task>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: "Todo",
        },
    })



    return (
        <Form {...form}>
            <form
                className="grid w-full max-w-2xl gap-5"
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
                                            {Object.values(TaskStatus).map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                        className="capitalize"
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full gap-2">
                    <Button
                        variant={"outline"}
                        onClick={() =>
                            void form.trigger(["task", "title", "status"])
                        }
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending && (
                            <Icons.spinner
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Cancel
                        <span className="sr-only">Cancel</span>
                    </Button>
                    <Button
                        onClick={() =>
                            void form.trigger(["task", "title", "status"])
                        }
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending && (
                            <Icons.spinner
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Add Product
                        <span className="sr-only">Add Product</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}