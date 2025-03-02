import { Conferance } from "@/components/conferance";
import Image from "next/image";

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get the year from URL query params, default to "2025" if not provided
  const year = typeof searchParams?.year === 'string' ? searchParams.year : "2025";
  
  return (
    <Conferance year={year} />
  );
}
