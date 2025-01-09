"use server"
import prisma from "@/config/prisma"

export const saveBankDetails = async (userId, formData) => {
    try {
        if(!formData) {
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

        const { bankName, holderName, accountNumber, mobileNumber } = formData;

        const bank = await prisma.bank.findFirst({
            where: {
                accountNumber: accountNumber,
            }
        })

        if(bank) {
            return ({
                success: false,
                error: "Account number already exists!",
            })
        }

        const myBank = await prisma.bank.findFirst({
            where: {
                userId: userId,
            }
        })
        if(myBank) {
            await prisma.bank.update({
                where: {
                    id: myBank.id,
                },
                data: {
                    bankName: bankName,
                    holderName: holderName,
                    accountNumber: accountNumber,
                    mobileNumber: mobileNumber,
                    dateAdded: new Date(),
                    status: "Pending",
                }
            })

            return ({
                success: true,
            })
        }

        await prisma.bank.create({
            data: {
                bankName: bankName,
                holderName: holderName,
                accountNumber: accountNumber,
                mobileNumber: mobileNumber,
                dateAdded: new Date(),
                user: {
                    connect: {
                        id: userId,
                    }
                }
            }
        })

        return ({
            success: true,
        })
    } catch (error) {
        return ({
            success: false,
            error: error.message,
        })
    }
}

export const getBankDetails = async (userId) => {
    try {
        const bank = await prisma.bank.findFirst({
            where: {
                userId: userId,
            }
        })

        return ({
            success: true,
            data: bank,
        })
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            error: error.message,
        })
    }
}

export const getBanksForAdmin = async (pageIndex = 0, pageSize = 10, sortBank = 'desc', searchQuery = '', status = '') => {
    try {
        const skip = pageIndex * pageSize;

        const where = {
            AND: [
                searchQuery
                    ? {
                        OR: [
                            { accountNumber: { contains: searchQuery, mode: 'insensitive' } },
                            { mobileNumber: { contains: searchQuery, mode: 'insensitive' } },
                            { holderName: { contains: searchQuery, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            ],
        };

        if(status){
            where.AND.push({ status: status });
        }

        const banks = await prisma.bank.findMany({
            where: where,
            skip: skip,
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        avatar: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                dateAdded: sortBank
            }
        });

        const totalBanks = await prisma.bank.count();

        return {
            success: true,
            banks: banks,
            totalBanks: totalBanks,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}

export const deleteBankByAdmin = async (bankId) => {
    try {
        const bank = await prisma.bank.findUnique({
            where: { id: bankId }
        });

        if (!bank) {
            return ({
                success: false,
                error: 'Bank not found!'
            });
        }

        await prisma.bank.delete({
            where: { id: bankId }
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


export const changeBankStatus = async (bankId, status) => {
    try {
        const bank = await prisma.bank.findUnique({
            where: { id: bankId }
        });

        if (!bank) {
            return ({
                success: false,
                error: 'Bank not found!'
            });
        }
        await prisma.bank.update({
            where: { id: bankId },
            data: {
                status: status === 'Active' ? 'Pending' : 'Active',
            }
        });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            error: `$Something went wrong!`,
        });
    }
}


export const getAmountsToRecieve = async (userId) => {
    try {

        const fundraisers = await prisma.fundraiser.findMany({
            where: {
                userId: userId,
                status: 'Published',
            },
            select: {
                id: true,
                totalDonationAmount: true,
            }
        });

        if(fundraisers.length > 0) {
            let totalAmount = 0;
            fundraisers.map(fundraiser => {
                totalAmount += fundraiser.totalDonationAmount;
            });

            return {
                success: true,
                totalAmount: totalAmount,
            }
        }

        return ({
            success: true,
            totalAmount: 0,
        })
        
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            error: error.message,
        })
        
    }
}