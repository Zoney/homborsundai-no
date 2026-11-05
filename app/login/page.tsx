import type { Metadata } from "next";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default async function LoginPage(props: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await props.searchParams;
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gradient-cool text-white px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-ferra-600 bg-ferra p-6 shadow-xl space-y-4">
        <h1 className="text-2xl font-bold text-rosebud-100">Log in</h1>
        <p className="text-sm text-rosebud-200">
          See your summit tickets and QR codes in one place. An account is optional: the link in your ticket e-mail always works.
        </p>
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
    </main>
  );
}
