import { auth } from '@clerk/nextjs/server'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { FaArrowRightLong } from "react-icons/fa6";

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return <div className='flex items-center justify-center h-screen'>
      <SignIn forceRedirectUrl={"/home"}/>
    </div>
  }

  return <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-xl font-medium'>Welcome!</h1>
      <Link href="/home" className='text-blue-400 font-normal flex items-center'>Go back to dashboard<FaArrowRightLong /> </Link>
    </div>
}