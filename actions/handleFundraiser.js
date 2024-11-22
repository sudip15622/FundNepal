"use server"

import prisma from '@/config/prisma';
import { isValidDetails, isValidPersonalInfo } from '@/utils/validateFundraiser';
import { generateUniqueSlug } from '@/utils/slugGenerator';

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
                id: personalInfo.organizerId,
            }
        });

        if (!user) {
            return ({
                error: "User not found!"
            })
        }

        const fundraiser = await prisma.fundraiser.findFirst({
            where: { title: details.title }
        })

        if (fundraiser) {
            return ({
                error: "Title matched with other! Please change it."
            })
        }

        const newFundraiser = await prisma.fundraiser.create({
            data: {
                title: details.title,
                description: details.description,
                goal: details.goal,
                category: details.category,
                type: details.type,
                photo: details.photo,
                beneficiary: {
                    create: {
                        address: {
                            street: personalInfo.street,
                            wardNo: personalInfo.wardNo,
                            city: personalInfo.city,
                            district: personalInfo.district,
                        },
                        phone: personalInfo.phone,
                        name: personalInfo.name,
                    },
                },
                dateRequested: new Date(),
                status: 'Draft',
                user: {
                    connect: { id: user.id },
                }
            },
        });

        const slug = generateUniqueSlug(newFundraiser.title, newFundraiser.id);

        //update recently created fundraiser with slug
        await prisma.fundraiser.update({
            where: { id: newFundraiser.id },
            data: { slug: slug },
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

export const updateFundraiser = async (id, data) => {
    try {
        if(!data) {
            return ({
                error: "Data not found!"
            })
        }
        
        const fundraiser = await prisma.fundraiser.update({
            where: { id: id },
            data: data,
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
}
export const updateBeneficiary = async (id, data) => {
    try {
        if(!data) {
            return ({
                error: "Data not found!"
            })
        }
        
        const beneficiary = await prisma.beneficiary.update({
            where: { id: id },
            data: data,
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
}