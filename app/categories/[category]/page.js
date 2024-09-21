import { redirect } from "next/navigation";
import Category from "@/components/Category/Category";

const page = ({ params }) => {

    const title = decodeURIComponent(params.category).trim();

    const validCategories = ['education', 'family', 'nonprofit', 'emergency', 'medical'];

    if (!(validCategories.includes(title.toLowerCase()))) {
        redirect('/404');
        return null;
    }

    const getTitle = (str) => {
        if (str === 'nonprofit') {
            return 'Non Profit'
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }

    const coverImages = {
        education: "https://img.freepik.com/free-photo/young-woman-casual-peach-sweater-backpack-isolated-green-olive-color-wall_343596-5324.jpg?uid=R158132741&ga=GA1.1.688227825.1726578426&semt=ais_hybrid",
        medical: "https://img.freepik.com/free-photo/medium-shot-doctor-discussing-with-patient_23-2148973462.jpg?uid=R158132741&ga=GA1.1.688227825.1726578426&semt=ais_hybrid",
        emergency: "https://img.freepik.com/free-photo/full-ength-portrait-troubled-young-man_171337-9305.jpg?uid=R158132741&ga=GA1.1.688227825.1726578426&semt=ais_hybrid",
        family: "https://img.freepik.com/free-photo/full-shot-family-living-countryside_23-2150642425.jpg?uid=R158132741&ga=GA1.1.688227825.1726578426&semt=ais_hybrid",
        nonprofit: "https://img.freepik.com/free-photo/hand-with-coins-economy-jar_23-2148568040.jpg?uid=R158132741&ga=GA1.1.688227825.1726578426&semt=ais_hybrid",
    }


    const details = {
        title: getTitle(title),
        coverImage: coverImages[title],
    }

    return (
        <>
            <Category details={details} />
        </>
    )
}

export default page
