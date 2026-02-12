'use client';

import { Button } from "@/components/ui/button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

export default function HomePage() {
  return (
    <>
      <Button
        onClick={async () => {
          const url = await getAurinkoAuthUrl("Google");
          window.location.href = url;
        }}
      >
        Link Account
      </Button>
    </>
  );
}
