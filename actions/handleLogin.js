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