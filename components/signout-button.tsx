"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button
      variant="link"
      className="justify-start"
      onClick={() => signOut({ redirectTo: "/" })}
    >
      Sign out
    </Button>
  );
}
