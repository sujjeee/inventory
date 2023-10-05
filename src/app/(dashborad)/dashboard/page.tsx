import { Header } from '@/components/layout/header'
import { Shell } from '@/components/shells'
import { DataTableShell } from '@/components/shells/data-table-shell'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs'
import { Task } from '@prisma/client'
import { redirect } from 'next/navigation'

interface IndexPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export default async function Dashboard({ searchParams }: IndexPageProps) {
    const { id, page, per_page, sort, title, status } = searchParams

    const idString = typeof id === 'string' ? id : undefined;

    const limit = typeof per_page === "string" ? parseInt(per_page) : 10

    const skip = typeof page === "string"
        ? parseInt(page) > 0
            ? (parseInt(page) - 1) * limit
            : 0
        : 0

    const [column, order] = typeof sort === "string"
        ? (sort.split(".") as [
            keyof Task | undefined,
            "asc" | "desc" | undefined,
        ])
        : []

    const statuses = typeof status === "string" ? (status.split(".") as Task["status"][]) : []

    const { allTasks, totalTasks } = await db.$transaction(async (tx) => {

        const allTasks = await tx.task.findMany({
            take: limit,
            skip: skip,
            where: {
                title: typeof title === "string" ? { contains: title } : undefined,
                status: statuses.length > 0 ? { in: statuses } : undefined,
            },
            orderBy: {
                [column ?? 'id']: order ?? 'desc',
            },
        })

        const totalTasks = await tx.task.count({
            where: {
                title: typeof title === "string" ? { contains: title } : undefined,
                status: statuses.length > 0 ? { in: statuses } : undefined,
            },
        })
        return {
            allTasks,
            totalTasks
        }
    })

    const pageCount = Math.ceil(totalTasks / limit)

    const user = await currentUser()

    if (!user || !user.id) redirect('/auth-callback?origin=/')

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!dbUser) redirect('/auth-callback?origin=/')

    return (
        <>
            <Shell className="max-w-6xl w-full" >
                <Header inventoryID={idString} />
                <DataTableShell data={allTasks} pageCount={pageCount} />
            </Shell>
        </>
    )
}
