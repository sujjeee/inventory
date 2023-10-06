
import { Shell } from '@/components/shells'
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
  const user = await currentUser()
  return (
    <Shell className="max-w-6xl w-full " variant={'centered'}>
      {user ? `Hello ${user.firstName}` : 'Hello Guest'}
    </Shell>
  )
}
