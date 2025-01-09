"use server"
import prisma from "@/config/prisma"

export const reportFundraiser = async (cause, userId, fundraiserId) => {
    try {
        if(!cause || !userId || !fundraiserId) {
            return ({
                success: false,
                error: "Data not found!",
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            }
        })

        if(!user) {
            return ({
                success: false,
                error: "User not found!",
            })
        }

        const fundraiser = await prisma.fundraiser.findFirst({
            where: {
                id: fundraiserId,
            },
        })

        if(!fundraiser) {
            return ({
                success: false,
                error: "Fundraiser not found!",
            })
        }

        if(fundraiser.userId === userId) {
            return ({
                success: false,
                error: "You cannot report your own fundraiser!",
            })
        }

        const report = await prisma.report.findFirst({
            where: {
                fundraiserId: fundraiserId,
                userId: userId,
            }
        })

        if(report) {
            return ({
                success: false,
                error: "You have already reported this fundraiser!"
            })
        }

        await prisma.report.create({
            data: {
                causes: cause,
                dateReported: new Date(),
                user: {
                    connect: { id: user.id },
                },
                fundraiser: {
                    connect: { id: fundraiser.id },
                }
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            error: "Something went wrong!",
        });
    }
}

export const getAllReports = async (pageIndex = 0, pageSize = 10, sortReport = 'desc', searchQuery = '', cause = '') => {
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

        if(cause){
            where.AND.push({ causes: {has: cause} });
        }

        const reports = await prisma.report.findMany({
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
                dateReported: sortReport,
            },
        });

        const totalReports = await prisma.report.count();

        return {
            success: true,
            reports: reports,
            totalReports: totalReports,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}

export async function deleteReport(id) {
    try {
        const report = await prisma.report.findUnique({
            where: { id: id },
        });

        if (!report) {
            return { success: false, nextError: 'Report not found' };
        }

        await prisma.report.delete({
            where: { id: id },
        });

        return { success: true };

    } catch (error) {
        console.log(error.message);
        return { success: false, nextError: error.message };
    }
}