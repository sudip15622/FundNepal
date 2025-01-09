"use server"
import { isValidEmail } from '@/utils/validateFundraiser';
import prisma from '@/config/prisma';
import { Resend } from 'resend';
import { hash } from 'bcryptjs';
import EmailTemplate from '@/app/forgot-password/_component/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleEmailCheck = async (email) => {
    try {

        if (email.trim() === '') {
            return {
                success: false,
                error: "Email is required!",
            }
        }

        if (!isValidEmail(email)) {
            return {
                success: false,
                error: "Please enter a valid email!",
            }
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });

        if (!user) {
            return {
                success: false,
                error: "Email not found!",
            }
        }

        const previousOtp = await prisma.otp.findFirst({
            where: {
                email: email,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        if (previousOtp && new Date() - previousOtp.createdAt < 60000) {
            return {
                success: false,
                error: "You can only request a new OTP every minute",
            };
        }

        await prisma.otp.deleteMany({
            where: {
                email: email,
            }
        })

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // set a expiry time of 10 minutes
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);

        // save the otp in database

        await prisma.otp.create({
            data: {
                email: email,
                otp: otp,
                expiredAt: expiry,
            }
        })

        //send this otp to the user's email
        const { data, error } = await resend.emails.send({
            from: 'Shayata <onboarding@sahayata.xyz>',
            to: [email],
            subject: 'Your Password Reset OTP',
            react: EmailTemplate({ name: email.split('@')[0], otp }),
        });

        if (error) {
            return {
                success: false,
                error: error,
            };
        }


        return {
            success: true,
            otp: otp,
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.message,
        }
    }
}

export const handleVerifyOtp = async (email, otp) => {
    try {
        if (email.trim() === '') {
            return {
                success: false,
                error: "Email is required!",
            }
        }

        if (otp.trim() === '') {
            return {
                success: false,
                error: "OTP is required!",
            }
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });

        if (!user) {
            return {
                success: false,
                error: "Email not found!",
            }
        }

        const otpData = await prisma.otp.findFirst({
            where: {
                email: email,
                otp: otp,
            }
        });

        if (!otpData) {
            return {
                success: false,
                error: "Invalid OTP!",
            }
        }

        if (otpData.expiredAt < new Date()) {
            return {
                success: false,
                error: "OTP has expired!",
            }
        }

        await prisma.otp.deleteMany({
            where: {
                email: email,
            }
        })

        return {
            success: true,
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.message,
        }
    }
}

export const handleSetNewPassword = async (email, password, confirmPassword) => {
    try {
        if (email.trim() === '') {
            return {
                success: false,
                error: "Email is required!",
            }
        }

        if (password.trim() === '') {
            return {
                success: false,
                error: "Password is required!",
            }
        }

        if (confirmPassword.trim() === '') {
            return {
                success: false,
                error: "Confirm Password is required!",
            }
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                error: "Passwords do not match!",
            }
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });

        if (!user) {
            return {
                success: false,
                error: "Email not found!",
            }
        }

        const hashedPassword = await hash(password, 10);

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            }
        })

        return {
            success: true,
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.message,
        }
    }
}