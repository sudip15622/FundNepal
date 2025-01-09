import { redirect } from "next/navigation";
import prisma from "@/config/prisma";
import { auth } from "@/auth";
import DonationStatus from "@/components/DonationStatus/DonationStatus";
import { handleEsewaDonation } from "@/actions/handleDonation";

const page = async ({ searchParams }) => {

    const session = await auth();
    if (!session) {
        redirect('/404');
        return null;
    }
    if (session) {
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user?.id,
            }
        })
        if (!user) {
            redirect('/404');
            return null;
        }
    }

    const data = searchParams.data;
    let details;
    try {
        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        details = JSON.parse(decodedData);

    } catch (error) {
        console.error('Failed to decode and parse data:', error);
        redirect('/404');
        return null;
    }

    console.log(details);

    if (!details) {
        redirect('/404');
        return null;
    }
    if (!details.signature) {
        redirect('/404');
        return null;
    }

    const savedData = await prisma.esewapayment.findUnique({
        where: {
            signature: details.transaction_uuid,
        }
    })

    console.log(savedData);


    if (!savedData) {
        redirect('/404');
        return null;
    }

    const donation = await handleEsewaDonation(details, savedData);

    if (!donation) {
        redirect('/404');
        return null;
    }

    if (!donation?.success) {
        redirect('/404');
        return null;
    }

    return (
        <>
            <DonationStatus status={details.status} fundraiser={savedData.fundraiserSlug} />
        </>
    )
};

export default page;
