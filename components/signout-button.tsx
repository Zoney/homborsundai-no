"use client";

import { Button } from "@/components/ui/button";
import { authKlient } from "@/lib/auth-klient";

export default function SignOutButton() {
  return (
    <Button
      variant="ghost"
      className="justify-start w-full"
      onClick={async () => {
        await authKlient.signOut();
        location.href = "/";
      }}
    >
      Sign out
    </Button>
  );
}
