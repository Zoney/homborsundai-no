"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_YEAR = "2025.2";

export default function SummitPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/summit/${DEFAULT_YEAR}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-cool text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Summit...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}
