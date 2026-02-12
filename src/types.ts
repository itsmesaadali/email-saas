import z from "zod";

export interface SyncResponse{
    syncUpdatedToken: string;
    syncDeletedToken: string;
    ready:boolean;
}

export interface SyncUpdatedResponse{
    nextPageToken?: string;
    nextDeltaToken: string;
    records: EmailMessage[];
}

export const emailAddessSchema = z.object({
    name: z.string(),
    address: z.string().email()
})

export interface EmailMessage {
    id: string;
    threadId: string;
    createdTime: string;
    lastModifiedTime: string;
    sentAt: string;
    receivedAt: string;
    internetMessageId: string;
    subject: string;
    sysLabels: Array<"draft" | "sent" | "inbox" | "archive" | "trash" | "spam" | "junk" | "unread" | "flagged" | "important" >;
    keywords: string[];
    sysClassifications: Array<"personal" | "social" | "promotions" | "updates" | "forums" | "ads">;
    senstivity: "normal" | "personal" | "private" | "confidential";
    meetingMessageMethod?: "request" | "reply" | "cancal" | "counter" | "other";
    from: EmailAddress;
    to: EmailAddress[];
    cc: EmailAddress[];
    bcc: EmailAddress[];
    replyTo: EmailAddress[];
    hasAttachments: boolean;
    body?:string;
    bodySnippet?: string;
    attachments: EmailAttachment[];
    inReplyTo?: string;
    references?: string;
    threadIndex?: string;
    internetHeaders: EmailHeader[];
    nativeProperties: Record<string, string>;
    folderId?: string;
    omitted:Array<"internetHeaders" | "attachments" | "body" | "recipients" | "threadId">;

}

export interface EmailAddress {
    name?: string;
    address: string;
    raw?: string;
}

export interface EmailAttachment {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    inline: boolean;
    contentId?: string;
    contentLocation?: string;
}


export interface EmailHeader {
    name: string;
    value: string;
}