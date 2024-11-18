"use server"

import prisma from '@/config/prisma';

export async function getFundraiserByUserId(userId, filter = 'All') {

    const fundraiser = await prisma.fundraiser.findMany({
        where: { userId: userId },
        select: {
            id: true,
            title: true,
            goal: true,
            photo: true,
            category: true,
            slug: true,
            totalDonationAmount: true,
            progress: true,
            datePublished: true,
        },
        orderBy: { datePublished: 'desc' },
    });

    return fundraiser;
}

export async function getFundraiserById(id) {

    const fundraiser = await prisma.fundraiser.findUnique({
        where: { id: id },
        include: {
            beneficiary: true,
        },
    });

    return fundraiser;
}

export async function getCategoryWiseFundraiser(category = 'Medical', count = 6) {

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
        totalDonationAmount: true,
        progress: true,
        beneficiary: {
            select: {
                address: true,
            }
        }
    };

    const totalFundraisers = await prisma.fundraiser.count({ where: where });

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

export async function getAllFundraisers(page = 1, pageSize = 5, filter='Now Trending') {

    let orderBy = { datePublished: 'desc' };
    if(filter === 'Now Trending') {
        orderBy = { totalDonationAmount: 'desc' };
    } else if(filter === 'Just Launched') {
        orderBy = { datePublished: 'desc' };
    } else if(filter === 'Close to Goal') {
        orderBy = { progress: 'desc' };
    }

    const skip = (page - 1) * pageSize;

    // const where = {
    //     category: category,
    // };
    const select = {
        id: true,
        title: true,
        goal: true,
        photo: true,
        category: true,
        slug: true,
        totalDonationAmount: true,
        progress: true,
        beneficiary: {
            select: {
                address: true,
            }
        }
    };

    const totalFundraisers = await prisma.fundraiser.count({});

    const fundraisers = await prisma.fundraiser.findMany({
        // where: where,
        select: select,
        take: pageSize,
        skip: skip,
        orderBy: orderBy,
    });

    return {
        fundraisers,
        totalFundraisers,
    };
}

export async function deleteFundraiser(id) {
    try {
        const fundraiser = await prisma.fundraiser.delete({
            where: { id: id },
        });
    
        return {success: true};
        
    } catch (error) {
        console.log(error.message);
        return {success: false, nextError: error.message};
    }
}