// import { auth } from "@/auth";
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard/Dashboard";

const Userdash = async ({user}) => {

    if (!user) {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }

    if(user.role !== 'User') {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }

    const totalDonations = await prisma.donation.count({
        where: {
            userId: user.id,
        }
    })

    const totalFundraisers = await prisma.fundraiser.count({
        where: {
            userId: user.id,
        }
    })

    const overview = {
        totalDonations: totalDonations,
        totalFundraisers: totalFundraisers,
    }

    const allFundraisers = await prisma.fundraiser.findMany({
        where: {
            userId: user.id,
            status: 'Published',
        },
        orderBy: {
            datePublished: 'desc',
        }
    })

    const allDonations = await prisma.donation.findMany({
        where: {
            userId: user.id,
        },
        include: {
            fundraiser: {
                select: {
                    title: true,
                    slug: true,
                    photo: true,
                }
            }
        },
        orderBy: {
            dateDonated: 'desc',
        }
    })

    return (
        <>
            <Dashboard user={user} overview={overview} allFundraisers={allFundraisers} allDonations={allDonations}/>
        </>
    )
}

export default Userdash
