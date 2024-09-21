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
          goal: true,
          photo: true,
          category: true,
        }
      });

      if (fundraiser) {
        fundraisersByCategory.push(fundraiser);
      }
    }

    return fundraisersByCategory;
  }

  const fundraiserExamples = await getFundraiserExamples();

  const getImageUrl = (myfile) => {
    const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
    return imageUrl;
  }
  let newExamples = [];

  if (fundraiserExamples) {
    for (let i = 0; i < fundraiserExamples.length; i++) {
      const element = fundraiserExamples[i];
      const newFundraiser = {
        id: element.id,
        title: element.title,
        description: element.description,
        goal: element.goal,
        imageUrl: getImageUrl(element.photo),
        category: element.category,
      }

      newExamples.push(newFundraiser);
    }
  }


  return (
    <>
      <Fundraise examples={newExamples} />
    </>
  )
}

export default page
