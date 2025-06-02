"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QRCode from 'qrcode';
import Image from 'next/image';

// Declare turnstile global object
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: ""
  });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>("");
  const [isTurnstileScriptApiAvailable, setIsTurnstileScriptApiAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationSuccessDetails, setRegistrationSuccessDetails] = useState<{ id: string; ticketUrl: string } | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window.turnstile !== 'undefined' && typeof window.turnstile.render === 'function') {
      setIsTurnstileScriptApiAvailable(true);
    }
  }, []);

  const handleActualScriptLoadEvent = () => {
    if (typeof window.turnstile !== 'undefined' && typeof window.turnstile.render === 'function') {
      setIsTurnstileScriptApiAvailable(true);
    } else {
      console.warn("Turnstile script loaded (onLoad event), but window.turnstile.render not found. Retrying once.");
      setTimeout(() => {
        if (typeof window.turnstile !== 'undefined' && typeof window.turnstile.render === 'function') {
          setIsTurnstileScriptApiAvailable(true);
        } else {
          console.error("Turnstile's render function still not found after script load and delay. Verification may fail.");
          setErrorMessage("Failed to initialize security widget. Please refresh the page.");
        }
      }, 150);
    }
  };

  useEffect(() => {
    let localRenderedWidgetId: string | null = null;

    if (isTurnstileScriptApiAvailable && turnstileRef.current && window.turnstile && !turnstileWidgetId) {
      try {
        localRenderedWidgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (token: string) => {
            setTurnstileToken(token);
            if (errorMessage) setErrorMessage("");
          },
          'error-callback': () => {
            setTurnstileToken("");
            setErrorMessage("Security verification failed. Please try again.");
            setTurnstileWidgetId("");
          },
          'expired-callback': () => {
            setTurnstileToken("");
            setTurnstileWidgetId("");
          },
          theme: 'dark',
          size: 'normal'
        });
        setTurnstileWidgetId(localRenderedWidgetId);
      } catch (error) {
        console.error("Error rendering Turnstile widget:", error);
        setErrorMessage("Could not display security verification. Please try refreshing the page.");
      }
    }

    return () => {
      const idToRemove = localRenderedWidgetId || turnstileWidgetId;
      if (idToRemove && window.turnstile && typeof window.turnstile.remove === 'function') {
        try {
          window.turnstile.remove(idToRemove);
        } catch (removeError) {
          // console.warn("Error removing Turnstile widget during cleanup:", removeError);
        }
      }
      setTurnstileWidgetId("");
      setTurnstileToken("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurnstileScriptApiAvailable, errorMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    // Validate required fields
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }
    
    // Validate Turnstile token
    if (!turnstileToken) {
      setErrorMessage("Please complete the security verification");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch('/api/summit/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
          summit: '2025.2',
          timestamp: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        const successData = await response.json();
        setSubmitStatus('success');
        setRegistrationSuccessDetails({ id: successData.id, ticketUrl: successData.ticketUrl });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          comment: ""
        });
        setTurnstileToken("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed. Please try again.');
        setSubmitStatus('error');
        resetTurnstile();
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection and try again.');
      setSubmitStatus('error');
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (registrationSuccessDetails?.ticketUrl) {
      QRCode.toDataURL(registrationSuccessDetails.ticketUrl, { width: 200 })
        .then(url => setQrDataUrl(url))
        .catch(err => {
          console.error('Failed to generate QR code', err);
          setErrorMessage("Failed to generate QR code for your ticket.");
        });
    }
  }, [registrationSuccessDetails]);

  if (submitStatus === 'success' && registrationSuccessDetails) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          onLoad={handleActualScriptLoadEvent}
          async
          defer
        />
        <div className="w-full pt-6 pb-2">
          <div className="container mx-auto px-4 md:px-6">
            <Link
              href="/summit/2025.2"
              className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Summit</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-ferra border-ferra-600 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-rosebud-100">Registration Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-rosebud-200">
                Thank you for registering for the Homborsund AI Summit 2025.2!
              </p>
              {qrDataUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <Image src={qrDataUrl} alt="Ticket QR Code" className="bg-white p-2 rounded" width={200} height={200} />
                  <Link href={registrationSuccessDetails.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-rosebud-300 hover:text-rosebud-100 underline text-sm">
                    {`${window.location.origin}${registrationSuccessDetails.ticketUrl}`}
                  </Link>
                </div>
              ) : (
                <p className="text-red-500">Could not display QR code. Your ticket ID is: {registrationSuccessDetails.id}</p>
              )}
              <p className="text-rosebud-300 text-sm">
                Your ticket QR code and link are shown above.
                {formData.email && " You will also receive this by email when it&apos;s closer to the summit."}
                {" "}You can also present your name or email at the summit entrance, and we&apos;ll find your registration.
              </p>
              <Button 
                onClick={() => router.push('/summit/2025.2')}
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
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onLoad={handleActualScriptLoadEvent}
        async
        defer
      />
      <div className="w-full pt-6 pb-2">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/summit/2025.2"
            className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Summit</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-ferra border-ferra-600 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-rosebud-100">
              Register for Summit 2025.2
            </CardTitle>
            <p className="text-rosebud-200 mt-2">
              Join us for our third gathering focusing on AI in the physical world
            </p>
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
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent"
                  placeholder="+47 123 45 678"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-none focus:ring-2 focus:ring-copperrose focus:border-transparent resize-none"
                  placeholder="Any questions or comments about the summit..."
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
                {isSubmitting ? "Registering..." : "Register for Summit"}
              </Button>
            </form>

            <p className="text-xs text-rosebud-400 text-center mt-4">
              <span className="text-copperrose">*</span> Required fields
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 