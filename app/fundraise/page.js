import Fundraise from "@/components/Fundraise/Fundraise"
import prisma from "@/config/prisma"
import { getTotalDonationsByFundraiserId } from "@/actions/getDonations"

const page = async () => {

  const getFundraiserExamples = async () => {
    const categories = ['Education', 'Family', 'Non Profit', 'Emergency', 'Medical'];
    const fundraisersByCategory = [];

    for (const category of categories) {
      const fundraiser = await prisma.fundraiser.findFirst({
        where: { category: category, status: 'Draft' },
        orderBy: { dateRequested: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          goal: true,
          photo: true,
          category: true,
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
        const progressPercent = (Math.round((parseInt(fundraiser.totalDonationAmount, 10) / parseInt(fundraiser.goal, 10)) * 100));
        fundraisersByCategory.push({
          ...fundraiser,
          donationProgress: progressPercent,
        });
      }
    }

    return fundraisersByCategory;
  }

  const fundraiserExamples = await getFundraiserExamples();

  

  return (
    <>
      <Fundraise examples={fundraiserExamples}/>
    </>
  )
}

export default page
