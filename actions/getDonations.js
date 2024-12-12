"use server"

import prisma from '@/config/prisma';

export async function getDonationByUserId(userId) {

    const donations = await prisma.donation.findMany({
        where: { userId: userId },
        orderBy: { dateDonated: 'desc' },
    });

    return donations;
}
export async function getDonationById(id) {

    const donation = await prisma.donation.findUnique({
        where: { id: id },
    });

    return donation;
}

export async function getTotalDonationsByFundraiserId(fundraiserId) {
    try {
        const totalDonations = await prisma.donation.aggregate({
            where: {
                fundraiserId: fundraiserId,
            },
            _sum: {
                donationAmount: true,
            }
        });

        return totalDonations._sum.donationAmount ? totalDonations._sum.donationAmount : 0;
    } catch (error) {
        console.log(error.message);
        return 0;
    }
}

export async function getDonationByFundraiserId(fundraiserId) {
    try {
        const where = {
            fundraiserId: fundraiserId,
        };

        const select = {
            id: true,
            donationAmount: true,
            fundraiserId: true,
            userId: true,
            dateDonated: true,
            user: {
                select: {
                    name: true,
                }
            }
        };

        // const totalDonationAmount = await getTotalDonationsByFundraiserId(fundraiserId);

        const totalDonationCount = await prisma.donation.count({ where: where });

        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const totalDonationCountLast24Hours = await prisma.donation.count({
            where: {
                fundraiserId: fundraiserId,
                dateDonated: {
                    gte: last24Hours,
                },
            },
        });

        const firstDonation = await prisma.donation.findFirst({
            where: where,
            select: select,
            orderBy: { dateDonated: 'asc' },
        });

        const lastDonation = await prisma.donation.findFirst({
            where: where,
            select: select,
            orderBy: { dateDonated: 'desc' },
        });

        const topDonation = await prisma.donation.findFirst({
            where: where,
            select: select,
            orderBy: {
                donationAmount: 'desc',
            },
            take: 1,
        });

        return {
            totalDonationCount: totalDonationCount,
            totalRecentDonationCount: totalDonationCountLast24Hours,
            // totalDonationAmount: totalDonationAmount,
            firstDonation: firstDonation,
            recentDonation: lastDonation,
            topDonation: topDonation,
        };
    } catch (error) {
        console.log(error.message);
        return {
            totalDonationCount: 0,
            totalRecentDonationCount: 0,
            // totalDonationAmount: "0",
            firstDonation: null,
            recentDonation: null,
            topDonation: null,
        };
    }
}

export async function getAllDonationsByFundraiserId(fundraiserId) {
    try {
        const donations = await prisma.donation.findMany({
            where: { fundraiserId: fundraiserId },
            select: {
                id: true,
                donationAmount: true,
                fundraiserId: true,
                userId: true,
                dateDonated: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { dateDonated: 'desc' },
        });

        return donations;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getDonationForAdmin = async (pageIndex = 0, pageSize = 10, sortDonation = 'desc', searchQuery = '', paymentMethod = '') => {
    try {
        const skip = pageIndex * pageSize;

        const where = {
            AND: [
                searchQuery
                    ? {
                        OR: [
                            { fundraiser: {
                                title: { contains: searchQuery, mode: 'insensitive' }
                            } },
                            { user: {
                                name: { contains: searchQuery, mode: 'insensitive' }
                            } },
                        ],
                    }
                    : {},
            ],
        };

        if(paymentMethod){
            where.AND.push({ paymentMethod: paymentMethod });
        }

        const donations = await prisma.donation.findMany({
            where: where,
            skip: skip,
            take: pageSize,
            include: {
                fundraiser: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        photo: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                },
            },
            orderBy: {
                dateDonated: sortDonation,
            },
        });

        const totalDonations = await prisma.donation.count();

        return {
            success: true,
            donations: donations,
            totalDonations: totalDonations,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}

export async function deleteDonation(id) {
    try {
        const donation = await prisma.donation.findUnique({
            where: { id: id },
        });

        if (!donation) {
            return { success: false, nextError: 'Donation not found' };
        }

        await prisma.donation.delete({
            where: { id: id },
        });

        return { success: true };

    } catch (error) {
        console.log(error.message);
        return { success: false, nextError: error.message };
    }
}