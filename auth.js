import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/config/prisma";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            authorize: async (credentials) => {
                try {
                    const email = credentials.email;
                    const password = credentials.password;

                    if (!email || !password) {
                        return {
                            apiError: "Please provide both email and password",
                        };
                    }

                    // Find user by email using Prisma
                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    });

                    if (!user) {
                        return {
                            apiError: "User not found",
                        };
                    }

                    if (!user.password) {
                        return {
                            apiError: "Invalid Email or Password",
                        };
                    }

                    const isMatch = compare(password, user.password);

                    if (!isMatch) {
                        return {
                            apiError: "Invalid Email or Password",
                        };
                    }

                    return {
                        name: user.name,
                        email: user.email,
                        id: user.id,
                        userName: user.userName,
                    };

                } catch (error) {
                    return {
                        nextApiError: error.message || `nextError`,
                    };
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (user?.apiError) {
                throw new Error(JSON.stringify({
                    apiError: user.apiError,
                }));
            }
            if (user?.nextApiError) {
                throw new Error(JSON.stringify({
                    nextApiError: user.nextApiError,
                }));
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {

            if (!token.sub) {
                return token;
            }

            if (user) {
                token.user = user;
            }

            if (trigger === "update" && session) {
                token = { ...token, user: session.user }
                return token;
            };
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.user.id;
                session.user.name = token.user.name;
                session.user.email = token.user.email;
                session.user.userName = token.user.userName;
            }
            // console.log(session);
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
});
