"use client";

import { useTransition } from "react";
import { authClient } from "./auth-client";
import { toast } from "sonner";

export function useGoogleLogin() {
  const [isGooglePending, startGoogleTransition] = useTransition();

  const handleGoogleLogin = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/mail",

        fetchOptions: {
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    });
  };

  return { handleGoogleLogin, isGooglePending };
}
