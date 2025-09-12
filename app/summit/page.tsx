import { redirect } from "next/navigation";
import { DEFAULT_YEAR } from "@/lib/summit-config";

export default function SummitPage() {
  // Use a server redirect for instant navigation to the latest summit.
  redirect(`/summit/${DEFAULT_YEAR}`);
}
