"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.1";
const SUMMIT_KEY = "2026.1.info";

declare global {
  interface Window {
    turnstile: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function RegisterInterestPage() {
  const router = useRouter();
  const summitInfo = SUMMIT_METADATA[YEAR];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    comment: "",
  });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>("");
  const [isTurnstileScriptApiAvailable, setIsTurnstileScriptApiAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window.turnstile !== "undefined" && typeof window.turnstile.render === "function") {
      setIsTurnstileScriptApiAvailable(true);
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window.turnstile !== "undefined" && typeof window.turnstile.render === "function") {
      setIsTurnstileScriptApiAvailable(true);
    } else {
      setTimeout(() => {
        if (typeof window.turnstile !== "undefined" && typeof window.turnstile.render === "function") {
          setIsTurnstileScriptApiAvailable(true);
        } else {
          setErrorMessage("Failed to initialise security widget. Please refresh the page.");
        }
      }, 200);
    }
  };

  useEffect(() => {
    let localWidgetId: string | null = null;
    if (isTurnstileScriptApiAvailable && turnstileRef.current && window.turnstile && !turnstileWidgetId) {
      try {
        localWidgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (token: string) => {
            setTurnstileToken(token);
            if (errorMessage) setErrorMessage("");
          },
          "error-callback": () => {
            setTurnstileToken("");
            setErrorMessage("Security verification failed. Please try again.");
            setTurnstileWidgetId("");
          },
          "expired-callback": () => {
            setTurnstileToken("");
            setTurnstileWidgetId("");
          },
          theme: "dark",
          size: "normal",
        });
        setTurnstileWidgetId(localWidgetId);
      } catch (error) {
        console.error("Error rendering Turnstile widget:", error);
        setErrorMessage("Could not display security verification. Please refresh the page.");
      }
    }

    return () => {
      const idToRemove = localWidgetId || turnstileWidgetId;
      if (idToRemove && window.turnstile && typeof window.turnstile.remove === "function") {
        try {
          window.turnstile.remove(idToRemove);
        } catch (removeError) {
          console.warn("Error removing Turnstile widget during cleanup:", removeError);
        }
      }
      setTurnstileWidgetId("");
      setTurnstileToken("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurnstileScriptApiAvailable, errorMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidgetId) {
      window.turnstile.reset(turnstileWidgetId);
      setTurnstileToken("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    if (!turnstileToken) {
      setErrorMessage("Please complete the security verification");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/summit/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
          summit: SUMMIT_KEY,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          comment: "",
        });
        setTurnstileToken("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Registration failed. Please try again.");
        setSubmitStatus("error");
        resetTurnstile();
      }
    } catch (error) {
      console.error("Error submitting interest form:", error);
      setErrorMessage("Network error. Please try again.");
      setSubmitStatus("error");
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" onLoad={handleScriptLoad} async defer />
        <div className="w-full pt-6 pb-2">
          <div className="container mx-auto px-4 md:px-6">
            <Link
              href={`/summit/${YEAR}`}
              className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Summit</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-ferra border-ferra-600 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-rosebud-100">You&apos;re on the list!</CardTitle>
              <CardDescription className="text-rosebud-200">
                We&apos;ll ping you first when {summitInfo.title} ({summitInfo.date}) locks in the program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-rosebud-200">
              <p>
                Expect an update once we lock the weekend plan. Until then, keep an eye on your inbox and the community
                chat — we&apos;ll share working drafts there first.
              </p>
              <Button
                onClick={() => router.push(`/summit/${YEAR}`)}
                className="w-full bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600"
              >
                Return to Summit Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" onLoad={handleScriptLoad} async defer />
      <div className="w-full pt-6 pb-2">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href={`/summit/${YEAR}`}
            className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Summit</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-ferra border-ferra-600 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-rosebud-100">
              Get updates for Summit {YEAR}
            </CardTitle>
            <CardDescription className="text-rosebud-200">
              {summitInfo.theme}
            </CardDescription>
            <CardDescription className="text-rosebud-200">
              This is an early-interest form. We&apos;ll share ticket releases, agenda drops and travel tips as soon as
              they exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Name <span className="text-copperrose">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Company / Team
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent"
                  placeholder="Where you build things"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-rosebud-100 mb-1">
                  What should we know?
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent resize-none"
                  placeholder="Tell us what you hope to test, share or learn in April 2026."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rosebud-100 mb-2">
                  Security Verification <span className="text-copperrose">*</span>
                </label>
                <div ref={turnstileRef} className="flex justify-center">
                  {!isTurnstileScriptApiAvailable && (
                    <div className="w-[300px] h-[65px] bg-ferra-700 border border-ferra-600 rounded-md flex items-center justify-center">
                      <span className="text-rosebud-400 text-sm">Loading security verification...</span>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !turnstileToken || !formData.name.trim()}
                className="w-full bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Save my spot on the update list"}
              </Button>
            </form>
            <p className="text-xs text-rosebud-400 text-center mt-4">
              <span className="text-copperrose">*</span> Required field
            </p>
            {summitInfo.infoNotice && (
              <p className="mt-6 text-sm text-rosebud-200 text-center">
                {summitInfo.infoNotice}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
