import { auth } from "@/auth";
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";
import Userdash from "./_components/Userdash";
import Admindash from "./_components/Admindash";

const page = async () => {

    const session = await auth();

    if (!session) {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session?.user?.id,
        },
        select: {
            id: true,
            userName: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            phone: true,
            dateJoined: true,
        },
    })
    if (!user) {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }

    if(user.role === 'Admin') {
        return <Admindash user={user} />
    } else {
        return <Userdash user={user} />
    }

}

export default page
