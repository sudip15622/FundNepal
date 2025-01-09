"use server"
import prisma from "@/config/prisma";
import { getTotalDonationsByFundraiserId } from "./getDonations";
import { saveBankDetails } from "./handleBank";

const handleDonationPayment = async (details, savedData) => {

    try {

        // console.log(details);
        console.log(savedData);

        const data = {
            pidx: details.pidx,
            status: details.status,
            purchase_order_id: details.purchase_order_id,
            purchase_order_name: details.purchase_order_name,
            transaction_id: details.transaction_id,
            donationAmount: savedData.donationAmount,
            serviceCharge: savedData.serviceCharge,
            totalAmount: savedData.totalAmount,
            fundraiserId: savedData.fundraiserId,
            donorId: savedData.donorId,
            fundraiserSlug: savedData.fundraiserSlug,
        }

        const user = await prisma.user.findUnique({
            where: {
                id: data.donorId
            }
        });
        if (!user) {
            return {
                success: false,
                error: "User not found",
            }
        }
        const fundraiser = await prisma.fundraiser.findUnique({
            where: {
                id: data.fundraiserId
            }
        });
        if (!fundraiser) {
            return {
                success: false,
                error: "Fundraiser not found",
            }
        }

        //check the status of the payment and update database
        const payload = {
            "pidx": data.pidx,
        }
        const options = {
            'method': 'POST',
            'headers': {
                'Authorization': 'key ' + process.env.KHALTI_SECRET_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };

        const lookupResponse = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', options);
        const lookupData = await lookupResponse.json();
        console.log(lookupData);

        if (!lookupData) {
            return {
                success: false,
                error: "Lookup data not found!",
            }
        }

        if (!lookupData?.pidx) {
            return {
                success: false,
                error: "Failed to lookup Khalti payment",
            }
        }

        if (lookupData.status === "Completed") {
            const donation = await prisma.donation.create({
                data: {
                    transactionDetails: {
                        pidx: data.pidx,
                        status: data.status,
                        purchase_order_id: data.purchase_order_id,
                        purchase_order_name: data.purchase_order_name,
                        transaction_id: data.transaction_id,
                    },
                    donationAmount: parseInt(data.donationAmount, 10),
                    serviceCharge: parseInt(data.serviceCharge, 10),
                    totalAmount: parseInt(data.totalAmount, 10),
                    dateDonated: new Date(),
                    paymentMethod: "Khalti",
                    fundraiser: {
                        connect: {
                            id: data.fundraiserId
                        }
                    },
                    user: {
                        connect: {
                            id: data.donorId
                        }
                    }
                }
            });

            const totalDonationAmount = await getTotalDonationsByFundraiserId(data.fundraiserId);
            let progressPercent = (Math.round((parseInt(totalDonationAmount, 10) / parseInt(fundraiser.goal, 10)) * 100));
            if (progressPercent > 100) {
                progressPercent = 100;
            }

            await prisma.fundraiser.update({
                where: {
                    id: data.fundraiserId
                },
                data: {
                    totalDonationAmount: totalDonationAmount,
                    progress: progressPercent,
                }
            })
        }

        await prisma.khaltipayment.delete({
            where: {
                pidx: data.pidx
            }
        })

        return {
            success: true,
        };

    } catch (error) {
        console.log(error);
        return ({
            nextError: 'Something went wrong!'
        });
    }
};

export const handleDonation = async (details, savedData) => {
    const donation = await handleDonationPayment(details, savedData);
    return donation;
};

export const handleEsewaDonation = async (details, savedData) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: savedData.donorId
            }
        });
        if (!user) {
            return {
                success: false,
                error: "User not found",
            }
        }
        const fundraiser = await prisma.fundraiser.findUnique({
            where: {
                id: savedData.fundraiserId
            }
        });
        if (!fundraiser) {
            return {
                success: false,
                error: "Fundraiser not found",
            }
        }

        const lookupUrl = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE}&total_amount=${details.total_amount}&transaction_uuid=${details.transaction_uuid}`;

        const lookupResponse = await fetch(lookupUrl);
        const lookupData = await lookupResponse.json();
        console.log(lookupData);

        if (!lookupData) {
            return {
                success: false,
                error: "Lookup data not found!",
            }
        }

        if (!lookupData?.transaction_uuid) {
            return {
                success: false,
                error: "Failed to lookup Esewa payment",
            }
        }

        if (lookupData.status === "COMPLETE") {
            const donation = await prisma.donation.create({
                data: {
                    transactionDetails: {
                        signature: details.signature,
                        transaction_uuid: details.transaction_uuid,
                        total_amount: parseInt(details.total_amount, 10),
                        product_code: details.product_code,
                        status: details.status,
                    },
                    donationAmount: parseInt(savedData.donationAmount, 10),
                    serviceCharge: parseInt(savedData.serviceCharge, 10),
                    totalAmount: parseInt(savedData.totalAmount, 10),
                    paymentMethod: "eSewa",
                    dateDonated: new Date(),

                    fundraiser: {
                        connect: {
                            id: savedData.fundraiserId
                        }
                    },
                    user: {
                        connect: {
                            id: savedData.donorId
                        }
                    }
                }
            });

            const totalDonationAmount = await getTotalDonationsByFundraiserId(savedData.fundraiserId);
            let progressPercent = (Math.round((parseInt(totalDonationAmount, 10) / parseInt(fundraiser.goal, 10)) * 100));
            if (progressPercent > 100) {
                progressPercent = 100;
            }

            await prisma.fundraiser.update({
                where: {
                    id: savedData.fundraiserId
                },
                data: {
                    totalDonationAmount: totalDonationAmount,
                    progress: progressPercent,
                }
            })

        }

        await prisma.esewapayment.delete({
            where: {
                signature: details.transaction_uuid
            }
        })

        return {
            success: true,
        };

    } catch (error) {
        console.log(error);
        return ({
            nextError: 'Something went wrong!'
        });

    }
}