"use server"

import prisma from '@/config/prisma';

export async function getFundraiserByUserId(userId) {

    const fundraiser = await prisma.fundraiser.findMany({
        where: { userId: userId },
        orderBy: { dateRequested: 'desc' },
    });

    return fundraiser;
}
export async function getFundraiserById(id) {

    const fundraiser = await prisma.fundraiser.findUnique({
        where: { id: id },
    });

    return fundraiser;
}

export async function getCategoryWiseFundraiser( category='Medical', count = 6 ) {

    const where = {
        category: category,
    };
    const select = {
        id: true,
        title: true,
        goal: true,
        photo: true,
        category: true,
        slug: true,
        contactInfo: {
            select: {
                address: true,
            }
        }
    };

    const totalFundraisers = await prisma.fundraiser.count({where: where});

    const fundraisers = await prisma.fundraiser.findMany({
        where: where,
        select: select,
        take: count,
        orderBy: { dateRequested: 'desc' },
    });

    return {
        fundraisers,
        totalFundraisers,
    };
}