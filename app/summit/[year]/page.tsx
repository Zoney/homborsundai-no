"use client";

import { Conferance } from "@/components/conferance";

type SummitPageProps = {
  params: {
    year: string;
  };
};

export default function SummitPage({ params }: SummitPageProps) {
  return <Conferance year={params.year} />;
}

// Optional: Add a generateStaticParams function if you want to pre-render these pages at build time
// export async function generateStaticParams() {
//   // You can fetch your summit keys here or define them statically
//   const summitYears = ["2024", "2025.1", "2025.2"]; 
//   return summitYears.map((year) => ({
//     year: year,
//   }));
// } 