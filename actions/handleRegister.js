"use server"

import prisma from '@/config/prisma';
import { generateUsername } from '@/utils/usernameGenerator';
import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

const handleRegisterSubmit = async (credentials) => {

    try {

        const hasSpecialCharactersOrNumbers = (str) => {
            const regex = /[^a-zA-Z\s]/;
            return regex.test(str);
        };

        const isValidPhoneNo = (phoneNumber) => {
            const phoneRegex = /^(97|98)\d{8}$/;
            return phoneRegex.test(phoneNumber);
        }

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

        if (!credentials.email || !credentials.password || !credentials.name || !credentials.phone) {
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
        if (!isValidPhoneNo(credentials.phone)) {
            return ({
                error: "Invalid phone number!"
            })
        }
        if (!isValidPassword(credentials.password)) {
            return ({
                error: "Invalid password!"
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: credentials.email },
                    { phone: credentials.phone }
                ]
            }
        });

        if (user) {
            return ({
                error: "User already exists!"
            })
        }

        const userName = await generateUsername(credentials.name);

        const hashedPassword = await hash(credentials.password, 10);

        await prisma.user.create({
            data: {
                name: credentials.name,
                email: credentials.email,
                phone: credentials.phone,
                password: hashedPassword,
                userName: userName,
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
    if (registerUser.success) {
        if (credentials.redirect !== false) {
            redirect('/sign-in');
        }
    }
    return registerUser;
};