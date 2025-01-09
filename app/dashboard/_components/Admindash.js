import prisma from "@/config/prisma";
import { redirect } from "next/navigation";
import Adminpage from "@/components/Adminpage/Adminpage";

const Admindash = async ({user}) => {

    if (!user) {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }

    if(user.role !== 'Admin') {
        redirect('/signin?redirectTo=/dashboard');
        return null;
    }

    const totalDonations = await prisma.donation.count()

    const totalFundraisers = await prisma.fundraiser.count()
    const totalUsers = await prisma.user.count()
    const totalReports = await prisma.report.count()

    const overview = {
        totalDonations: totalDonations,
        totalFundraisers: totalFundraisers,
        totalUsers: totalUsers,
        totalReports: totalReports,
    }

    const allFundraisers = await prisma.fundraiser.findMany({
        orderBy: {
            datePublished: 'desc',
        }
    })

    const allDonations = await prisma.donation.findMany({
        include: {
            fundraiser: {
                select: {
                    id: true,
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

    const allUsers = await prisma.user.findMany({
        orderBy: {
            dateJoined: 'desc',
        }
    })

    return (
        <>
            <Adminpage user={user} overview={overview}/>
        </>
    )
}

export default Admindash
