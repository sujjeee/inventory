
import { Shell } from '@/components/shells'
import { currentUser } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()
  return (
    <Shell className="max-w-6xl w-full " variant={'centered'}>
      {user ? (
        <>
          Hello {user.firstName} 👋
          <Link href="/dashboard" className="underline text-blue-500">
            Visit your dashboard.
          </Link>
        </>
      ) : (
        'Hello Guest'
      )}
    </Shell>
  )
}
