import { redirect } from "next/navigation";
import prisma from "@/config/prisma";
import { auth } from "@/auth";
import DonationStatus from "@/components/DonationStatus/DonationStatus";
import { handleDonation } from "@/actions/handleDonation";

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

    const details = {
        pidx: searchParams.pidx,
        status: searchParams.status,
        purchase_order_id: searchParams.purchase_order_id,
        transaction_id: searchParams.transaction_id,
        amount: searchParams.amount,
        total_amount: searchParams.total_amount,
        mobile: searchParams.mobile,
        purchase_order_name: searchParams.purchase_order_name,
    };

    if (!details.pidx) {
        redirect('/404');
        return null;
    }
    const savedData = await prisma.khaltipayment.findUnique({
        where: {
            pidx: details.pidx
        }
    })
    
    if (!savedData) {
        redirect('/404');
        return null;
    }

    const donation = await handleDonation(details, savedData);
    // console.log(donation);

    if (!donation) {
        redirect('/404');
        return null;
    }

    if (!donation?.success) {
        donation?.error && console.log(donation.error);
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
