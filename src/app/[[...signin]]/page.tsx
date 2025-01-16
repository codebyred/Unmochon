import { auth } from '@clerk/nextjs/server'
import { SignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return <div className='flex flex-col items-center justify-center h-screen'>
      <Image
        src="/unmochon_logo.png"
        width={150}
        height={150}
        alt="Unmochon Logo"
      />
      <SignIn forceRedirectUrl={"/home"} />
    </div>
  }

  redirect("/home");
}