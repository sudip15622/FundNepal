import Getstarted from "@/components/Getstarted/Getstarted"

import { auth } from "@/auth"
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";

const page = async() => {

  const session = await auth();

  if(!session) {
    redirect("/signin?redirectTo=/getstarted");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {id: session?.user?.id},
  })

  if(!user) {
    redirect("/signin?redirectTo=/getstarted");
    return null;
  }

  return (
    <>
      <Getstarted user={user}/>
    </>
  )
}

export default page
