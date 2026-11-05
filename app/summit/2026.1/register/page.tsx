import { redirect } from "next/navigation";

// Signups for 2026.1 are closed (the summit is over). Old links land on the summit page.
export default function RegisterPage() {
  redirect("/summit/2026.1");
}
