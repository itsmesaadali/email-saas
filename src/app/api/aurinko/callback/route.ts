// /api/aurinko/callback

import {waitUntil} from "@vercel/functions"
import { exchangeCodeForAccessTokens, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req: NextRequest) => {

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;
    const params = req.nextUrl.searchParams;
    const status = params.get("status");
    if (status != "success") {
        return new NextResponse("Callback failed", { status: 400 });
    }

    // get the code to excahnge for access tokens
    const code = params.get("code");
    if (!code) {
        return new NextResponse("Missing code", { status: 400 });
    }

    const token = await exchangeCodeForAccessTokens(code);
    if (!token) {
        return new NextResponse("Failed to exchange code for access tokens", { status: 500 });
    }

    const accountDetails = await getAccountDetails(token.accessToken);

    await db.aurinkoAccount.upsert(
        {
            where: {
                id: token.accountId.toString()
            },
            update: {
                accessToken: token.accessToken
            },
            create: {
                id: token.accountId.toString(),
                userId,
                emailAddress: accountDetails.email,
                name: accountDetails.name,
                accessToken: token.accessToken
            }
        }
    )

    // trigger initial sync for the account here (could also be done in a background job or on the client)

    waitUntil(
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/initial-sync`, {
            accountId: token.accountId.toString(),
            userId
        }).then(res => {
            console.log("Initial sync triggered", res);
        }).catch(err => {
            console.error("Failed to trigger initial sync", err);
        })
    )

    return NextResponse.redirect(new URL("/mail", req.url));
}