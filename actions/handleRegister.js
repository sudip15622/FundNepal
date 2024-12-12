"use server"

import prisma from '@/config/prisma';
import { generateUsername } from '@/utils/usernameGenerator';
import { hash, compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
// import { auth } from '@/auth';

const handleRegisterSubmit = async (credentials) => {

    try {

        const hasSpecialCharactersOrNumbers = (str) => {
            const regex = /[^a-zA-Z\s]/;
            return regex.test(str);
        };

        const isValidEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        const isValidPassword = (pw) => {
            const isValid =
                pw.length >= 8 &&
                /[!@#$%^&*(),.?":{}|<>]/.test(pw) &&
                /[A-Z]/.test(pw) &&
                /\d/.test(pw);

            return isValid;
        }

        const isSamePassword = (p1, p2) => {
            if (p1 === p2) {
                return true;
            }
            else {
                return false;
            }
        }

        if (!credentials.email || !credentials.password || !credentials.name || !credentials.confirmPassword) {
            return ({
                error: "Please provide all fields!"
            })
        }

        if (hasSpecialCharactersOrNumbers(credentials.name)) {
            return ({
                error: "Name can only contains alphabets!"
            })
        }

        if (!isValidEmail(credentials.email)) {
            return ({
                error: "Invalid email!"
            })
        }
        if (!isValidPassword(credentials.password)) {
            return ({
                error: "Invalid password!"
            })
        }
        if (!isSamePassword(credentials.password, credentials.confirmPassword)) {
            return ({
                error: "Password doesn't match!"
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                email: credentials.email
            }
        });

        if (user) {
            return ({
                error: "User already exists, proceed to login!"
            })
        }

        const userName = await generateUsername(credentials.name);

        const hashedPassword = await hash(credentials.password, 10);

        await prisma.user.create({
            data: {
                name: credentials.name,
                email: credentials.email,
                password: hashedPassword,
                userName: userName,
                avatar: '',
                dateJoined: new Date(),
            },
        });

        return {
            success: true
        };
    } catch (error) {
        console.log(error.message);
        return ({
            nextError: error.message
        });
    }
};

export const handleRegister = async (credentials) => {
    const registerUser = await handleRegisterSubmit(credentials);
    return registerUser;
};

export const getUserProfile = async (id) => {
    try {
        
        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                email: true,
                userName: true,
                avatar: true,
                phone: true,
                role: true,
                dateJoined: true,
            }
        });

        if (!user) {
            return ({
                success: false,
                error: "User doesn't exist!"
            })
        }

        return {
            success: true,
            user: user
        };
    } catch (error) {
        console.log(error.message);
        return ({
            success: false,
            nextError: error.message
        });
    }
}

export const updateUser = async (id, data) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });

        if (!user) {
            return ({
                error: "User doesn't exist!",
            })
        }

        const someone = await prisma.user.findFirst({
            where: data
        });

        if (someone) {
            return ({
                error: "This changes already exists!",
            })
        }

        await prisma.user.update({
            where: {
                id: id
            },
            data: data
        });

        return {
            success: true
        };
    } catch (error) {
        console.log(error.message);
        return ({
            nextError: error.message
        });

    }
}

export const handleUserPassword = async (id, data) => {
    try {

        const isValidPassword = (pw) => {
            const isValid =
                pw.length >= 8 &&
                /[!@#$%^&*(),.?":{}|<>]/.test(pw) &&
                /[A-Z]/.test(pw) &&
                /\d/.test(pw);

            return isValid;
        }

        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });

        if (!user) {
            return ({
                error: "User doesn't exist!",
            })
        }

        // check if old password matches
        const isMatch = await compare(data.currentPassword, user.password);
        if (!isMatch) {
            return ({
                success: false,
                error: "Current password is incorrect!"
            })
        }
        // check if new password is valid
        if (!isValidPassword(data.newPassword)) {
            return ({
                success: false,
                error: "Invalid password format!"
            })
        }

        //hashed new password
        const hashedPassword = await hash(data.newPassword, 10);

        await prisma.user.update({
            where: {
                id: id
            },
            data: {
                password: hashedPassword
            }
        });

        return {
            success: true
        };
    } catch (error) {
        console.log(error.message);
        return ({
            nextError: error.message
        });
    }
}