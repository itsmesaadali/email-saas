// /api/clerk/webhook/route.ts

import { db } from "@/server/db";

export const POST = async (req: Request) => {
    const { data } = await req.json();

    console.log("Received Clerk webhook:", data);

    const email = data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const id = data.id;

    await db.user.create({
        data: {
            id,
            email,
            firstName,
            lastName,
            imageUrl,
        },
    });
    console.log("User created in database");

    return new Response("Webhook received", { status: 200 });
}