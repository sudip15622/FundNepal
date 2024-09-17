"use server"

import prisma from '@/config/prisma';
import { isValidDetails, isValidPersonalInfo } from '@/utils/validateFundraiser';

const handleFundraiserSubmit = async (details, personalInfo) => {

    try {
        const detailsValidation = isValidDetails(details);
        if (!detailsValidation?.success) {
            return ({
                error: detailsValidation?.error,
            })
        }

        const infoValidation = isValidPersonalInfo(personalInfo);
        if (!infoValidation?.success) {
            return ({
                error: infoValidation?.error,
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: personalInfo.email
            }
        });

        if (!user) {
            return ({
                error: "User not found!"
            })
        }

        const fundraiser = await prisma.fundraiser.findFirst({
            where: {title: details.title}
        })

        if(fundraiser) {
            return ({
                error: "Title matched with other! Please change it."
            })
        }

        await prisma.fundraiser.create({
            data: {
                title: details.title,
                description: details.description,
                goal: details.goal,
                category: details.category,
                type: details.type,
                photo: details.photo,
                address: {
                    street: personalInfo.street,
                    wardNo: personalInfo.wardNo,
                    city: personalInfo.city,
                    district: personalInfo.district,
                },
                phone: personalInfo.phone,
                email: personalInfo.email,
                dateRequested: new Date(),
                user: {
                    connect: { id: user.id },
                }
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            nextError: error.message
        });
    }
};

export const handleFundraiser = async (details, personalInfo) => {
    const fundraiser = await handleFundraiserSubmit(details, personalInfo);
    return fundraiser;
};