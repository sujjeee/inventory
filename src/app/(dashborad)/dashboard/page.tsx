import { Shell } from '@/components/shells'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
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
            <Shell className="max-w-6xl w-full " variant={"centered"}>
                hello world {user?.firstName}
            </Shell>
        </>
    )
}
