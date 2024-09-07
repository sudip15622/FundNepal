import Getstarted from "@/components/Getstarted/Getstarted"

import { auth } from "@/auth"
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";

const page = async() => {

  const session = await auth();

  if(!session) {
    redirect("/sign-in?redirectTo=/getstarted");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {id: session?.user?.id}
  })

  if(!user) {
    redirect("/sign-in?redirectTo=/getstarted");
    return null;
  }

  return (
    <>
      <Getstarted />
    </>
  )
}

export default page
