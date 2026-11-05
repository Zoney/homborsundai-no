"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authKlient } from "@/lib/auth-klient";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="justify-start w-full"
      onClick={async () => {
        await authKlient.signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
