"use server"

import { signIn } from '@/auth';
import { compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
import prisma from '@/config/prisma';

const handleLoginSubmit = async (credentials) => {

    try {

        const isValidEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        if (!credentials.email || !credentials.password) {
            return ({
                error: "Please provide all fields"
            })
        }

        if (!isValidEmail(credentials.email)) {
            return ({
                error: "Invalid email"
            })
        }

        const user = await prisma.user.findUnique({
            where: { email: credentials.email }
        });

        if (!user) {
            return ({
                error: "User not found"
            })
        }

        if (!user.password) {
            return ({
                error: "Invalid Email or Password"
            })
        }

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
            return ({
                error: "Invalid Email or Password"
            })
        }

        await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
        })

        return {
            success: true
        };
    } catch (error) {
        console.log(error);

        function convertStringToObject(jsonString) {
            try {
                const jsonObject = JSON.parse(jsonString);
                return jsonObject;
            } catch (error) {
            }
        }

        const err = error?.cause?.err?.message;

        const errObj = convertStringToObject(err);

        if (errObj?.apiError) {
            return ({
                apiError: errObj.apiError
            });
        }

        if (errObj?.nextApiError) {
            return ({
                nextApiError: errObj.nextApiError
            });
        }

        return ({
            nextError: error.message
        });
    }
};

export const handleLogin = async (credentials) => {
    const loginUser = await handleLoginSubmit(credentials);
    return loginUser;
};

export const getUsers = async (pageIndex = 0, pageSize = 10, sortUser = 'desc', searchQuery = '', role = '') => {
    try {
        const skip = pageIndex * pageSize;

        const where = {
            AND: [
                searchQuery
                    ? {
                        OR: [
                            { name: { contains: searchQuery, mode: 'insensitive' } },
                            { email: { contains: searchQuery, mode: 'insensitive' } },
                            { userName: { contains: searchQuery, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            ],
        };

        if(role){
            where.AND.push({ role: role });
        }

        const users = await prisma.user.findMany({
            where: where,
            skip: skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                userName: true,
                avatar: true,
                phone: true,
                role: true,
                dateJoined: true,
            },
            orderBy: {
                dateJoined: sortUser
            }
        });

        const totalUsers = await prisma.user.count();

        return {
            success: true,
            users: users,
            totalUsers: totalUsers,
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}

export const changeUserRole = async (userId, role) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return ({
                success: false,
                error: 'User not found!'
            });
        }
        await prisma.user.update({
            where: { id: userId },
            data: {
                role: role === 'Admin' ? 'User' : 'Admin',
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

export const deleteUserByAdmin = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return ({
                success: false,
                error: 'User not found!'
            });
        }

        await prisma.user.delete({
            where: { id: userId }
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