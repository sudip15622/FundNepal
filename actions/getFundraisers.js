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

export async function getAllFundraisers(page = 1, pageSize = 5, sortOrder = 'desc') {
    const skip = (page - 1) * pageSize;

    const totalFundraisers = await prisma.fundraiser.count();

    const fundraisers = await prisma.fundraiser.findMany({
        skip,
        take: pageSize,
        orderBy: { dateRequested: sortOrder },
    });

    return {
        fundraisers,
        totalFundraisers,
    };
}