// src/lib/auth.ts

import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: {

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    plugins: [nextCookies()],
});

/**
 * Helper function to get the current user session in server actions
 * @returns The session object with user data, or null if not authenticated
 */
export const getSession = async () => {
    const headersList = await headers();
    return await auth.api.getSession({ headers: headersList });
};

/**
 * Helper function to get the current user ID in server actions
 * @returns The user ID or null if not authenticated
 */
export const getCurrentUserId = async () => {
    const session = await getSession();
    return session?.user?.id ?? null;
};