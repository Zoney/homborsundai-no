"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { href: string; label: string };
const NAV: NavItem[] = [
  { href: "/summit", label: "Summit" },
  { href: "/notes", label: "Notes" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);


  // Focus first link when opening for quicker navigation
  useEffect(() => {
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 0)
  }, [open])

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ferra-600/50 bg-tarawera/70 backdrop-blur supports-[backdrop-filter]:bg-tarawera/60">
      <div className="container mx-auto h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="font-bold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-rosebud-300 rounded px-1">
            Homborsund AI
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-rosebud-200">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-rosebud-300 rounded px-1 ${
                  isActive(n.href) ? "text-white" : "hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Link href="/summit">
              <Button size="sm" className="bg-copperrose hover:bg-copperrose-600">Upcoming</Button>
            </Link>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden text-white hover:bg-white/5"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-tarawera/95 border-ferra-600">
              <nav className="flex flex-col gap-1 p-2 mt-2">
                {NAV.map((n, i) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    ref={i === 0 ? firstLinkRef : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-md px-3 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-rosebud-300 ${
                      isActive(n.href)
                        ? "bg-ferra/50 text-white"
                        : "text-rosebud-200 hover:bg-ferra/40 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="p-3 border-t border-ferra-600/60">
                <Link href="/summit" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-copperrose hover:bg-copperrose-600">Upcoming</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
