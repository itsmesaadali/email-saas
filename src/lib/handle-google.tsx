"use client";

import { useTransition } from "react";
import { authClient } from "./auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useGoogleLogin() {
  const [isGooglePending, startGoogleTransition] = useTransition();
  const router = useRouter();

  const handleGoogleLogin = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully!");
            router.push("/mail");
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    });
  };

  return { handleGoogleLogin, isGooglePending };
}
