import type { EmailMessage, SyncResponse, SyncUpdatedResponse } from "@/types";
import axios from "axios";

export class Account {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async startSync() {
        const response = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync', {}, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params: {
                daysWithin: 2,
                bodyType: 'html'
            }
        });
        return response.data;

    }

    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {
        let params: Record<string, string> = {}

        if (deltaToken) {
            params.deltaToken = deltaToken;
        }

        if (pageToken) {
            params.pageToken = pageToken;
        }

        const response = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated', {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params
        });
        return response.data;
    }

    async performInitialSync() {
        try {

            // start the sync and keep checking until it's ready
            let syncResponse = await this.startSync();
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
                syncResponse = await this.startSync();
            }

            // get the bookmark delta token
            let storedDeltaToken = syncResponse.syncUpdatedToken;

            let updatedResponse = await this.getUpdatedEmails({ deltaToken: storedDeltaToken});

            if(updatedResponse.nextDeltaToken) {
                // sync has completed
                storedDeltaToken = updatedResponse.nextDeltaToken;
            }

            let allEmails: EmailMessage[] = updatedResponse.records;

            // for fetch all pages if there are more
            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
                allEmails = allEmails.concat(updatedResponse.records);

                if (updatedResponse.nextDeltaToken) {
                    // sync has ended
                    storedDeltaToken = updatedResponse.nextDeltaToken;
                }
            }

            console.log('Initial Sync Completed, we sync ', allEmails.length, "Emails")

            // store the latest delta toke for future inc syncs

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error during sync:', JSON.stringify(error.response?.data) || error.message);
            }else {
                console.error('Error during sync:', error);
            }
        }
    }
}