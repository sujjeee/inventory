import React from 'react'
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddTaskForm } from '../forms/add-task-form'
import { cn } from '@/lib/utils'
import { PlusCircledIcon } from '@radix-ui/react-icons'

export default function AddNewTask() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={cn(
                        buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "h-8",
                        })
                    )}
                >
                    <PlusCircledIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    New
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new item</DialogTitle>
                    <DialogDescription>
                        Enter the details of your new item.
                    </DialogDescription>
                </DialogHeader>
                <AddTaskForm />
            </DialogContent>
        </Dialog>
    )
}
