import { Shell } from '@/components/shells'
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
  const user = await currentUser()


  return (
    <Shell variant={"centered"}>
      hello world {user?.firstName}
    </Shell>
  )
}
