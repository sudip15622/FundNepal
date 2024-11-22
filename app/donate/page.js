import Donate from "@/components/Donate/Donate"
import prisma from "@/config/prisma"

const page = async () => {

  const getFundraiserExamples = async () => {
    const categories = ['Education', 'Family', 'Non Profit', 'Emergency', 'Medical'];
    const fundraisersByCategory = {};

    for (const category of categories) {
      const fundraiser = await prisma.fundraiser.findMany({
        where: { category: category, status: 'Draft' },
        orderBy: { dateRequested: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          goal: true,
          photo: true,
          category: true,
          slug: true,
          status: true,
          totalDonationAmount: true,
          progress: true,
          beneficiary: {
            select: {
              address: true,
            }
          }
        }
      });

      if (fundraiser) {
        fundraisersByCategory[category] = fundraiser;
      }
    }

    return fundraisersByCategory;
  }

  const fundraisers = await getFundraiserExamples();

  return (
    <>
      <Donate fundraisers={fundraisers} />
    </>
  )
}

export default page
