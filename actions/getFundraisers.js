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
            status: true,
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
        status: 'Draft',
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

export async function getAllFundraisers(page = 1, pageSize = 5, filter = 'Now Trending') {

    let orderBy = { datePublished: 'desc' };
    if (filter === 'Now Trending') {
        orderBy = { totalDonationAmount: 'desc' };
    } else if (filter === 'Just Launched') {
        orderBy = { datePublished: 'desc' };
    } else if (filter === 'Close to Goal') {
        orderBy = { progress: 'desc' };
    }

    const skip = (page - 1) * pageSize;

    const where = {
        status: 'Draft',
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

    const totalFundraisers = await prisma.fundraiser.count({});

    const fundraisers = await prisma.fundraiser.findMany({
        where: where,
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
        const fundraiser = await prisma.fundraiser.findUnique({
            where: { id: id },
        });

        if (!fundraiser) {
            return { success: false, nextError: 'Fundraiser not found' };
        }

        await prisma.fundraiser.delete({
            where: { id: id },
        });

        return { success: true };

    } catch (error) {
        console.log(error.message);
        return { success: false, nextError: error.message };
    }
}
export const changeFundraiserStatus = async (id, status) => {
    try {
        const fundraiser = await prisma.fundraiser.findUnique({
            where: { id: id }
        });

        if (!fundraiser) {
            return ({
                success: false,
                error: 'Fundraiser not found!'
            });
        }
        await prisma.fundraiser.update({
            where: { id: id },
            data: {
                status: status === 'Published' ? 'Draft' : 'Published',
            }
        });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            error: `${error.message}!`,
        });
    }
}

export const getFundraisersForAdmin = async (pageIndex = 0, pageSize = 10, sortFundraiser = 'desc', searchQuery = '', status = '', category = '') => {
    try {
        const skip = pageIndex * pageSize;

        const where = {
            AND: [
                searchQuery
                    ? {
                        OR: [
                            { title: { contains: searchQuery, mode: 'insensitive' } },
                            // { category: { contains: searchQuery, mode: 'insensitive' } },
                            { user: {
                                name: { contains: searchQuery, mode: 'insensitive' }
                            } },
                        ],
                    }
                    : {},
            ],
        };

        if(status){
            where.AND.push({ status: status });
        }
        if(category){
            where.AND.push({ category: category });
        }

        const fundraisers = await prisma.fundraiser.findMany({
            where: where,
            skip: skip,
            take: pageSize,
            include: {
                beneficiary: true,
                user: true,
            },
            orderBy: {
                dateRequested: sortFundraiser,
            },
        });

        const totalFundraisers = await prisma.fundraiser.count();

        return {
            success: true,
            fundraisers: fundraisers,
            totalFundraisers: totalFundraisers,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}