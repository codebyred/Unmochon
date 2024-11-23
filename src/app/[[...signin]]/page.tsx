import { auth } from '@clerk/nextjs/server'
import { SignIn } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return <div className='flex items-center justify-center h-screen'>
      <SignIn forceRedirectUrl={"/home"}/>
    </div>
  }

  return <div>Welcome!</div>
}