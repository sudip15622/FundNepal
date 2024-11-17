"use server"
import prisma from "@/config/prisma";

const handleKhaltiPayment = async (details) => {

    try {

        if (!details) {
            return {
                success: false,
                error: "No details provided",
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: details.donorId
            }
        })
        if (!user) {
            return {
                success: false,
                error: "User not found",
            }
        }

        const fundraiser = await prisma.fundraiser.findUnique({
            where: {
                id: details.fundraiserId
            }
        })
        if (!fundraiser) {
            return {
                success: false,
                error: "Fundraiser not found",
            }
        }

        const payload = {
            "return_url": `${process.env.WEBSITE_URL}/donation/khalti`,
            "website_url": process.env.WEBSITE_URL,
            "amount": parseFloat(details.totalAmount) * 100,
            "purchase_order_id": details.id,
            "purchase_order_name": details.fundraiserTitle,
            "customer_info": {
                "name": details.donorName,
                "email": details.donorEmail,
            },
            // "amount_breakdown": [
            //     {
            //         "label": "Donation Amount",
            //         "amount": parseFloat(details.donationAmount) * 100
            //     },
            //     {
            //         "label": "Service Charge",
            //         "amount": parseFloat(details.serviceCharge) * 100
            //     }
            // ],
        };

        const options = {
            'method': 'POST',
            'headers': {
                'Authorization': 'key ' + process.env.KHALTI_SECRET_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };

        const khaltiResponse = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', options);
        const khaltiData = await khaltiResponse.json();
        // console.log(khaltiData);
        console.log(details);

        if (!khaltiData) {
            return {
                success: false,
                error: "Failed to initiate Khalti payment",
            }
        }
        if (khaltiData.error_key) {
            return {
                success: false,
                error: khaltiData.detail,
            }
        }

        if (!khaltiData.pidx) {
            return {
                success: false,
                error: "Failed to initiate Khalti payment",
            }
        }

        const payData = {
            pidx: khaltiData.pidx,
            donorId: details.donorId,
            fundraiserId: details.fundraiserId,
            fundraiserSlug: details.fundraiserSlug,
            donationAmount: parseInt(details.donationAmount, 10),
            serviceCharge: parseInt(details.serviceCharge, 10),
            totalAmount: parseInt(details.totalAmount, 10),
        }

        await prisma.khaltipayment.create({
            data: payData
        });

        return {
            success: true,
            url: khaltiData?.payment_url,
        };

    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: 'Something went wrong!'
        });
    }
};

export const handleKhalti = async (details) => {
    const khaltiPayment = await handleKhaltiPayment(details);
    return khaltiPayment;
};