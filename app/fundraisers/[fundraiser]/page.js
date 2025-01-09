import Fundraiser from "@/components/Fundraiser/Fundraiser";
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";
// import { ObjectId } from "mongodb"; // Import ObjectId
import { auth } from "@/auth";
import {getDonationByFundraiserId, getTotalDonationsByFundraiserId} from "@/actions/getDonations";

const page = async ({ params }) => {

  const session = await auth();
  const fundraiserslug = decodeURIComponent(params.fundraiser).trim();

  const fundraiser = await prisma.fundraiser.findUnique({
    where: {
      slug: fundraiserslug,
      status: 'Published',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      },
      beneficiary: {
        select: {
          name: true,
          address: true,
        }
      },
      userId: false,
      createdAt: false,
      updatedAt: false,
      dateRequested: false,
    }
  });

  if (!fundraiser) {
    redirect("/404");
    return null;
  }

  let user;
  if (session) {
    const myUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });
    user = myUser;
  }

  const donations = await getDonationByFundraiserId(fundraiser.id);

  return (
    <>
      <Fundraiser details={fundraiser} user={user} donations={donations}/>
    </>
  );
};

export default page;
