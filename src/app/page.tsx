
import { Shell } from '@/components/shells'
import { Card } from '@/components/ui/card'
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
  const user = await currentUser()
  return (
    <>
      <Shell className="max-w-6xl w-full " variant={'centered'}>
        hello world {user?.firstName}
      </Shell>
    </>
  )
}
