"use client"

import type {
    DataTableFilterableColumn,
    DataTableSearchableColumn,
} from "@/types"
import { Cross2Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/table/data-table-view-option"
import { cn } from "@/lib/utils"
import Link from "next/link"
import AddNewTask from "../buttons/add-new-task"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    filterableColumns?: DataTableFilterableColumn<TData>[]
    searchableColumns?: DataTableSearchableColumn<TData>[]
}

export function DataTableToolbar<TData>({
    table,
    filterableColumns = [],
    searchableColumns = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const deleteRowsAction = true

    return (
        <div className="flex items-center justify-between py-1.5">
            <div className="flex flex-1 items-center space-x-2">
                {searchableColumns.length > 0 &&
                    searchableColumns.map(
                        (column) =>
                            table.getColumn(column.id ? String(column.id) : "") && (
                                <Input
                                    key={String(column.id)}
                                    placeholder={`Filter ${column.title}...`}
                                    value={
                                        (table
                                            .getColumn(String(column.id))
                                            ?.getFilterValue() as string) ?? ""
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn(String(column.id))
                                            ?.setFilterValue(event.target.value)
                                    }
                                    className="h-8 w-[150px] lg:w-[250px]"
                                />
                            )
                    )}
                {filterableColumns.length > 0 &&
                    filterableColumns.map(
                        (column) =>
                            table.getColumn(column.id ? String(column.id) : "") && (
                                <DataTableFacetedFilter
                                    key={String(column.id)}
                                    column={table.getColumn(column.id ? String(column.id) : "")}
                                    title={column.title}
                                    options={column.options}
                                />
                            )
                    )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
                    <Button
                        aria-label="Delete selected rows"
                        variant="outline"
                        size="sm"
                        className="h-8"
                    // onClick={(event) => {
                    //   startTransition(() => {
                    //     table.toggleAllPageRowsSelected(false)
                    //     deleteRowsAction(event)
                    //   })
                    // }}
                    // disabled={isPending}
                    >
                        <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete
                    </Button>
                ) : (
                    <AddNewTask />
                )}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}