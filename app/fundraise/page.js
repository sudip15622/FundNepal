import Fundraise from "@/components/Fundraise/Fundraise"
import prisma from "@/config/prisma"

const page = async () => {

  const getFundraiserExamples = async () => {
    const categories = ['Education', 'Family', 'Non Profit', 'Emergency', 'Medical'];
    const fundraisersByCategory = [];

    for (const category of categories) {
      const fundraiser = await prisma.fundraiser.findFirst({
        where: { category },
        orderBy: { dateRequested: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          goal: true,
          photo: true,
          category: true,
          contactInfo: {
            select: {
              address: true,
            }
          }
        }
      });

      if (fundraiser) {
        fundraisersByCategory.push(fundraiser);
      }
    }

    return fundraisersByCategory;
  }

  const fundraiserExamples = await getFundraiserExamples();

  return (
    <>
      <Fundraise examples={fundraiserExamples} />
    </>
  )
}

export default page
