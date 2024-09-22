import Fundraiser from "@/components/Fundraiser/Fundraiser";
import prisma from "@/config/prisma";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb"; // Import ObjectId

const page = async ({ params }) => {
  const fundraiserslug = decodeURIComponent(params.fundraiser).trim();

  const fundraiser = await prisma.fundraiser.findUnique({
    where: {
      slug: fundraiserslug,
    },
    select: {
        id: true,
        slug: true,
    }
  });

  if (!fundraiser) {
    redirect("/404");
    return null;
  }

  const fundraiserDetails = await prisma.fundraiser.findUnique({
    where: {id: fundraiser.id},
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
            }
        },
        contactInfo: {
            select: {
                address: true,
            }
        },
        userId: false,
        createdAt: false,
        updatedAt: false,
        dateRequested: false,
    }
  });

  return (
    <>
      <Fundraiser details={fundraiserDetails} />
    </>
  );
};

export default page;
