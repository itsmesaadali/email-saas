//  /api/initial-sync

import { Account } from "@/lib/account";
import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const { accountId, userId } = await req.json();

    if (!accountId || !userId) {
        return NextResponse.json({ error: "Missing accountId or userId" }, { status: 400 });
    }

    const dAurinkoAccount = await db.aurinkoAccount.findUnique({
        where: {
            id: accountId,
            userId
        }
    })

    if (!dAurinkoAccount) {
        return NextResponse.json({ error: "Aurinko account not found" }, { status: 404 });
    }

    const account = new Account(dAurinkoAccount.accessToken);

    const response = await account.performInitialSync();

    if (!response) {
        return NextResponse.json({ error: "Failed to perform initial sync" }, { status: 500 });
    }

    const { emails, deltaToken } = response;

    console.log("Emails", emails)

    // await db.aurinkoAccount.update({
    //     where: {
    //         id: accountId
    //     },
    //     data: {
    //         nextDeltaToken: deltaToken
    //     }
    // })


    // await syncEmailsToDatabase(emails, accountId);
    console.log('Sync completed for account', deltaToken);
    return NextResponse.json({ success: true }, { status: 200 });
}