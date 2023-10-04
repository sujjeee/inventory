"use client"

import * as React from "react"
import { Task, TaskStatus } from '@prisma/client'
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/table/data-table";
import {
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    DotsHorizontalIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "../table/data-table-column-header";


const status: {
    value: Task["status"]
    label: string
}[] = [
        {
            value: "Todo",
            label: "Todo",
        },
        {
            value: "Done",
            label: "Done",
        },
        {
            value: "InProgress",
            label: "InProgress",
        },
        {
            value: "Canceled",
            label: "Canceled",
        },
    ]
interface TasksShellProps {
    data: Task[]
    pageCount: number

}

export function DataTableShell({ data, pageCount }: TasksShellProps) {

    const [isPending, startTransition] = React.useTransition()

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo<ColumnDef<Task, unknown>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-[2px]"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "task",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Task" />
                ),
                cell: ({ row }) => (
                    <div className="w-[80px]">{row.getValue("task")}</div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "title",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Title" />
                ),
                cell: ({ row }) => {
                    return (
                        <div className="flex space-x-2">
                            <span className="max-w-[500px] truncate font-medium">
                                {row.getValue("title")}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: "status",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: ({ row }) => {
                    const task = row.original as Task
                    const status = task.status

                    if (!status) {
                        return null
                    }
                    return (
                        <div className="flex w-[100px] items-center">
                            {status === 'Canceled' ? (
                                <CrossCircledIcon
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            ) : status === 'Done' ? (
                                <CheckCircledIcon
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            ) : status === 'InProgress' ? (
                                <StopwatchIcon
                                    className='mr-2 h-4 w-4 text-muted-foreground'
                                    aria-hidden='true'
                                />
                            ) : status === 'Todo' ? (
                                <QuestionMarkCircledIcon
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            ) : (
                                <CircleIcon
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            )}
                            <span className="capitalize">{status}</span>
                        </div>
                    )
                },
                filterFn: (row, id, value) => {
                    return value instanceof Array && value.includes(row.getValue(id))
                },
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Open menu"
                                variant="ghost"
                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup
                                        value={row.original.status}
                                    // onValueChange={(value) => {
                                    //     startTransition(async () => {
                                    //         await updateTaskLabelAction({
                                    //             id: row.original.id,
                                    //             label: value as Task["status"],
                                    //         })
                                    //     })
                                    // }}
                                    >
                                        {status.map((label) => (
                                            <DropdownMenuRadioItem
                                                key={label.value}
                                                value={label.value}
                                                disabled={isPending}
                                            >
                                                {label.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Delete
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [isPending]

    )
    return (
        <DataTable
            pageCount={pageCount}
            columns={columns}
            data={data}
            filterableColumns={[
                {
                    id: "status",
                    title: "Status",
                    options: Object.values(TaskStatus).map((status) => ({
                        label: status[0]!.toUpperCase() + status.slice(1),
                        value: status,
                    })),
                },
            ]}
            searchableColumns={[
                {
                    id: "title",
                    title: "Title",
                },
            ]}
        />
    )
}