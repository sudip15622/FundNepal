import Donate from "@/components/Donate/Donate"
import prisma from "@/config/prisma"

const page = async () => {

  const getImageUrl = (myfile) => {
    const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
    return imageUrl;
  }

  const getFundraiserExamples = async () => {
    const categories = ['Education', 'Family', 'Non Profit', 'Emergency', 'Medical'];
    const fundraisersByCategory = {};

    for (const category of categories) {
      const fundraiser = await prisma.fundraiser.findMany({
        where: { category },
        orderBy: { dateRequested: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
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
        for (let i = 0; i < fundraiser.length; i++) {
          const element = fundraiser[i];
          const newFundraiser = {
            id: element.id,
            title: element.title,
            goal: element.goal,
            imageUrl: getImageUrl(element.photo),
            category: element.category,
            address: element.contactInfo.address
          }

          if (fundraisersByCategory[category]) {
            fundraisersByCategory[category].push(newFundraiser);
          } else {
            fundraisersByCategory[category] = [newFundraiser];
          }
        }
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
