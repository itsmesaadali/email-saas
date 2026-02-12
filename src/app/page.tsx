'use client';

import { ComponentExample } from "@/components/component-example";
import { LinkAccountButton } from "@/components/link-account-button";

export default function Page() {
  return (
    <div className="space-y-4 p-6">
      <LinkAccountButton/>
 

      <ComponentExample />
    </div>
  );
}
